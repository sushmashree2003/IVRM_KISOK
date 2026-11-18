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
    const list = Object.values(val).filter((x) => typeof x === "object" && x !== null);
    if (list.length > 0) return list;
  }
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { asmay_id, amst_id, MI_Id, month = 0, portalUrl } = body;

    let finalAsmayId = Number(asmay_id || VAPS_API_ENDPOINTS.DEFAULT_ASMAY_ID || 0);
    const instId = Number(MI_Id || VAPS_API_ENDPOINTS.DEFAULT_MI_ID || 0);
    const studentId = Number(amst_id || 0);
    const miSubdomain = (body.MI_Subdomain || body.mI_Subdomain || VAPS_API_ENDPOINTS.DEFAULT_MI_SUBDOMAIN || "").trim();

    // Auto-resolve asmay_id if missing or 0
    if (finalAsmayId <= 0 && studentId > 0) {
      try {
        const detailsEndpoint = portalUrl
          ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
          : VAPS_API_ENDPOINTS.STUDENT_DETAILS;
        const autoPayload: any = {
          asmay_id: 0,
          empid: 0,
          amst_id: studentId,
          MI_Id: instId,
          roleid: 3,
        };
        if (miSubdomain) {
          autoPayload.MI_Subdomain = miSubdomain;
          autoPayload.mI_Subdomain = miSubdomain;
        }
        const detRes = await fetch(detailsEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(autoPayload),
          signal: AbortSignal.timeout(6000),
        });
        if (detRes.ok) {
          const detData = await detRes.json();
          const stuList = extractArray(detData.studetailslist);
          if (stuList.length > 0 && (stuList[0].asmaY_Id || stuList[0].ASMAY_Id)) {
            finalAsmayId = Number(stuList[0].asmaY_Id || stuList[0].ASMAY_Id);
          }
        }
      } catch (err) {
        console.warn("[Events COE API] Could not auto-resolve asmay_id:", err);
      }
    }

    const envEndpoint = (
      readEnv("API_VAPS_STUDENT_EVENTS") ||
      readEnv("API_VAPS_STUDENT_COE") ||
      readEnv("NEXT_PUBLIC_API_VAPS_STUDENT_EVENTS") ||
      VAPS_API_ENDPOINTS.STUDENT_EVENTS
    ).trim();

    const endpoint = envEndpoint;

    const payload: any = {
      asmay_id: finalAsmayId,
      amst_id: studentId,
      month: Number(month || 0),
      MI_Id: instId,
      type: body.type || "1",
      COEE_EStartDate: body.COEE_EStartDate || "",
      COEE_EEndDate: body.COEE_EEndDate || "",
    };
    if (miSubdomain) {
      payload.MI_Subdomain = miSubdomain;
      payload.mI_Subdomain = miSubdomain;
    }

    console.log("[Events COE API] Calling:", endpoint, payload);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Server returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawEvents =
      data.coereport?.$values ||
      data.coereport ||
      data.coereportlist?.$values ||
      data.coereportlist ||
      data.coestudentlist?.$values ||
      data.coestudentlist ||
      data;
    const coereportlist = extractArray(rawEvents).map((e: any) => ({
      ...e,
      COEME_EventName: e.COEME_EventName || e.eventName || e.title || "Campus Event",
      COEME_EventDesc: e.COEME_EventDesc || e.eventDesc || e.desc || "",
      COEE_EStartDate: e.COEE_EStartDate || e.startDate || null,
      COEE_EEndDate: e.COEE_EEndDate || e.endDate || null,
      eventName: e.eventName || e.COEME_EventName || "Campus Event",
      eventDesc: e.eventDesc || e.COEME_EventDesc || "",
    }));

    return NextResponse.json({
      success: true,
      data: {
        coereportlist,
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Events COE API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch COE events" },
      { status: 500 }
    );
  }
}
