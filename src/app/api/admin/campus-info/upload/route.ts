import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Maximum allowed upload size (500MB for media/videos)
const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (parseErr: any) {
      console.error("[Upload API] FormData parse error:", parseErr);
      const isBoundaryOrSizeError =
        parseErr?.message?.includes("boundary") ||
        parseErr?.cause?.message?.includes("boundary") ||
        parseErr?.message?.includes("FormData");

      return NextResponse.json(
        {
          error: isBoundaryOrSizeError
            ? "File upload exceeded the maximum allowed size (500MB) or transfer was interrupted."
            : `Failed to parse upload: ${parseErr?.message || "Invalid form data"}`,
        },
        { status: 413 }
      );
    }

    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `File size (${sizeMb}MB) exceeds the 500MB maximum limit.`,
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize category & generate safe filename
    const safeCategory = category.replace(/[^a-z0-9_-]/gi, "");
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeCategory);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".jpg";
    const timestamp = Date.now();
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-z0-9_-]/gi, "_").substring(0, 30);
    const fileName = `${sanitizedBase}_${timestamp}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeCategory}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
