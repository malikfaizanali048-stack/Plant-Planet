import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/services — submit a quote request or consultant booking
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const request = await (ServiceRequest as any).create(body);
  return NextResponse.json({ request }, { status: 201 });
}

// GET /api/services — admin only, list all service requests
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const requests = await (ServiceRequest as any).find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ requests });
}