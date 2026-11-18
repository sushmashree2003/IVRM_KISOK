import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CampusInfoData } from "@/types/campus";

function readEnvVar(key: string): string {
  const files = [".env.local", ".env", ".env.development", ".env.example"];
  for (const file of files) {
    try {
      const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const lines = fs.readFileSync(fullPath, "utf-8").split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
          const [k, ...rest] = trimmed.split("=");
          if (k.trim() === key) {
            const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
            if (val) return val;
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return process.env[key]?.trim().replace(/^["']|["']$/g, "") || "";
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "campus_info.json");
    let data: CampusInfoData;

    if (fs.existsSync(dataFilePath)) {
      const fileRaw = fs.readFileSync(dataFilePath, "utf-8");
      data = JSON.parse(fileRaw);
    } else {
      return NextResponse.json({ error: "Campus info configuration not found" }, { status: 404 });
    }

    // Baseline fallback from .env without mutating .env
    const envInstituteName =
      readEnvVar("NEXT_PUBLIC_INSTITUTE_NAME") ||
      readEnvVar("INSTITUTE_NAME") ||
      readEnvVar("NEXT_PUBLIC_SCHOOL_NAME") ||
      "";

    const envLogo =
      readEnvVar("NEXT_PUBLIC_INSTITUTE_LOGO") ||
      readEnvVar("INSTITUTE_LOGO") ||
      readEnvVar("INST_CODE_BGIMAGE") ||
      "";

    const envAiName =
      readEnvVar("NEXT_PUBLIC_AI_NAME") ||
      readEnvVar("AI_NAME") ||
      readEnvVar("NEXT_PUBLIC_AI_ASSISTANT_NAME") ||
      readEnvVar("AI_ASSISTANT_NAME") ||
      "";

    if (!data.branding.instituteName && envInstituteName) {
      data.branding.instituteName = envInstituteName;
    }
    if (!data.branding.logo && envLogo) {
      data.branding.logo = envLogo;
    }
    if (!data.branding.aiName && envAiName) {
      data.branding.aiName = envAiName;
    } else if (!data.branding.aiName && data.branding.shortCode) {
      data.branding.aiName = `${data.branding.shortCode} AI`;
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("[API /api/kiosk/campus-info] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load campus info" }, { status: 500 });
  }
}
