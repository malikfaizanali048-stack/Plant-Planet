import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// DELETE /api/work/[id] — admin only
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const item = await (Work as any).findByIdAndDelete(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}