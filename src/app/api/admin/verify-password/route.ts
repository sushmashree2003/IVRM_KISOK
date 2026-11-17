import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const submittedPassword = typeof body.password === "string" ? body.password.trim() : "";

    // Read configured admin password from environment variables with fallback
    const configuredPassword = (
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      process.env.password ||
      "SGSNov@321"
    ).trim();

    if (!submittedPassword) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    if (submittedPassword === configuredPassword) {
      return NextResponse.json({
        success: true,
        message: "Administrator access granted.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid administrator password. Access denied.",
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
