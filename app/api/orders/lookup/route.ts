import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from "mongoose";

// Compares phone numbers by digits only, ignoring spaces, dashes, "+", and
// country code differences (e.g. "0321-1234567" vs "+92 321 1234567").
function normalizePhone(p: string) {
  return p.replace(/\D/g, "").slice(-10);
}

// GET /api/orders/lookup?id=xxx        — find one order by its ID
// GET /api/orders/lookup?phone=xxx     — find all orders placed with this phone number
// (Either one alone is enough — you don't need both.)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id")?.trim();
    const phone = req.nextUrl.searchParams.get("phone")?.trim();

    if (!id && !phone) {
      return NextResponse.json({ error: "Provide an Order ID or a phone number" }, { status: 400 });
    }

    // Search by ID
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
      }
      const order = await (Order as any).findById(id).lean();
      return NextResponse.json({ orders: order ? [order] : [] });
    }

    // Search by phone (digit-normalized match, could return several orders)
    const target = normalizePhone(phone as string);
    if (!target) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const candidates = await (Order as any).find().sort({ createdAt: -1 }).limit(50).lean();
    const orders = candidates.filter((o: any) => normalizePhone(o.phone || "") === target);

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("Order lookup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}