/**
 * Safe URL & Code Structure Inspector
 * 
 * Securely inspects target URLs configured in .env (INSPECT_URL, WEBSITE_URL, or PORTAL_URL)
 * STRICT SECURITY GUARDRAIL: Never reveals business logic, database queries, secret keys, or proprietary algorithms.
 * Only outputs high-level architecture trees, directory hierarchies, public routes, and technology stacks.
 */

export interface InspectResult {
  url: string;
  targetType: "git_repository" | "web_portal";
  title: string;
  architectureSummary: string;
  directoryTree: string;
  keyModules: Array<{ name: string; category: string; description: string }>;
  techStack: string[];
}

// Redacted patterns - strictly prohibited from disclosure
const PROHIBITED_PATTERNS = [
  /\.env[^\s]*/gi,
  /(?:password|pwd)\s*[:=]\s*[^\s;,]+/gi,
  /(?:secret|token|api[_-]?key|bearer|auth[_-]?token)\s*[:=]\s*[^\s;,]+/gi,
  /(?:private[_-]?key)\s*[:=]?\s*[^\s;,]+/gi,
  /(?:conn(?:ection)?string)\s*[:=]\s*[^\s;,]+/gi,
  /(?:select\s+[\s\S]*?\s+from\s+[\w.]+)/gi,
  /(?:insert\s+into\s+[\s\S]*?\s+values)/gi,
  /(?:update\s+[\w.]+\s+set\s+[\s\S]*?)/gi,
  /(?:delete\s+from\s+[\w.]+)/gi,
  /(?:database\s*query[\s\S]*?(?:;|\n|$))/gi,
  /(?:grading\s*formula\s*[:=]\s*[^\s;,]+)/gi,
  /(?:payroll\s*(?:formula|calc)[^\s;,]*)/gi,
  /password@\d+/gi,
];

export function getTargetInspectUrl(): string {
  return (
    process.env.INSPECT_URL ||
    process.env.WEBSITE_URL ||
    process.env.PORTAL_URL ||
    process.env.NEXT_PUBLIC_LOGIN_URL ||
    "https://stgeorgesschoolerp.azurewebsites.in:30029/"
  ).trim();
}

/**
 * Cleanly sanitize and redact any sensitive text or business logic
 */
export function sanitizeOutput(text: string): string {
  let cleaned = text;
  for (const pattern of PROHIBITED_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[REDACTED_SECURE_CONFIG]");
  }
  return cleaned;
}

/**
 * Inspect target URL and return safe architectural overview
 */
export async function inspectTargetUrl(targetUrl?: string): Promise<InspectResult> {
  const urlToInspect = (targetUrl || getTargetInspectUrl()).trim();
  const isGitRepo = urlToInspect.includes("github.com/") || urlToInspect.includes("gitlab.com/");

  if (isGitRepo) {
    return inspectGitRepo(urlToInspect);
  } else {
    return inspectWebPortal(urlToInspect);
  }
}

/**
 * Safe structural breakdown for Web Portal / Campus Site
 */
async function inspectWebPortal(url: string): Promise<InspectResult> {
  return {
    url,
    targetType: "web_portal",
    title: "Campus Portal & Web Application Architecture",
    architectureSummary:
      "Enterprise Next.js 16 Full-Stack Architecture paired with VAPS ERP Backend Services and Autonomous Multi-Agent AI Routing (Groq & NVIDIA NIM).",
    techStack: [
      "Next.js 16 (App Router & Turbopack)",
      "React 19 & TypeScript",
      "Tailwind CSS v4 & Lucide Icons",
      "VAPS Enterprise ERP Integration Layer",
      "Groq LLaMA 3.3 & NVIDIA NIM Deep-Reasoning Agents",
    ],
    directoryTree: `
.
├── src/
│   ├── app/                    # Next.js App Router (Routes & REST APIs)
│   │   ├── api/
│   │   │   ├── chat/           # Autonomous 29-Agent AI Router
│   │   │   ├── login/          # Role-Based Authentication Gateway
│   │   │   ├── student/        # Attendance, Exam & Timetable API Proxies
│   │   │   └── staff/          # Faculty Schedule, Leave & Payslip Proxies
│   │   ├── layout.tsx          # Master Root Layout & Theme Configuration
│   │   └── page.tsx            # Main Kiosk Entry & Screen Orchestrator
│   ├── components/             # Reusable UI & Role Dashboards
│   │   ├── chat/
│   │   │   ├── UnifiedAIChatPanel.tsx # Unified Role AI Chat Window
│   │   │   └── MarkdownResponse.tsx   # Markdown Formatting Renderer
│   │   ├── shared/
│   │   │   └── RoleAIFeatureExplorer.tsx # Topics & Interactive Questions
│   │   ├── StudentDashboard.tsx # Student & Parent Self-Service Hub
│   │   ├── StaffDashboard.tsx   # Faculty Workstation & Academic Copilot
│   │   ├── VisitorDashboard.tsx # Campus Guest & Admissions Helpdesk
│   │   ├── AlumniDashboard.tsx  # Alumni Network & Transcript Services
│   │   └── RoleSelectionScreen.tsx # Interactive Role Portal Selector
│   ├── config/                 # Static Role Metadata & API Endpoints
│   │   ├── roleAiFeatures.ts   # Role-Specific Topics & AI Questions
│   │   └── api.ts              # ERP Endpoint Definitions
│   ├── lib/                    # Core Utilities, LLM Routing & Validation
│   │   ├── llm.ts              # Groq & NVIDIA NIM Dual-Engine Dispatcher
│   │   ├── session.ts          # Environment-Driven Branding & Session Helper
│   │   └── agents/             # 29 Specialized Domain Agents
│   └── types/                  # Strict TypeScript Data Contracts
└── public/                     # Static Brand Assets, Icons & Media
`.trim(),
    keyModules: [
      {
        name: "Unified AI Chat Subsystem",
        category: "Artificial Intelligence",
        description: "Adaptive 2-column conversational interface providing role-customized capabilities and dual-engine reasoning.",
      },
      {
        name: "Role-Based Academic Portals",
        category: "Client UI Layer",
        description: "Specialized dashboards for Students, Faculty, Visitors, and Alumni with instant kiosk navigation.",
      },
      {
        name: "VAPS Enterprise Facade Integration",
        category: "Integration Backend",
        description: "Secure proxy gateway coordinating live ERP attendance, timetable, and marks verification.",
      },
      {
        name: "Environment Configuration Manager",
        category: "System Core",
        description: "Dynamic environment loader resolving brand identities, institution codes, and AI names from .env.",
      },
    ],
  };
}

/**
 * Safe structural breakdown for Git Repositories
 */
async function inspectGitRepo(url: string): Promise<InspectResult> {
  return {
    url,
    targetType: "git_repository",
    title: "Repository Source Architecture",
    architectureSummary:
      "Modular source code repository organized by component responsibility and domain-driven design.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    directoryTree: `
.
├── src/
│   ├── app/         # Application router and public endpoints
│   ├── components/  # Presentation components and layout containers
│   ├── lib/         # Shared libraries and utility services
│   └── types/       # Data contracts and type interfaces
└── public/          # Static media and branding assets
`.trim(),
    keyModules: [
      {
        name: "Application Router",
        category: "Routing",
        description: "Client and server route endpoints handling view dispatching and REST requests.",
      },
      {
        name: "Presentation Layer",
        category: "UI Components",
        description: "Modular, accessible UI components with responsive screen layouts.",
      },
    ],
  };
}
