import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/work — public, list all portfolio items
export async function GET() {
  await connectDB();
  const items = await (Work as any).find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

// POST /api/work — admin only, add a new image or video
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const item = await (Work as any).create(body);
  return NextResponse.json({ item }, { status: 201 });
}