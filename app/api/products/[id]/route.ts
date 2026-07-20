import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/products/[id] — accepts either Mongo _id or slug
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const isObjectId = mongoose.Types.ObjectId.isValid(params.id);
  const product = isObjectId
    ? await (Product as any).findById(params.id).lean()
    : await (Product as any).findOne({ slug: params.id }).lean();

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

// PUT /api/products/[id] (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const product = await (Product as any).findByIdAndUpdate(params.id, body, { new: true });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

// DELETE /api/products/[id] (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const product = await (Product as any).findByIdAndDelete(params.id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}