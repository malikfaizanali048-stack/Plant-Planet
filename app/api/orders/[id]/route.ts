import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Compares phone numbers by digits only, ignoring spaces, dashes, "+", and
// country code differences (e.g. "0321-1234567" vs "+92 321 1234567").
function phonesMatch(a: string, b: string) {
  const normalize = (p: string) => p.replace(/\D/g, "").slice(-10);
  return normalize(a) === normalize(b) && normalize(a).length > 0;
}

// Returns stock back to each product — used whenever an order is cancelled
// or deleted, so items that never actually shipped go back on the shelf.
async function restockItems(items: { productId: string; qty: number }[]) {
  for (const item of items) {
    await (Product as any).findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } });
  }
}

// GET /api/orders/[id]?phone=03xxxxxxxxx — public order tracking lookup.
// Requires the phone number used on the order as a simple ownership check
// (order IDs are unguessable, but this stops someone with just a leaked ID).
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const phone = req.nextUrl.searchParams.get("phone");
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await (Order as any).findById(params.id).lean();
    if (!order || !phonesMatch((order as any).phone, phone)) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Order lookup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — admin updates order status and/or verifies payment
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const update: Record<string, any> = {};
  if (body.status) update.status = body.status;
  if (typeof body.paymentVerified === "boolean") update.paymentVerified = body.paymentVerified;

  const existing = await (Order as any).findById(params.id);
  if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const isNewlyCancelled = body.status === "Cancelled" && existing.status !== "Cancelled";

  const order = await (Order as any).findByIdAndUpdate(params.id, update, { new: true });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (isNewlyCancelled) {
    await restockItems(order.items);
  }

  return NextResponse.json({ order });
}

// DELETE /api/orders/[id]?phone=03xxxxxxxxx — customer deletes their own order.
// Requires the phone number on the order as an ownership check (same as GET above).
// Once deleted, the order also disappears from the admin panel since it's fully removed.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const phone = req.nextUrl.searchParams.get("phone");
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await (Order as any).findById(params.id);
    if (!order || !phonesMatch(order.phone, phone)) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (["Shipped", "Delivered"].includes(order.status)) {
      return NextResponse.json(
        { error: "This order has already shipped and can no longer be cancelled — please contact us directly." },
        { status: 400 }
      );
    }

    if (order.status !== "Cancelled") {
      await restockItems(order.items);
    }

    await (Order as any).findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Order delete error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}