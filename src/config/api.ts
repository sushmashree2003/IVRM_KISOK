/**
 * Centralized API Configuration based on legacy VAPS Kiosk reference:
 * D:\Sushma\Kiosk\Old kiosk\vaps demo school\vaps demo school\App.config
 */

if (typeof process !== "undefined" && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

let loadedEnvCache: Record<string, string> | null = null;

function loadAllEnvFiles(): Record<string, string> {
  if (loadedEnvCache !== null) return loadedEnvCache;
  const envMap: Record<string, string> = {};

  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");

      const searchDirs: string[] = [
        process.cwd(),
        typeof process.execPath === "string" ? path.dirname(process.execPath) : "",
        (process as any).resourcesPath || "",
        (process as any).resourcesPath ? path.join((process as any).resourcesPath, "app") : "",
        path.resolve(process.cwd(), ".."),
      ].filter(Boolean);

      const files = [".env.local", ".env.production", ".env", ".env.development", ".env.example"];

      for (const dir of searchDirs) {
        for (const f of files) {
          try {
            const full = path.join(/*turbopackIgnore: true*/ dir, f);
            if (fs.existsSync(full)) {
              const lines = fs.readFileSync(full, "utf-8").split(/\r?\n/);
              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
                const [k, ...rest] = trimmed.split("=");
                const key = k.trim();
                const val = rest.join("=").trim().replace(/^[`'"]+|[`'"]+$/g, "");
                if (key && envMap[key] === undefined) {
                  envMap[key] = val;
                }
              }
            }
          } catch {
            // ignore per-file errors
          }
        }
      }
    } catch {
      // ignore
    }
  }

  loadedEnvCache = envMap;
  return loadedEnvCache;
}

function getEnv(key: string, fallback: string = ""): string {
  if (typeof process !== "undefined" && process.env && process.env[key] && process.env[key]!.trim() !== "") {
    return process.env[key]!.trim();
  }
  const fileEnvs = loadAllEnvFiles();
  if (fileEnvs[key] && fileEnvs[key].trim() !== "") {
    return fileEnvs[key].trim();
  }
  return fallback;
}

const DEFAULT_FALLBACK_LOGIN = "https://stgeorgesschoolerp.azurewebsites.in:30036";
const DEFAULT_FALLBACK_PORTAL = "https://stgeorgesschoolerp.azurewebsites.in:30029";

const BASE_PORTAL = (getEnv("PORTAL_URL") || DEFAULT_FALLBACK_PORTAL).replace(/\/+$/, "");
const BASE_LOGIN = (getEnv("LOGIN_URL") || DEFAULT_FALLBACK_LOGIN).replace(/\/+$/, "");
const BASE_BDAY = (getEnv("BDAY_URL") || BASE_PORTAL).replace(/\/+$/, "");
const BASE_LEAVE = (getEnv("LEAVE_URL") || BASE_PORTAL).replace(/\/+$/, "");
const BASE_SPORTS = (getEnv("SPORTS_URL") || BASE_PORTAL).replace(/\/+$/, "");

