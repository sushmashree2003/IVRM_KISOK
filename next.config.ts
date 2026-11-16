import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Helper to read branding configuration from process.env OR .env files
function readEnvVar(key: string, defaultValue: string = ""): string {
  if (process.env[key] && process.env[key]!.trim() !== "") {
    return process.env[key]!.trim();
  }
  const files = [".env.example", ".env.local", ".env", ".env.development"];
  for (const file of files) {
    try {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split(/\r?\n/);
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
  return defaultValue;
}

const resolvedInstCodeBg =
  readEnvVar("NEXT_PUBLIC_INST_CODE_BGIMAGE") ||
  readEnvVar("INST_CODE_BGIMAGE");

const resolvedBackgroupdlo =
  readEnvVar("NEXT_PUBLIC_BACKGROUPDLO") ||
  readEnvVar("backgroupdlo") ||
  readEnvVar("NEXT_PUBLIC_BACKGROUND_IMAGE") ||
  readEnvVar("BACKGROUND_IMAGE") ||
  readEnvVar("NEXT_PUBLIC_BACKGROUND_LOGO") ||
  readEnvVar("BACKGROUND_LOGO") ||
  resolvedInstCodeBg;

const resolvedInstCode =
  readEnvVar("NEXT_PUBLIC_INST_CODE") ||
  readEnvVar("INST_CODE") ||
  readEnvVar("INSTITUTE_CODE") ||
  (resolvedInstCodeBg && !resolvedInstCodeBg.includes("/") && !resolvedInstCodeBg.includes(".") ? resolvedInstCodeBg : "");

const resolvedLogo =
  readEnvVar("NEXT_PUBLIC_INSTITUTE_LOGO") ||
  readEnvVar("INSTITUTE_LOGO") ||
  readEnvVar("NEXT_PUBLIC_SCHOOL_LOGO") ||
  readEnvVar("SCHOOL_LOGO");

const resolvedName =
  readEnvVar("NEXT_PUBLIC_INSTITUTE_NAME") ||
  readEnvVar("INSTITUTE_NAME") ||
  readEnvVar("NEXT_PUBLIC_SCHOOL_NAME") ||
  readEnvVar("SCHOOL_NAME");

const resolvedMiId =
  readEnvVar("NEXT_PUBLIC_LOGIN_MI_ID") ||
  readEnvVar("LOGIN_MI_ID") ||
  readEnvVar("MI_ID") ||
  readEnvVar("MI_Id");

const resolvedMiSubdomain =
  readEnvVar("NEXT_PUBLIC_MI_SUBDOMAIN") ||
  readEnvVar("MI_Subdomain") ||
  readEnvVar("MI_SUBDOMAIN");

const resolvedAsmayId =
  readEnvVar("NEXT_PUBLIC_LOGIN_ASMAY_ID") ||
  readEnvVar("LOGIN_ASMAY_ID") ||
  readEnvVar("ASMAY_ID") ||
  readEnvVar("ASMAY_Id") ||
  readEnvVar("Y_ID");

const resolvedAsmayYear =
  readEnvVar("NEXT_PUBLIC_LOGIN_ASMAY_YEAR") ||
  readEnvVar("LOGIN_ASMAY_YEAR") ||
  readEnvVar("ASMAY_YEAR");

const nextConfig: NextConfig = {
  // Expose branding & session config to client bundle
  env: {
    NEXT_PUBLIC_INST_CODE: resolvedInstCode,
    NEXT_PUBLIC_INST_CODE_BGIMAGE: resolvedInstCodeBg,
    NEXT_PUBLIC_BACKGROUPDLO: resolvedBackgroupdlo,
    NEXT_PUBLIC_BACKGROUND_IMAGE: resolvedBackgroupdlo,
    NEXT_PUBLIC_INSTITUTE_LOGO: resolvedLogo,
    NEXT_PUBLIC_INSTITUTE_NAME: resolvedName,
    NEXT_PUBLIC_LOGIN_MI_ID: resolvedMiId,
    NEXT_PUBLIC_MI_SUBDOMAIN: resolvedMiSubdomain,
    NEXT_PUBLIC_LOGIN_ASMAY_ID: resolvedAsmayId,
    NEXT_PUBLIC_LOGIN_ASMAY_YEAR: resolvedAsmayYear,
  },

  // Allow dev resources (HMR WebSocket, _next/static, etc.) from LAN, WAN, and tunnel origins
  allowedDevOrigins: [
    // ngrok tunnels (all free and paid subdomains, .app, .dev, and .io)
    "*.ngrok-free.app",
    "**.ngrok-free.app",
    "ngrok-free.app",
    "*.ngrok-free.dev",
    "**.ngrok-free.dev",
    "ngrok-free.dev",
    "madyson-rhinological-ciera.ngrok-free.dev",
    "*.ngrok.app",
    "**.ngrok.app",
    "ngrok.app",
    "*.ngrok.dev",
    "**.ngrok.dev",
    "ngrok.dev",
    "*.ngrok.io",
    "**.ngrok.io",
    "ngrok.io",
    // Alternative tunnels
    "*.trycloudflare.com",
    "**.trycloudflare.com",
    "*.loca.lt",
    "**.loca.lt",
    // LAN & WAN IPv4 ranges (wildcards match any IPv4 address)
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "*.*.*.*",
    // Localhost, mDNS, and local networks
    "*.local",
    "**.local",
    "*.lan",
    "**.lan",
    "localhost",
    "*.localhost",
    "**.localhost",
  ],

  // Allow Server Actions from external origins
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.ngrok-free.app",
        "*.ngrok-free.dev",
        "ngrok-free.dev",
        "madyson-rhinological-ciera.ngrok-free.dev",
        "*.ngrok.app",
        "*.ngrok.dev",
        "*.ngrok.io",
        "*.trycloudflare.com",
        "*.loca.lt",
        "192.168.*.*",
        "10.*.*.*",
        "172.*.*.*",
        "*.*.*.*",
        "*.local",
        "*.lan",
        "localhost:3000",
        "localhost",
      ],
    },
  },

  // CORS headers for incoming API requests across LAN, WAN, and ngrok
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS, PATCH" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With, Accept, ngrok-skip-browser-warning" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
