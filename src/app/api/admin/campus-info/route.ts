import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CampusInfoData } from "@/types/campus";

export const dynamic = "force-dynamic";

function syncEnvFile(fileName: string, updates: Record<string, string>) {
  try {
    const envPath = path.join(/*turbopackIgnore: true*/ process.cwd(), fileName);
    if (!fs.existsSync(envPath)) return;
    let content = fs.readFileSync(envPath, "utf-8");
    for (const [key, val] of Object.entries(updates)) {
      if (!val) continue;
      const regex = new RegExp(`^(\\s*${key}\\s*=).*$`, "m");
      if (regex.test(content)) {
        content = content.replace(regex, `${key}="${val.replace(/"/g, '\\"')}"`);
      } else {
        content += `\n${key}="${val.replace(/"/g, '\\"')}"\n`;
      }
    }
    fs.writeFileSync(envPath, content, "utf-8");
  } catch (err) {
    console.warn(`[API /api/admin/campus-info] Could not sync ${fileName}:`, err);
  }
}

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "campus_info.json");
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
    }
    const raw = fs.readFileSync(dataFilePath, "utf-8");
    const data: CampusInfoData = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to read configuration" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload: CampusInfoData = await req.json();

    if (!payload || !payload.branding || !payload.leadership || !payload.facilities) {
      return NextResponse.json({ error: "Invalid campus info payload structure" }, { status: 400 });
    }

    const dataDirPath = path.join(process.cwd(), "src", "data");
    if (!fs.existsSync(dataDirPath)) {
      fs.mkdirSync(dataDirPath, { recursive: true });
    }

    const dataFilePath = path.join(dataDirPath, "campus_info.json");
    const backupFilePath = path.join(dataDirPath, "campus_info.backup.json");

    // Create automatic safety backup if previous file exists
    if (fs.existsSync(dataFilePath)) {
      try {
        fs.copyFileSync(dataFilePath, backupFilePath);
      } catch {
        // Non-blocking
      }
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(payload, null, 2), "utf-8");

    // Automatically synchronize institution variables into .env and .env.local
    const envUpdates: Record<string, string> = {};
    if (payload.branding.instituteName) {
      envUpdates["NEXT_PUBLIC_INSTITUTE_NAME"] = payload.branding.instituteName;
    }
    if (payload.branding.logo) {
      envUpdates["NEXT_PUBLIC_INSTITUTE_LOGO"] = payload.branding.logo;
      envUpdates["INST_CODE_BGIMAGE"] = payload.branding.logo;
    }
    if (payload.branding.shortCode) {
      envUpdates["NEXT_PUBLIC_INST_CODE"] = payload.branding.shortCode;
      envUpdates["INST_CODE"] = payload.branding.shortCode;
    }
    if (payload.branding.aiName) {
      envUpdates["NEXT_PUBLIC_AI_NAME"] = payload.branding.aiName;
      envUpdates["AI_NAME"] = payload.branding.aiName;
    }

    if (Object.keys(envUpdates).length > 0) {
      syncEnvFile(".env", envUpdates);
      syncEnvFile(".env.local", envUpdates);
    }

    return NextResponse.json({
      success: true,
      message: "Campus information published successfully to Kiosk displays",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API /api/admin/campus-info] Write error:", error);
    return NextResponse.json({ error: error.message || "Failed to save configuration" }, { status: 500 });
  }
}
