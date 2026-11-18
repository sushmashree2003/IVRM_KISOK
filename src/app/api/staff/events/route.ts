import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function readEnv(key: string): string {
  const files = [".env.example", ".env.local", ".env", ".env.development"];
  for (const file of files) {
    try {
      const fullPath = path.join(process.cwd(), file);
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

  if (process.env[key] && process.env[key]!.trim() !== "") {
    return process.env[key]!.trim().replace(/^["']|["']$/g, "");
  }

  return "";
}

function extractArray(val: any): any[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.$values)) return val.$values;
  if (typeof val === "object") {
    if (val.$values && Array.isArray(val.$values)) return val.$values;
    const list = Object.values(val).filter((x) => typeof x === "object" && x !== null);
    if (list.length > 0) return list;
  }
  return [];
}

async function handleEvents(params: {
  asmay_id?: any;
  month?: any;
  MI_Id?: any;
  MI_Subdomain?: string;
  type?: string;
  COEE_EStartDate?: string;
  COEE_EEndDate?: string;
}) {
  try {
    const { asmay_id, month, MI_Id, MI_Subdomain } = params;

    // Strict priority: Read API_VAPS_STAFF_EVENTS directly from env file
    const envEndpoint = (
      readEnv("API_VAPS_STAFF_EVENTS") ||
      readEnv("API_VAPS_STAFF_COE") ||
      readEnv("NEXT_PUBLIC_API_VAPS_STAFF_EVENTS") ||
      VAPS_API_ENDPOINTS.STAFF_COE
    ).trim();

    const endpoint = envEndpoint;

    const currentMonthNum = new Date().getMonth() + 1;
    const finalMonth = month !== undefined && month !== null ? Number(month) : currentMonthNum;

    const miSubdomain = (
      MI_Subdomain ||
      readEnv("MI_Subdomain") ||
      readEnv("NEXT_PUBLIC_MI_SUBDOMAIN") ||
      VAPS_API_ENDPOINTS.DEFAULT_MI_SUBDOMAIN ||
      ""
    ).trim();

    const envAsmayId = Number(
      readEnv("LOGIN_ASMAY_ID") ||
      readEnv("NEXT_PUBLIC_LOGIN_ASMAY_ID") ||
      0
    );

    const resolvedAsmayId = envAsmayId > 0
      ? envAsmayId
      : Number(asmay_id || VAPS_API_ENDPOINTS.DEFAULT_ASMAY_ID || 371);

    const resolvedMiId = Number(
      MI_Id ||
      readEnv("LOGIN_MI_ID") ||
      readEnv("NEXT_PUBLIC_LOGIN_MI_ID") ||
      VAPS_API_ENDPOINTS.DEFAULT_MI_ID ||
      78
    );

    // Exact payload matching Postman working request
    const payload: any = {
      asmay_id: resolvedAsmayId,
      month: finalMonth,
      MI_Id: resolvedMiId,
      type: params.type || "1",
      COEE_EStartDate: params.COEE_EStartDate || "",
      COEE_EEndDate: params.COEE_EEndDate || "",
    };
    if (miSubdomain) {
      payload.MI_Subdomain = miSubdomain;
      payload.mI_Subdomain = miSubdomain;
    }

    console.log("[Staff Events/COE API] Calling env endpoint:", endpoint, payload);

    let rawData: any = null;
    let success = false;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        rawData = await response.json();
        success = true;
      }
    } catch (err: any) {
      console.warn("[Staff Events/COE API] Remote call failed:", err.message || err);
    }

    if (success && rawData) {
      // Unpack coereport / coereportlist / $values from .NET ExpandoObject
      const coeSource =
        rawData.coereport?.$values ||
        rawData.coereport ||
        rawData.coereportlist?.$values ||
        rawData.coereportlist ||
        rawData.coestudentlist?.$values ||
        rawData.coestudentlist ||
        rawData.coelist?.$values ||
        rawData.coelist ||
        rawData.events?.$values ||
        rawData.events ||
        rawData.data?.$values ||
        rawData.data;

      const coereport = extractArray(coeSource);

      if (coereport.length > 0) {
        const events = coereport.map((c: any) => ({
          eventName: c.COEME_EventName || c.COEE_EventsName || c.eventName || c.title || "Campus Event",
          startDate: c.COEE_EStartDate
            ? new Date(c.COEE_EStartDate).toLocaleDateString("en-GB")
            : c.COEE_EventsStartDate
            ? new Date(c.COEE_EventsStartDate).toLocaleDateString("en-GB")
            : c.startDate || "",
          endDate: c.COEE_EEndDate
            ? new Date(c.COEE_EEndDate).toLocaleDateString("en-GB")
            : c.COEE_EventsEndDate
            ? new Date(c.COEE_EventsEndDate).toLocaleDateString("en-GB")
            : c.endDate || "",
          desc: c.COEME_EventDesc || c.COEE_EventsDesc || c.description || c.desc || "",
          eventDesc: c.COEME_EventDesc || c.COEE_EventsDesc || c.description || c.desc || "",
        }));

        return NextResponse.json({
          success: true,
          data: events,
          endpointUsed: endpoint,
          raw: rawData,
        });
      }
    }

    // Return empty list if no remote COE events exist
    return NextResponse.json({
      success: true,
      data: [],
      endpointUsed: endpoint,
      raw: rawData,
    });
  } catch (error: any) {
    console.error("[Staff Events/COE API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load COE events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleEvents(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const asmay_id = searchParams.get("asmay_id") || searchParams.get("asmayId") || "";
  const month = searchParams.get("month") || "";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "";
  const MI_Subdomain = searchParams.get("MI_Subdomain") || searchParams.get("mi_subdomain") || "";
  const type = searchParams.get("type") || "1";
  const COEE_EStartDate = searchParams.get("COEE_EStartDate") || "";
  const COEE_EEndDate = searchParams.get("COEE_EEndDate") || "";
  return handleEvents({ asmay_id, month, MI_Id, MI_Subdomain, type, COEE_EStartDate, COEE_EEndDate });
}
