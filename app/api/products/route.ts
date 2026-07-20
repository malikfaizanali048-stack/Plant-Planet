import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/products?search=&category=&hotDeal=true&minPrice=&maxPrice=
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const hotDeal = searchParams.get("hotDeal");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const query: Record<string, any> = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (category && category !== "all") {
    query.category = category;
  }
  if (hotDeal === "true") {
    query.isHotDeal = true;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await (Product as any).find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

// POST /api/products (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const slug = body.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product = await (Product as any).create({ ...body, slug: `${slug}-${Date.now().toString(36)}` });
  return NextResponse.json({ product }, { status: 201 });
}