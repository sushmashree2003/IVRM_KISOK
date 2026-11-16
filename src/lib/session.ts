import { LoginResponseDTO, SessionInfo } from "@/types/auth";

const SESSION_STORAGE_KEY = "vaps_kiosk_user_session";
const REMEMBERED_USER_KEY = "vaps_kiosk_remembered_user";
const KIOSK_LOGO_KEY = "kiosk_institute_logo";
const KIOSK_NAME_KEY = "kiosk_institute_name";

function readDiskEnv(key: string): string {
  // Statically check public variables so Next.js Webpack inlines them for client-side builds
  if (key === "backgroupdlo" || key === "NEXT_PUBLIC_BACKGROUPDLO") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_BACKGROUPDLO || (process.env as any)?.backgroupdlo) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }
  if (key === "BACKGROUND_IMAGE" || key === "NEXT_PUBLIC_BACKGROUND_IMAGE") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_BACKGROUND_IMAGE || (process.env as any)?.BACKGROUND_IMAGE) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }
  if (key === "INST_CODE_BGIMAGE" || key === "NEXT_PUBLIC_INST_CODE_BGIMAGE") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_INST_CODE_BGIMAGE || (process.env as any)?.INST_CODE_BGIMAGE) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }
  if (key === "NEXT_PUBLIC_INSTITUTE_NAME" || key === "INSTITUTE_NAME" || key === "SCHOOL_NAME") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_INSTITUTE_NAME || (process.env as any)?.INSTITUTE_NAME) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }
  if (key === "NEXT_PUBLIC_INSTITUTE_LOGO" || key === "INSTITUTE_LOGO" || key === "SCHOOL_LOGO") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_INSTITUTE_LOGO || (process.env as any)?.INSTITUTE_LOGO) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }
  if (key === "NEXT_PUBLIC_INST_CODE" || key === "INST_CODE" || key === "INSTITUTE_CODE") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_INST_CODE || (process.env as any)?.INST_CODE) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }
  if (key === "NEXT_PUBLIC_LOGIN_MI_ID" || key === "LOGIN_MI_ID" || key === "MI_ID" || key === "MI_Id") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_LOGIN_MI_ID || (process.env as any)?.LOGIN_MI_ID) : "";
    if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim().replace(/^["']|["']$/g, "");
  }
  if (key === "NEXT_PUBLIC_LOGIN_ASMAY_ID" || key === "LOGIN_ASMAY_ID" || key === "ASMAY_ID" || key === "ASMAY_Id") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_LOGIN_ASMAY_ID || (process.env as any)?.LOGIN_ASMAY_ID) : "";
    if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim().replace(/^["']|["']$/g, "");
  }
  if (key === "NEXT_PUBLIC_MI_SUBDOMAIN" || key === "MI_Subdomain" || key === "MI_SUBDOMAIN") {
    const val = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_MI_SUBDOMAIN || (process.env as any)?.MI_Subdomain) : "";
    if (val && typeof val === "string" && val.trim() !== "") return val.trim().replace(/^["']|["']$/g, "");
  }

  // Generic process.env access
  if (typeof process !== "undefined" && process.env && (process.env as any)[key] && (process.env as any)[key]!.trim() !== "") {
    return (process.env as any)[key]!.trim().replace(/^["']|["']$/g, "");
  }
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const files = [".env.example", ".env.local", ".env", ".env.development"];
      for (const f of files) {
        const full = path.join(process.cwd(), f);
        if (fs.existsSync(full)) {
          const lines = fs.readFileSync(full, "utf-8").split(/\r?\n/);
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
            const [k, ...rest] = trimmed.split("=");
            if (k.trim() === key) {
              const val = rest.join("=").trim().replace(/^[`'"]+|[`'"]+$/g, "");
              if (val) return val;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return "";
}

/**
 * Resolves the institution logo from environment configuration (INST_CODE_BGIMAGE or NEXT_PUBLIC_INSTITUTE_LOGO).
 *
 * Supports:
 *   1. Direct image paths (e.g. "/mvps/brand/logo.png", "logo.png", "/facilities/library.jpg")
 *   2. Remote image URLs (e.g. "https://...", "http://...")
 *   3. School keywords (e.g. "MVPS", "BDC", "CAMPUS")
 */
export function resolveLogoFromEnv(input?: string): string {
  const raw = (
    input ||
    readDiskEnv("NEXT_PUBLIC_INSTITUTE_LOGO") ||
    readDiskEnv("INSTITUTE_LOGO") ||
    readDiskEnv("NEXT_PUBLIC_SCHOOL_LOGO") ||
    readDiskEnv("SCHOOL_LOGO") ||
    readDiskEnv("NEXT_PUBLIC_INST_CODE_BGIMAGE") ||
    readDiskEnv("INST_CODE_BGIMAGE") ||
    ""
  ).trim().replace(/^["']|["']$/g, "");

  if (!raw) {
    return "";
  }

  // 1. Remote or absolute URL
  if (/^(https?:|\/\/|data:)/i.test(raw)) {
    return raw;
  }

  // 2. Direct file path or image filename
  if (raw.includes("/") || raw.includes("\\") || /\.(png|jpe?g|svg|webp|gif|ico)$/i.test(raw)) {
    const normalised = raw.replace(/\\/g, "/");
    return normalised.startsWith("/") ? normalised : `/${normalised}`;
  }

  // 3. Keyword / Code matching
  const upper = raw.toUpperCase();
  const KEYWORD_MAP: Record<string, string> = {
    MVPS: "/mvps/brand/logo.png",
    BDC: "/bdc/brand/logo.png",
    CAMPUS: "/campus/brand/logo.png",
    DEFAULT: "/mvps/brand/logo.png",
  };

  if (KEYWORD_MAP[upper]) {
    return KEYWORD_MAP[upper];
  }

  // Convention for any other keyword
  return `/${raw.toLowerCase()}/brand/logo.png`;
}

export function resolveNameFromEnv(): string {
  const raw = (
    readDiskEnv("NEXT_PUBLIC_INSTITUTE_NAME") ||
    readDiskEnv("INSTITUTE_NAME") ||
    readDiskEnv("NEXT_PUBLIC_SCHOOL_NAME") ||
    readDiskEnv("SCHOOL_NAME") ||
    ""
  ).trim().replace(/^["']|["']$/g, "");

  if (raw) return raw;

  const codeOrUrl = (
    readDiskEnv("NEXT_PUBLIC_INST_CODE_BGIMAGE") ||
    readDiskEnv("INST_CODE_BGIMAGE") ||
    ""
  ).trim();

  const upper = codeOrUrl.toUpperCase();
  if (upper === "MVPS") return "Madhuvan Vatika - MVPS";
  if (upper === "BDC") return "BD Campus";
  if (upper === "BBHS") return "Baldwin Boys High School";

  return "Baldwin Boys High School";
}

export const DEFAULT_INSTITUTE_LOGO = resolveLogoFromEnv();
export const DEFAULT_INSTITUTE_NAME = resolveNameFromEnv();

/**
 * Safely extracts the institution logo URL from the login response DTO.
 * Supports root mI_Logo / mI_logo / MI_Logo, or nested fillinstition1 / institutedetails structures.
 */
export function extractInstitutionLogo(dto: any): string {
  if (!dto || typeof dto !== "object") return "";

  // 1. Direct properties on root
  const rootLogo = dto.mI_Logo || dto.mI_logo || dto.MI_Logo || dto.initlogo || dto.logo;
  if (rootLogo && typeof rootLogo === "string" && rootLogo.trim() !== "") {
    return rootLogo.trim();
  }

  // 2. fillinstition1 ($values array or standard array)
  const fillinst = dto.fillinstition1?.$values || dto.fillinstition1;
  if (Array.isArray(fillinst) && fillinst.length > 0) {
    const inst = fillinst[0];
    const fillLogo = inst?.mI_Logo || inst?.mI_logo || inst?.MI_Logo;
    if (fillLogo && typeof fillLogo === "string" && fillLogo.trim() !== "") {
      return fillLogo.trim();
    }
  }

  // 3. institutedetails ($values array or standard array)
  const instDetails = dto.institutedetails?.$values || dto.institutedetails;
  if (Array.isArray(instDetails) && instDetails.length > 0) {
    const inst = instDetails[0];
    const detailLogo = inst?.MI_Logo || inst?.mI_Logo || inst?.mI_logo;
    if (detailLogo && typeof detailLogo === "string" && detailLogo.trim() !== "") {
      return detailLogo.trim();
    }
  }

  return "";
}

/**
 * Safely extracts the ASMAY_Id (Academic Year ID) from the login API response DTO.
 * Scans root properties (asmaY_Id, ASMAY_Id, asmay_id, updatedyear),
 * then year arrays (academicYearList, yearlist, yearList, fillinstition1, institutedetails).
 */
export function extractAsmayId(dto: any): number {
  if (!dto || typeof dto !== "object") return 0;

  // 1. Direct properties on root
  const rawId =
    dto.asmaY_Id ??
    dto.ASMAY_Id ??
    dto.asmay_id ??
    dto.asmaY_ID ??
    dto.updatedyear ??
    dto.ASMAY_ID;
  if (rawId && Number(rawId) > 0) {
    return Number(rawId);
  }

  // 2. Year arrays ($values or standard array)
  const yearLists = [
    dto.academicYearList?.$values || dto.academicYearList,
    dto.yearlist?.$values || dto.yearlist,
    dto.yearList?.$values || dto.yearList,
    dto.fillinstition1?.$values || dto.fillinstition1,
    dto.institutedetails?.$values || dto.institutedetails,
  ];

  for (const list of yearLists) {
    if (Array.isArray(list) && list.length > 0) {
      for (const item of list) {
        const id = item?.asmaY_Id ?? item?.ASMAY_Id ?? item?.asmay_id ?? item?.updatedyear;
        if (id && Number(id) > 0) {
          return Number(id);
        }
      }
    }
  }

  return 0;
}

/**
 * Safely extracts the MI_Id (Institution ID) from the login API response DTO.
 */
export function extractMiId(dto: any): number {
  if (!dto || typeof dto !== "object") return 0;

  const rawId =
    dto.MI_Idforlogin ??
    dto.mI_ID ??
    dto.MI_ID ??
    dto.mI_Id ??
    dto.miid ??
    dto.mI_id;
  if (rawId && Number(rawId) > 0) {
    return Number(rawId);
  }

  const lists = [
    dto.fillinstition1?.$values || dto.fillinstition1,
    dto.institutedetails?.$values || dto.institutedetails,
  ];

  for (const list of lists) {
    if (Array.isArray(list) && list.length > 0) {
      const id = list[0]?.mI_ID ?? list[0]?.MI_ID ?? list[0]?.mI_Id;
      if (id && Number(id) > 0) {
        return Number(id);
      }
    }
  }

  return 0;
}

/**
 * Safely extracts the institution name from the login response DTO.
 */
export function extractInstitutionName(dto: any): string {
  if (!dto || typeof dto !== "object") return "";

  // 1. Direct properties on root - prioritising MI_Name
  const rootName =
    dto.MI_Name ||
    dto.mI_Name ||
    dto.instituteName ||
    dto.instname ||
    dto.institutionName ||
    dto.initname;
  if (rootName && typeof rootName === "string" && rootName.trim() !== "") {
    return rootName.trim();
  }

  // 2. institutedetails ($values array or standard array)
  const instDetails = dto.institutedetails?.$values || dto.institutedetails;
  if (Array.isArray(instDetails) && instDetails.length > 0) {
    const inst = instDetails[0];
    const detailName = inst?.MI_Name || inst?.mI_Name || inst?.instituteName;
    if (detailName && typeof detailName === "string" && detailName.trim() !== "") {
      return detailName.trim();
    }
  }

  // 3. fillinstition1 ($values array or standard array)
  const fillinst = dto.fillinstition1?.$values || dto.fillinstition1;
  if (Array.isArray(fillinst) && fillinst.length > 0) {
    const inst = fillinst[0];
    const fillName = inst?.MI_Name || inst?.mI_Name || inst?.instituteName;
    if (fillName && typeof fillName === "string" && fillName.trim() !== "") {
      return fillName.trim();
    }
  }

  return "";
}

/**
 * Retrieves the dynamic institution logo URL.
 * Checks active session, then sessionStorage, then localStorage, falling back to env-resolved logo.
 */
export function getInstituteLogo(): string {
  if (typeof window !== "undefined") {
    try {
      // 1. From Login First (Active session or storage after login)
      const session = getUserSession();
      if (session?.initlogo && session.initlogo.trim() !== "") {
        return session.initlogo.trim();
      }
      const sessionLogo = sessionStorage.getItem("initlogo");
      if (sessionLogo && sessionLogo.trim() !== "") {
        return sessionLogo.trim();
      }
      const savedLogo = localStorage.getItem(KIOSK_LOGO_KEY);
      if (savedLogo && savedLogo.trim() !== "" && savedLogo !== "/mvps/brand/logo.png") {
        return savedLogo.trim();
      }
    } catch (err) {
      // fallback
    }
  }

  // 2. Second priority: If not having login logo, resolve from env (INST_CODE_BGIMAGE path or keyword)
  return resolveLogoFromEnv();
}

/**
 * Retrieves the dynamic institution name.
 * Checks active session, then sessionStorage, then localStorage, falling back to default name.
 */
export function getInstituteName(): string {
  if (typeof window !== "undefined") {
    try {
      const session = getUserSession();
      if (session?.initname && session.initname.trim() !== "") {
        return session.initname.trim();
      }
      const sessionName = sessionStorage.getItem("initname");
      if (sessionName && sessionName.trim() !== "") {
        return sessionName.trim();
      }
      const savedName = localStorage.getItem(KIOSK_NAME_KEY);
      if (
        savedName &&
        savedName.trim() !== "" &&
        savedName !== "Madhuvan Vatika - MVPS" &&
        savedName !== "Green Valley Public School"
      ) {
        return savedName.trim();
      }
    } catch (err) {
      // fallback
    }
  }
  return resolveNameFromEnv();
}

export function resolveCodeFromEnv(): string {
  const explicit = (
    readDiskEnv("NEXT_PUBLIC_INST_CODE") ||
    readDiskEnv("INST_CODE") ||
    readDiskEnv("INSTITUTE_CODE") ||
    ""
  ).trim();
  if (explicit) return explicit.toUpperCase();

  const name = resolveNameFromEnv();
  if (name) {
    if (/balwin|baldwin/i.test(name)) return "BBHS";
    if (/bd campus/i.test(name)) return "BDC";
    if (/madhuvan/i.test(name)) return "MVPS";
    const words = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/);
    if (words.length > 1 && words.length <= 4) {
      return words.map((w) => w[0].toUpperCase()).join("");
    }
  }

  const codeBg = (
    readDiskEnv("NEXT_PUBLIC_INST_CODE_BGIMAGE") ||
    readDiskEnv("INST_CODE_BGIMAGE") ||
    ""
  ).trim();

  if (codeBg && !codeBg.includes("/") && !codeBg.includes("\\") && !codeBg.includes(".")) {
    return codeBg.toUpperCase();
  }

  return "BBHS";
}

/**
 * Retrieves the dynamic institution code (e.g. BBHS, BDC, MVPS).
 */
export function getInstituteCode(): string {
  if (typeof window !== "undefined") {
    try {
      const session = getUserSession();
      if ((session as any)?.instCode && typeof (session as any).instCode === "string") {
        const c = (session as any).instCode.trim().toUpperCase();
        if (c !== "BDC" && c !== "MVPS") return c;
      }
      if (session?.initname) {
        if (/balwin|baldwin/i.test(session.initname)) return "BBHS";
        if (/bd campus/i.test(session.initname)) return "BDC";
        if (/madhuvan/i.test(session.initname)) return "MVPS";
      }
      const sessionCode = sessionStorage.getItem("instCode");
      if (
        sessionCode &&
        sessionCode.trim() !== "" &&
        sessionCode.trim().toUpperCase() !== "BDC" &&
        sessionCode.trim().toUpperCase() !== "MVPS"
      ) {
        return sessionCode.trim().toUpperCase();
      }
      const savedCode = localStorage.getItem("kiosk_institute_code");
      if (
        savedCode &&
        savedCode.trim() !== "" &&
        savedCode.trim().toUpperCase() !== "BDC" &&
        savedCode.trim().toUpperCase() !== "MVPS"
      ) {
        return savedCode.trim().toUpperCase();
      }
    } catch {
      // fallback
    }
  }
  return resolveCodeFromEnv();
}

/**
 * Retrieves dynamic AI assistant name based on institution code (e.g. "BBHS AI", "BDC AI", "MVPS AI").
 */
export function getAiAssistantName(): string {
  const code = getInstituteCode();
  return `${code} AI`;
}

/**
 * Retrieves dynamic institution subdomain (e.g. "bbhs", "bdcampus") strictly from environment.
 * Does not use any manual default - purely env-driven.
 */
export function getMiSubdomain(): string {
  if (typeof window !== "undefined") {
    try {
      const session = getUserSession();
      if ((session as any)?.MI_Subdomain && typeof (session as any).MI_Subdomain === "string") {
        return (session as any).MI_Subdomain.trim();
      }
      const sessionSubdomain = sessionStorage.getItem("MI_Subdomain");
      if (sessionSubdomain && sessionSubdomain.trim() !== "") {
        return sessionSubdomain.trim();
      }
    } catch {
      // ignore
    }
  }
  return (
    readDiskEnv("MI_Subdomain") ||
    readDiskEnv("MI_SUBDOMAIN") ||
    readDiskEnv("NEXT_PUBLIC_MI_SUBDOMAIN") ||
    ""
  ).trim();
}

/**
 * Resolves the dashboard background image/logo from environment configuration.
 * Checked keys: backgroupdlo, NEXT_PUBLIC_BACKGROUPDLO, BACKGROUND_IMAGE, BACKGROUND_LOGO, INST_CODE_BGIMAGE
 */
export function resolveBackgroundFromEnv(): string {
  return (
    readDiskEnv("backgroupdlo") ||
    readDiskEnv("NEXT_PUBLIC_BACKGROUPDLO") ||
    readDiskEnv("BACKGROUND_IMAGE") ||
    readDiskEnv("NEXT_PUBLIC_BACKGROUND_IMAGE") ||
    readDiskEnv("BACKGROUND_LOGO") ||
    readDiskEnv("NEXT_PUBLIC_BACKGROUND_LOGO") ||
    readDiskEnv("INST_CODE_BGIMAGE") ||
    readDiskEnv("NEXT_PUBLIC_INST_CODE_BGIMAGE") ||
    ""
  ).trim().replace(/^["']|["']$/g, "");
}

/**
 * Retrieves the dashboard background image parameter (backgroupdlo) from session or env.
 */
export function getBackgroundLo(): string {
  // 1. Environment configuration is always the authoritative source of truth
  const envBg = resolveBackgroundFromEnv();
  if (envBg && envBg.trim() !== "") {
    return envBg.trim();
  }

  // 2. Fall back to active session or stored cache
  if (typeof window !== "undefined") {
    try {
      const session = getUserSession();
      if (session?.backgroupdlo && session.backgroupdlo.trim() !== "") {
        return session.backgroupdlo.trim();
      }
      const ss = sessionStorage.getItem("backgroupdlo");
      if (ss && ss.trim() !== "") return ss.trim();
      const ls = localStorage.getItem("kiosk_backgroupdlo");
      if (ls && ls.trim() !== "") return ls.trim();
    } catch {
      // ignore
    }
  }
  return "";
}

/**
 * Transforms the API LoginResponseDTO into the sessionInfo structure
 * exactly as performed in the reference project:
 * D:\Sushma\Kiosk\Old kiosk\vaps demo school\vaps demo school\KioskHub\LoginForm.cs
 */
export function createSessionFromLoginDTO(
  dto: LoginResponseDTO,
  fallbackRole: string = "student",
  fallbackUsername: string = "User"
): SessionInfo {
  const rolename = dto.roleforlogin || (typeof dto.role === "string" ? dto.role : fallbackRole);
  const empid = Number(dto.empcode || dto.emp_Id || 0);

  // 1. Resolve MI_Id from login API response first; fallback to env
  const defaultMiId = Number(
    readDiskEnv("NEXT_PUBLIC_LOGIN_MI_ID") ||
    readDiskEnv("LOGIN_MI_ID") ||
    readDiskEnv("MI_ID") ||
    readDiskEnv("MI_Id") ||
    0
  );
  const mi_id = extractMiId(dto) || defaultMiId;

  // 2. Resolve MI_Subdomain strictly from login API response or env only (no manual static fallback)
  const miSubdomain = (
    dto.MI_Subdomain ||
    dto.mI_Subdomain ||
    readDiskEnv("MI_Subdomain") ||
    readDiskEnv("MI_SUBDOMAIN") ||
    readDiskEnv("NEXT_PUBLIC_MI_SUBDOMAIN") ||
    ""
  ).trim();

  // 3. Resolve ASMAY_Id (year id) from login API response first; fallback to env
  const defaultAsmayId = Number(
    readDiskEnv("NEXT_PUBLIC_LOGIN_ASMAY_ID") ||
    readDiskEnv("LOGIN_ASMAY_ID") ||
    readDiskEnv("ASMAY_ID") ||
    readDiskEnv("ASMAY_Id") ||
    readDiskEnv("Y_ID") ||
    0
  );
  const asmay_id = extractAsmayId(dto) || defaultAsmayId;

  // 4. Resolve ASMAY_Year from DTO first, then from env
  const defaultAsmayYear = (
    readDiskEnv("NEXT_PUBLIC_LOGIN_ASMAY_YEAR") ||
    readDiskEnv("LOGIN_ASMAY_YEAR") ||
    readDiskEnv("ASMAY_YEAR") ||
    ""
  ).trim();
  const asmay_year = dto.ASMAY_Year || dto.asmaY_Year || defaultAsmayYear;

  const initname = extractInstitutionName(dto) || DEFAULT_INSTITUTE_NAME;
  const initlogo = extractInstitutionLogo(dto) || DEFAULT_INSTITUTE_LOGO;
  const backgroupdlo = (
    dto.backgroupdlo ||
    dto.backgroundlogo ||
    dto.backgroundImage ||
    resolveBackgroundFromEnv()
  ).trim();

  return {
    username: dto.userName || fallbackUsername,
    ASMAY_Year: asmay_year,
    ASMAY_Id: asmay_id,
    AMST_ID: Number(dto.AMST_ID || dto.amsT_Id || 0),
    UserId: Number(dto.userId || 0),
    RoleId: Number(dto.roleId || 0),
    Rolename: rolename,
    Empid: empid,
    initname: initname,
    initlogo: initlogo,
    instCode: resolveCodeFromEnv(),
    MI_Subdomain: miSubdomain,
    backgroupdlo: backgroupdlo,
    miid: mi_id,
    img: initlogo || "",
    roleforlogin: rolename,
    loginTime: new Date().toISOString(),
    rawResponse: dto,
  };
}

/**
 * Stores session data in browser `sessionStorage` (and individual keys matching reference C# sessionInfo),
 * and optionally in `localStorage` if rememberMe is enabled.
 */
export function saveUserSession(session: SessionInfo, rememberMe: boolean = false): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Unified JSON object
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // 2. Individual keys matching C# `sessionInfo` class for direct access
    sessionStorage.setItem("username", session.username || "");
    sessionStorage.setItem("ASMAY_Year", session.ASMAY_Year || "");
    sessionStorage.setItem("ASMAY_Id", String(session.ASMAY_Id ?? 0));
    sessionStorage.setItem("AMST_ID", String(session.AMST_ID ?? 0));
    sessionStorage.setItem("UserId", String(session.UserId ?? 0));
    sessionStorage.setItem("RoleId", String(session.RoleId ?? 0));
    sessionStorage.setItem("Rolename", session.Rolename || "");
    sessionStorage.setItem("Empid", String(session.Empid ?? 0));
    sessionStorage.setItem("initname", session.initname || "");
    sessionStorage.setItem("initlogo", session.initlogo || "");
    sessionStorage.setItem("instCode", (session as any).instCode || resolveCodeFromEnv());
    sessionStorage.setItem("MI_Subdomain", session.MI_Subdomain || "");
    sessionStorage.setItem("backgroupdlo", session.backgroupdlo || resolveBackgroundFromEnv());
    sessionStorage.setItem("miid", String(session.miid ?? 0));
    sessionStorage.setItem("img", session.img || "");
    sessionStorage.setItem("roleforlogin", session.roleforlogin || "");

    // Persist kiosk branding and background across sessions
    if (session.backgroupdlo && session.backgroupdlo.trim() !== "") {
      localStorage.setItem("kiosk_backgroupdlo", session.backgroupdlo.trim());
    }
    if (session.initlogo && session.initlogo.trim() !== "") {
      localStorage.setItem(KIOSK_LOGO_KEY, session.initlogo.trim());
    }
    if (session.initname && session.initname.trim() !== "") {
      localStorage.setItem(KIOSK_NAME_KEY, session.initname.trim());
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_USER_KEY, JSON.stringify({
        username: session.username,
        role: session.roleforlogin,
      }));
    } else {
      localStorage.removeItem(REMEMBERED_USER_KEY);
    }
  } catch (error) {
    console.error("Failed to save session data to sessionStorage:", error);
  }
}

/**
 * Retrieves the current session info from `sessionStorage`.
 */
export function getUserSession(): SessionInfo | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionInfo;
  } catch (error) {
    console.error("Failed to parse user session from sessionStorage:", error);
    return null;
  }
}

/**
 * Clears the session from `sessionStorage` (e.g. on logout or returning to kiosk home).
 */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("ASMAY_Year");
    sessionStorage.removeItem("ASMAY_Id");
    sessionStorage.removeItem("AMST_ID");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("RoleId");
    sessionStorage.removeItem("Rolename");
    sessionStorage.removeItem("Empid");
    sessionStorage.removeItem("initname");
    sessionStorage.removeItem("initlogo");
    sessionStorage.removeItem("backgroupdlo");
    sessionStorage.removeItem("miid");
    sessionStorage.removeItem("img");
    sessionStorage.removeItem("roleforlogin");
  } catch (error) {
    console.error("Failed to clear session data:", error);
  }
}

/**
 * Checks if a user is currently logged in with active session data.
 */
export function isUserLoggedIn(): boolean {
  return getUserSession() !== null;
}

/**
 * Retrieves any remembered username for auto-fill on kiosk screens.
 */
export function getRememberedUser(): { username: string; role: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(REMEMBERED_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
