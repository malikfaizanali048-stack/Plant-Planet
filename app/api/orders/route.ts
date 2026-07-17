import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/orders — place a new order (COD or already-paid Card order)
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const subtotal = body.items.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);
  const deliveryCharge = subtotal < 5000 ? 500 : 0;
  const total = subtotal + deliveryCharge;

  const order = await Order.create({
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
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}
