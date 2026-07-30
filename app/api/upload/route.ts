import { NextRequest, NextResponse } from "next/server";

// POST /api/upload — accepts multipart form-data with a "file" field
// Converts to base64 data URI and stores it directly (fine for MVP-scale catalog).
// Swap this for Cloudinary/S3 later if the product catalog grows large.
//
// Video note: this is capped much lower than you'd want for real video hosting.
// Vercel serverless functions cap request bodies around ~4.5MB, and MongoDB caps
// a single document around 16MB — base64 also inflates file size by ~33%. So this
// only works for short, compressed clips. For anything longer/heavier, use the
// "paste a video URL" option instead (a real direct file link — YouTube unlisted,
// Cloudinary, etc. — not a Google Drive share link, which serves an HTML viewer
// page rather than the raw file and won't play in a <video> tag).
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 3 * 1024 * 1024 : 4 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isVideo
            ? "Video must be under 3MB — keep clips short and compressed, or paste a video URL instead."
            : "Image must be under 4MB",
        },
        { status: 400 }
      );
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