function cleanUrl(val: string | undefined, fallback: string): string {
  if (val && typeof val === "string" && val.trim() !== "") {
    let clean = val.trim().replace(/^[`'"]+|[`'"]+$/g, "");
    clean = clean.replace(/\$\{?PORTAL_URL\}?/g, BASE_PORTAL);
    clean = clean.replace(/\$\{?LOGIN_URL\}?/g, BASE_LOGIN);
    clean = clean.replace(/\$\{?LEAVE_URL\}?/g, BASE_LEAVE);
    return clean;
  }
  return fallback;
}

// External Backend VAPS APIs (Invoked server-side via Next.js Route Handlers)
export const VAPS_API_ENDPOINTS = {
  // Base URLs
  LOGIN_URL: getEnv("LOGIN_URL") || BASE_LOGIN,
  PORTAL_URL: getEnv("PORTAL_URL") || BASE_PORTAL,
  BDAY_URL: getEnv("BDAY_URL") || BASE_BDAY,
  LEAVE_URL: getEnv("LEAVE_URL") || BASE_LEAVE,
  SPORTS_URL: getEnv("SPORTS_URL") || BASE_SPORTS,
  DEFAULT_MI_ID: getEnv("LOGIN_MI_ID") || getEnv("NEXT_PUBLIC_LOGIN_MI_ID") || getEnv("MI_ID") || getEnv("MI_Id") || "",
  DEFAULT_MI_SUBDOMAIN: getEnv("MI_Subdomain") || getEnv("MI_SUBDOMAIN") || getEnv("NEXT_PUBLIC_MI_SUBDOMAIN") || "",
  DEFAULT_BACKGROUPDLO: getEnv("backgroupdlo") || getEnv("NEXT_PUBLIC_BACKGROUPDLO") || getEnv("BACKGROUND_IMAGE") || getEnv("NEXT_PUBLIC_BACKGROUND_IMAGE") || getEnv("BACKGROUND_LOGO") || getEnv("INST_CODE_BGIMAGE") || "",
  DEFAULT_ASMAY_ID: getEnv("LOGIN_ASMAY_ID") || getEnv("NEXT_PUBLIC_LOGIN_ASMAY_ID") || getEnv("ASMAY_ID") || getEnv("ASMAY_Id") || getEnv("Y_ID") || "",
  DEFAULT_ASMAY_YEAR: getEnv("LOGIN_ASMAY_YEAR") || getEnv("NEXT_PUBLIC_LOGIN_ASMAY_YEAR") || getEnv("ASMAY_YEAR") || "",
  DEFAULT_MO_ID: getEnv("MO_ID") || getEnv("MO_Id") || "",

  // Authentication & Smart Card Punch
  LOGIN_FACADE: cleanUrl(getEnv("API_VAPS_LOGIN"), `${BASE_LOGIN}/api/LoginFacade/`),
  SMARTCARD_PUNCH: `${BASE_LOGIN}/api/LoginFacade/KioskStudentSmartCardPunch/`,

  // Student Modules (Env-driven with automatic fallback)
  STUDENT_DETAILS: cleanUrl(getEnv("API_VAPS_STUDENT_DETAILS"), `${BASE_PORTAL}/api/StudentDashboardFacade/Getdetails/`),
  STUDENT_ATTENDANCE: cleanUrl(getEnv("API_VAPS_STUDENT_ATTENDANCE"), `${BASE_PORTAL}/api/StudentDashboardFacade/Getdetails/`),
  STUDENT_FEES: cleanUrl(getEnv("API_VAPS_STUDENT_FEES"), `${BASE_PORTAL}/api/CumulativeFeeAnalysisFacade/getloaddata/`),
  STUDENT_EVENTS: cleanUrl(getEnv("API_VAPS_STUDENT_EVENTS"), `${BASE_PORTAL}/api/COEFacade/getcoedata/`),
  STUDENT_NOTICES: cleanUrl(getEnv("API_VAPS_STUDENT_NOTICES"), `${BASE_PORTAL}/api/StudentDashboardFacade/onclick_notice/`),
  STUDENT_HOMEWORK: cleanUrl(getEnv("API_VAPS_STUDENT_HOMEWORK"), `${BASE_PORTAL}/api/StudentDashboardFacade/Getdetails/`),
  STUDENT_TIMETABLE: cleanUrl(getEnv("API_VAPS_STUDENT_TIMETABLE"), `${BASE_PORTAL}/api/Student_TTFacade/getStudentTT/`),
  EXAM_LIST: cleanUrl(getEnv("API_VAPS_EXAM_LIST"), `${BASE_PORTAL}/api/ExamReportFacade/getexamdata/`),
  EXAM_SUBJECTS: cleanUrl(getEnv("API_VAPS_EXAM_SUBJECTS"), `${BASE_PORTAL}/api/CumulativeSubjectFacade/getSubjectsdata/`),
  EXAM_DETAILS: cleanUrl(getEnv("API_VAPS_EXAM_DETAILS"), `${BASE_PORTAL}/api/ExamReportFacade/StudentExamDetails/`),

  // Staff Modules (All read from env file only)
  EMPLOYEE_DETAILS: cleanUrl(
    getEnv("API_VAPS_STAFF_DETAILS") || getEnv("API_VAPS_EMPLOYEE_DETAILS"),
    `${BASE_PORTAL}/api/EmployeePtalFacade/getdata/`
  ),
  EMPLOYEE_TIMETABLE: cleanUrl(
    getEnv("API_VAPS_STAFF_TIMETABLE") || getEnv("API_VAPS_EMPLOYEE_TIMETABLE"),
    `${BASE_PORTAL}/api/EmployeeTTFacade/getdata/`
  ),
  EMPLOYEE_LEAVE: cleanUrl(
    getEnv("API_VAPS_STAFF_LEAVE") || getEnv("API_VAPS_EMPLOYEE_LEAVE"),
    `${BASE_LEAVE}/api/LeaveReportFacade/get_report/`
  ),
  EMPLOYEE_PUNCH_LOG: cleanUrl(
    getEnv("API_VAPS_STAFF_PUNCH_LOG") || getEnv("API_VAPS_EMPLOYEE_PUNCH_LOG"),
    `${BASE_PORTAL}/api/EmployeePunchAttendenceFacade/getrpt/`
  ),
  EMPLOYEE_SALARY: cleanUrl(
    getEnv("API_VAPS_STAFF_SALARY") || getEnv("API_VAPS_EMPLOYEE_SALARY"),
    `${BASE_PORTAL}/api/EmployeeSalaryDetailsFacade/getdaily_data/`
  ),
  EMPLOYEE_SALARY_YEARS: cleanUrl(
    getEnv("API_VAPS_STAFF_SALARY_YEARS"),
    `${BASE_PORTAL}/api/EmployeeSalaryDetailsFacade/getdata/`
  ),
  STAFF_COE: cleanUrl(
    getEnv("API_VAPS_STAFF_EVENTS") || getEnv("API_VAPS_STAFF_COE"),
    `${BASE_PORTAL}/api/COEFacade/getcoedata/`
  ),

  // Public Campus Kiosk Modules
  STUDENT_BIRTHDAYS: cleanUrl(getEnv("API_VAPS_STUDENT_BIRTHDAYS"), `${BASE_BDAY}/api/BirthDayFacade/BindStaff/`),
  STAFF_BIRTHDAYS: cleanUrl(getEnv("API_VAPS_STAFF_BIRTHDAYS"), `${BASE_BDAY}/api/BirthDayFacade/getstaffdetails/`),
  SPORTS_WINNERS: cleanUrl(getEnv("API_VAPS_SPORTS_WINNERS"), `${BASE_SPORTS}/api/EventsStudentRecordFacade/KioskSportsWinners/`),
  EXAM_TOPPERS: cleanUrl(getEnv("API_VAPS_EXAM_TOPPERS"), `${BASE_PORTAL}/api/ExamToppersListFacade/showreport/`),
  KIOSK_GALLERY: cleanUrl(getEnv("API_VAPS_KIOSK_GALLERY"), `${BASE_PORTAL}/api/IVRM_GalleryFacade/kioskvideo/`),
};

// Client-Side Next.js API Routes (Invoked from UI Dashboards & Components)
export const CLIENT_API_ENDPOINTS = {
  // Auth
  LOGIN: getEnv("NEXT_PUBLIC_API_LOGIN", "/api/login"),
  SMARTCARD_PUNCH: "/api/kiosk/smartcard",

  // Student Routes
  DETAILS: "/api/student/details",
  ATTENDANCE: getEnv("NEXT_PUBLIC_API_ATTENDANCE", "/api/student/attendance"),
  FEES: "/api/student/fees",
  EVENTS: "/api/student/events",
  NOTICES: "/api/student/notice",
  HOMEWORK: "/api/student/homework",
  TIMETABLE: getEnv("NEXT_PUBLIC_API_TIMETABLE", "/api/student/timetable"),
  EXAM: getEnv("NEXT_PUBLIC_API_EXAM", "/api/student/exam"),
  EXAM_OVERALL: "/api/student/exam-overall",

  // Staff Routes (Read from env file only)
  STAFF_DETAILS: getEnv("NEXT_PUBLIC_API_STAFF_DETAILS", "/api/staff/details"),
  STAFF_TIMETABLE: getEnv("NEXT_PUBLIC_API_STAFF_TIMETABLE", "/api/staff/timetable"),
  STAFF_LEAVE: getEnv("NEXT_PUBLIC_API_STAFF_LEAVE", "/api/staff/leave"),
  STAFF_PUNCH_LOG: getEnv("NEXT_PUBLIC_API_STAFF_PUNCH_LOG", "/api/staff/punch-log"),
  STAFF_SALARY: getEnv("NEXT_PUBLIC_API_STAFF_SALARY", "/api/staff/salary"),
  STAFF_EVENTS: getEnv("NEXT_PUBLIC_API_STAFF_EVENTS", "/api/staff/events"),

  // Kiosk Home Features
  KIOSK_BIRTHDAYS: "/api/kiosk/birthdays",
  KIOSK_SPORTS: "/api/kiosk/sports",
  KIOSK_TOPPERS: "/api/kiosk/toppers",

  DEFAULT_SERVER_URL: getEnv("NEXT_PUBLIC_LOGIN_URL") || getEnv("LOGIN_URL") || "",
  DEFAULT_MI_ID: getEnv("NEXT_PUBLIC_LOGIN_MI_ID") || getEnv("LOGIN_MI_ID") || getEnv("MI_ID") || getEnv("MI_Id") || "",
  DEFAULT_MI_SUBDOMAIN: getEnv("NEXT_PUBLIC_MI_SUBDOMAIN") || getEnv("MI_Subdomain") || getEnv("MI_SUBDOMAIN") || "",
  DEFAULT_BACKGROUPDLO: getEnv("NEXT_PUBLIC_BACKGROUPDLO") || getEnv("backgroupdlo") || getEnv("NEXT_PUBLIC_BACKGROUND_IMAGE") || getEnv("BACKGROUND_IMAGE") || getEnv("INST_CODE_BGIMAGE") || "",
  DEFAULT_ASMAY_ID: getEnv("NEXT_PUBLIC_LOGIN_ASMAY_ID") || getEnv("LOGIN_ASMAY_ID") || getEnv("ASMAY_ID") || getEnv("ASMAY_Id") || getEnv("Y_ID") || "",
  DEFAULT_ASMAY_YEAR: getEnv("NEXT_PUBLIC_LOGIN_ASMAY_YEAR") || getEnv("LOGIN_ASMAY_YEAR") || getEnv("ASMAY_YEAR") || "",
};
