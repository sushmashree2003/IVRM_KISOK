import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  resolveCodeFromEnv,
  resolveLogoFromEnv,
  resolveNameFromEnv,
  resolveBackgroundFromEnv,
  getAiAssistantName,
} from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Ensures .env and .env.local are in sync with .env.example
 */
function syncEnvFiles() {
  try {
    const cwd = process.cwd();
    const examplePath = path.join(cwd, ".env.example");
    if (fs.existsSync(examplePath)) {
      const exampleContent = fs.readFileSync(examplePath, "utf-8");
      const targetFiles = [".env", ".env.local"];
      for (const target of targetFiles) {
        const targetPath = path.join(cwd, target);
        if (!fs.existsSync(targetPath) || fs.readFileSync(targetPath, "utf-8") !== exampleContent) {
          fs.writeFileSync(targetPath, exampleContent, "utf-8");
        }
      }
    }
  } catch {
    // ignore
  }
}

/**
 * GET /api/branding
 * Dynamically resolves the institution code, name, logo, AI name, and background image (backgroupdlo)
 * strictly from the environment configuration with zero caching.
 */
export async function GET() {
  // Sync changes from .env.example if modified
  syncEnvFiles();

  const code = resolveCodeFromEnv() || "BBHS";
  const name = resolveNameFromEnv();
  const logo = resolveLogoFromEnv();
  const backgroupdlo = resolveBackgroundFromEnv();
  const aiName = getAiAssistantName();

  return NextResponse.json(
    {
      success: true,
      code,
      logo,
      name,
      aiName,
      backgroupdlo,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

