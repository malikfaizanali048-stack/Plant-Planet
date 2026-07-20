import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/orders — place a new order (COD or Bank Transfer)
// Atomically deducts stock for every item; if any item doesn't have enough
// stock left, the whole order is rejected and any stock already deducted
// for earlier items in the same request is rolled back.
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const subtotal = body.items.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);
  const deliveryCharge = subtotal < 5000 ? 500 : 0;
  const total = subtotal + deliveryCharge;

  const decremented: { productId: string; qty: number }[] = [];

  for (const item of body.items) {
    const updated = await (Product as any).findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } },
      { new: true }
    );

    if (!updated) {
      // Roll back any stock already deducted earlier in this same order
      for (const d of decremented) {
        await (Product as any).findByIdAndUpdate(d.productId, { $inc: { stock: d.qty } });
      }
      return NextResponse.json(
        { error: `Sorry, "${item.name}" doesn't have enough stock left. Please refresh your cart and try again.` },
        { status: 400 }
      );
    }

    decremented.push({ productId: item.productId, qty: item.qty });
  }

  const order = await (Order as any).create({
    ...body,
    subtotal,
    deliveryCharge,
    total,
    status: "Pending",
  });

  return NextResponse.json({ order }, { status: 201 });
}

// GET /api/orders — admin only, list all orders
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const orders = await (Order as any).find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}