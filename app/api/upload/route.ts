import { NextRequest, NextResponse } from "next/server";

// POST /api/upload — accepts multipart form-data with a "file" field
// Converts to base64 data URI and stores it directly (fine for MVP-scale catalog).
// Swap this for Cloudinary/S3 later if the product catalog grows large.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 4MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUri });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
