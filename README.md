# 🏫 IVRM_KISOK — Enterprise Multi-Tenant SaaS Campus Kiosk & Role Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-Ultra--Fast%20LLM-f55036?style=flat-square)](https://groq.com/)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA%20NIM-Deep%20Reasoning-76b900?style=flat-square&logo=nvidia)](https://developer.nvidia.com/nim)
[![ERP Ready](https://img.shields.io/badge/VAPS%20IVRM-ERP%20Connected-0284c7?style=flat-square)](https://azurewebsites.net)

**IVRM_KISOK** is an enterprise-grade, cloud-native **Multi-Tenant SaaS Campus Kiosk and Comprehensive Role-Based Web Portal** built on **Next.js 16 App Router**, **React 19**, and **Tailwind CSS v4**. 

Engineered for educational institutions (K-12 schools, higher education colleges, polytechnics, and multi-campus university trusts), **IVRM_KISOK** serves dual purposes:
1. **Physical On-Campus Touchscreen Kiosks**: Deployed on freestanding touch hardware (42"–65" interactive totems, wall-mounted displays, Raspberry Pi, Intel NUC terminals) in entrance atriums, lobbies, and corridors.
2. **Cross-Platform Responsive Web Portals**: Accessible from any modern browser, mobile device, or tablet for students, teachers, parents, alumni, and administrators.

The system natively bridges to enterprise educational backends (**VAPS IVRM — Virtual Attendance & Processing System / Integrated Virtual Resource Management**) via secure proxy route handlers, while providing a dynamic white-label branding engine and a 29-agent AI Campus Copilot.

---

## 📑 Table of Contents

- [🌟 Key Architectural Highlights](#-key-architectural-highlights)
- [🏢 SaaS Multi-Tenancy & Dynamic White-Labeling](#-saas-multi-tenancy--dynamic-white-labeling)
- [🖥️ Screen-by-Screen Portals & Feature Modules](#️-screen-by-screen-portals--feature-modules)
  - [1. Smart Campus Public Kiosk (`/`)](#1-smart-campus-public-kiosk-)
  - [2. Role Selection Gateway (`/role-selection`)](#2-role-selection-gateway-role-selection)
  - [3. Universal Authentication & Virtual Keyboard (`/login`)](#3-universal-authentication--virtual-keyboard-login)
  - [4. Student Academic Suite (`/student`)](#4-student-academic-suite-student)
  - [5. Staff & Faculty Hub (`/staff`)](#5-staff--faculty-hub-staff)
  - [6. Administrator Command Center (`/admin`)](#6-administrator-command-center-admin)
  - [7. Alumni & Heritage Network (`/alumni`)](#7-alumni--heritage-network-alumni)
  - [8. Visitor & Guest Experience (`/visitor`)](#8-visitor--guest-experience-visitor)
  - [9. Parent Progress Gateway (`/parent`)](#9-parent-progress-gateway-parent)
- [🤖 Role-Based AI Campus Copilot (Groq + NVIDIA NIM)](#-role-based-ai-campus-copilot-groq--nvidia-nim)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Directory Structure](#-project-directory-structure)
- [🔌 Backend VAPS / IVRM API Architecture](#-backend-vaps--ivrm-api-architecture)
- [⚙️ Environment Configuration & Multi-Tenant Setup](#️-environment-configuration--multi-tenant-setup)
- [🚀 Quickstart & Local Development](#-quickstart--local-development)
- [🖥️ Deployment Modes](#️-deployment-modes)
  - [A. Physical Kiosk Hardware (Chromium Fullscreen)](#a-physical-kiosk-hardware-chromium-fullscreen)
  - [B. Cloud SaaS Production (Vercel / Azure / Docker)](#b-cloud-saas-production-vercel--azure--docker)
  - [C. Windows Native Desktop Executable (.exe) & Kiosk Packaging](#c-windows-native-desktop-executable-exe--kiosk-packaging)
- [🔒 Kiosk Hardening & Security Standards](#-kiosk-hardening--security-standards)
- [📝 License & Support](#-license--support)

---

## 🌟 Key Architectural Highlights

- **Multi-Tenant SaaS Foundation**: Serve multiple schools, campuses, and academic years from a single codebase or tenant cluster with zero code modifications.
- **Dynamic White-Label Branding**: Automated extraction of school logos, institute code, formal names, color accents, and AI identity per tenant via `/api/branding`.
- **Complete VAPS / IVRM ERP Integration**: Deep server-side connectivity to existing educational backend services (`LoginFacade`, `StudentDashboardFacade`, `EmployeePtalFacade`, `CumulativeFeeAnalysisFacade`, `LeaveReportFacade`, etc.).
- **Touch-First Kiosk Ergonomics**: Built-in HTML5 Fullscreen API toggle, on-screen virtual keyboard/keypad for password/PIN input on touchscreens, and strict `100dvh` zero-scroll viewport containment.
- **Smart Card / RFID Punch**: Instant authentication and attendance logging via smart card tap (`KioskStudentSmartCardPunch`).
- **29-Agent AI Copilot**: Hybrid multi-agent architecture leveraging **Groq** for ~300ms conversational inference and **NVIDIA NIM** for deep reasoning, academic forecasting, and contextual recommendations.
- **Public Campus Showcase**: Live real-time clock, emergency announcement ticker, student/staff birthday scrolls, sports winner boards, and exam topper spotlights without requiring authentication.

---

## 🏢 SaaS Multi-Tenancy & Dynamic White-Labeling

```
               ┌──────────────────────────────────────────────────────────┐
               │                IVRM_KISOK SaaS Edge                      │
               │        (Next.js 16 App Router on Vercel / Node)          │
               └────────────────────────────┬─────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  Institution 1: BBHS    │     │  Institution 2: MVPS    │     │  Institution 3: BDC     │
│  MI_ID: 6               │     │  MI_ID: 31              │     │  MI_ID: 17              │
│  Logo: bbhs_crest.png   │     │  Logo: mvps_logo.png    │     │  Logo: bdc_shield.png   │
│  Theme: Royal Blue/Gold │     │  Theme: Emerald/Amber   │     │  Theme: Deep Navy/Teal  │
│  AI: "BBHS AI"          │     │  AI: "MVPS AI"          │     │  AI: "BDC AI"           │
└────────────┬────────────┘     └────────────┬────────────┘     └────────────┬────────────┘
             │                               │                               │
             ▼                               ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         VAPS / IVRM Cloud & Dedicated ERP Backends                       │
│      (http://bdcampus.azurewebsites.net  |  https://madhuvanvatikacloud.com:21093)       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

The SaaS engine dynamically reads institutional context and overrides branding, session data, and backend target URLs through:
1. **Dynamic Branding Endpoint (`/api/branding`)**: Evaluates tenant parameters, institution codes (`INST_CODE`), custom subdomains (`MI_Subdomain`), and graphic paths (`INST_CODE_BGIMAGE`), returning configured logos, colors, and the tenant-specific AI copilot name.
2. **Session Engine (`src/lib/session.ts`)**: Decodes user tokens, caches tenant credentials in secure browser session storage, and hydrates UI components with tenant identity.
3. **API Proxy Layer (`src/config/api.ts`)**: Automatically injects `MI_Id`, `ASMAY_Id`, user credentials, and tenant headers into server-side VAPS requests, shielding backend ERP credentials from client bundles.

---

## 🖥️ Screen-by-Screen Portals & Feature Modules

### 1. Smart Campus Public Kiosk (`/`)
*Component: `src/components/CampusInfoPortal.tsx`*
- **Ambient Header**: Live digital clock, dynamic institution branding, fullscreen toggle, quick role access button, and emergency notification ticker.
- **Hero Video & Campus Highlights**: Institutional promo video player (`Madhuvan_Vatika_Public_School_Full_Promo_20s.mp4`), campus motto, and accreditation honors.
- **Dynamic Live Tickers**:
  - 🎂 **Campus Birthdays**: Real-time ticker of students and staff celebrating birthdays today (`/api/kiosk/birthdays`).
  - 🏆 **Sports Champions**: Ticker showcasing inter-school tournament winners and athletics records (`/api/kiosk/sports`).
  - 🎖️ **Academic Toppers**: Hall-of-fame carousel highlighting board exam and semester toppers (`/api/kiosk/toppers`).
- **Interactive Quick Exploration**: 1-click access to Campus Map, Facilities, Photo/Video Gallery, Principal's Message, and Academic Calendar.
- **Floating AI Assistant**: Instant-access campus navigation and query assistant.

### 2. Role Selection Gateway (`/role-selection`)
*Component: `src/components/RoleSelectionScreen.tsx`*
- High-contrast visual role cards tailored for touchscreen kiosks:
  - **Student & Parent Workspace** (Attendance, timetable, fees, report cards)
  - **Faculty & Staff Hub** (Leave, timetable, biometric logs, salary)
  - **Campus Visitor Desk** (Digital visitor passes, directions, admissions)
  - **Alumni Network** (Directory, reunions, mentorship)
  - **Administrator Console** (Metrics, kiosk health, system broadcast)
- Dynamic institution badge and one-tap return to Kiosk Home.

### 3. Universal Authentication & Virtual Keyboard (`/login`)
*Component: `src/components/LoginScreen.tsx`*
- **Role Tabs**: Switch between Student, Staff, Admin, and Alumni logins.
- **On-Screen Touch Keyboard & Numpad**: Toggleable virtual keyboard for touch-only kiosk hardware, eliminating the need for physical peripherals.
- **RFID / Smart Card Tap Prompt**: Dedicated tab for rapid contactless badge authentication (`/api/kiosk/smartcard`).
- **Credential Storage**: Safe remember-me capabilities and instant redirect to the authorized role dashboard.

### 4. Student Academic Suite (`/student`)
*Component: `src/components/StudentDashboard.tsx`*
- **Attendance Tracker**: Subject-wise percentage, monthly attendance graph, and absent day alerts (`/api/student/attendance`).
- **Timetable & Class Schedule**: Interactive day-by-day period schedules with teacher assignments and room locations (`/api/student/timetable`).
- **Exams & Report Cards**: Detailed exam schedules, marks sheets, and semester report card downloads (`/api/student/exam`, `/api/student/exam-overall`).
- **Fee Management**: Ledger breakdown, pending fee alerts, paid receipts, and payment history (`/api/student/fees`).
- **Homework & Daily Assignments**: Due dates, subject attachments, and submission tracking (`/api/student/homework`).
- **Notices & Circulars**: Official school announcements filtered by student grade (`/api/student/notice`).
- **Calendar of Events (COE)**: Upcoming sports, holidays, cultural fests, and exams (`/api/student/events`).

### 5. Staff & Faculty Hub (`/staff`)
*Component: `src/components/StaffDashboard.tsx`*
- **Employee Overview**: Designation, department, employee code, and institutional service record (`/api/staff/details`).
- **Biometric Punch Logs**: IN/OUT daily punch timestamps, attendance status, and late-entry markers (`/api/staff/punch-log`).
- **Class Timetable**: Weekly teaching schedule with subject allocations and period timings (`/api/staff/timetable`).
- **Leave Management**: Leave balance tracker (CL, SL, EL), pending applications, and approval status (`/api/staff/leave`).
- **Salary Statements**: Monthly pay slip breakdown (Basic, HRA, DA, PF deductions, Net Pay) (`/api/staff/salary`).
- **Institutional Events**: Staff meetings, exam duty schedules, and calendar of events (`/api/staff/events`).

### 6. Administrator Command Center (`/admin`)
*Component: `src/components/AdminDashboard.tsx`*
- **Campus Metrics**: Total enrolled students, active faculty count, daily attendance ratios, and fee collection summaries.
- **Kiosk Hardware Diagnostics**: Online status, terminal IP, screen uptime, last sync timestamp, and touch responsiveness.
- **Emergency Broadcast**: Instant campus-wide bulletin ticker publishing for safety drills, weather alerts, or closures.
- **Multi-Tenant Switcher**: Switch and preview branding for multiple schools in a campus trust.

### 7. Alumni & Heritage Network (`/alumni`)
*Component: `src/components/AlumniDashboard.tsx`*
- **Alumni Directory**: Search alumni by graduating year, profession, industry, and city.
- **Mentorship Hub**: Connect current students with verified alumni for career guidance and college counseling.
- **Reunions & Events**: Event registration, milestone anniversaries, and photo archives.
- **Giving & Endowments**: Campus infrastructure projects and scholarship funds.

### 8. Visitor & Guest Experience (`/visitor`)
*Component: `src/components/VisitorDashboard.tsx`*
- **Digital Visitor Pass**: Self-service touch registration generating digital gate passes for parents, vendors, and guests.
- **Interactive Campus Directory**: Departments, administrative offices, and contact extensions.
- **Admissions Desk**: Fee structures, brochures, and application submission portals.
- **Facilities & Virtual Tour**: High-resolution gallery and campus map.

### 9. Parent Progress Gateway (`/parent`)
*Route: `src/app/parent/page.tsx`*
- Unified parent view linking multiple enrolled children.
- Instant access to fee dues, bus transport tracking, homework completion, and attendance summaries.

---

## 🤖 Role-Based AI Campus Copilot (Groq + NVIDIA NIM)

The kiosk includes a production-ready, serverless role-based AI chatbot architecture powered by:
- **Groq Cloud API** (`openai/gpt-oss-120b`): Ultra-low latency conversational responses (~300ms).
- **NVIDIA NIM Cloud** (`moonshotai/kimi-k3`): High-depth reasoning, academic forecasting, and contextual recommendations.

### 29 Specialized Role Agents Across 4 Groups

| Role Group | Agents Count | Included Agents |
| :--- | :---: | :--- |
| **Student & Parent** | 9 | `StudentAssistant`, `Attendance`, `Academic`, `Exam`, `Fee`, `Transport`, `Notice`, `Learning`, `FamilySupport` |
| **Teacher & Staff** | 8 | `TeacherCopilot`, `Class`, `AttendanceAnalysis`, `Assessment`, `Lesson`, `StaffKnowledge`, `HRLeave`, `Resource` |
| **Visitor & Applicant** | 6 | `Visitor`, `Admission`, `CampusNavigation`, `Appointment`, `Application`, `PublicKnowledge` |
| **Alumni & Ex-Employee** | 6 | `AlumniAssistant`, `Event`, `Records`, `Community`, `Achievement`, `OfficeSupport` |

### Chatbot Architecture Endpoints

1. **POST `/api/chat`**
   - **Body**: `{ "message": string, "role": string, "history"?: ChatMessage[] }`
   - **Features**: Automatically injects dynamic tenant branding (`${INST_CODE} AI`), routes to Groq or NVIDIA NIM based on query depth, provides intelligent fallback, and enforces anti-hallucination guardrails.
2. **POST `/api/plan`**
   - **Body**: `{ "message": string, "role": string }`
   - **Features**: Sub-second intent classification and specialized agent assignment.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Core Framework** | **Next.js 16.3.6** | App Router, Server Components, Route Handlers, Edge Optimization |
| **UI Library** | **React 19.2.8** | Modern React with Concurrent Rendering and Transitions |
| **Language** | **TypeScript 5.x** | Full type-safety across DTOs, API payloads, and components |
| **Styling** | **Tailwind CSS v4** | Modern PostCSS engine, CSS custom properties, glassmorphism |
| **Icons** | **Lucide React 1.48.0** | Scalable, touch-friendly icon system |
| **Markdown** | **react-markdown / remark-gfm** | Rich formatted output for AI chatbot replies |
| **AI LLM Inference** | **Groq Cloud API** | Fast conversational agent inference (~300ms) |
| **AI Deep Reasoning** | **NVIDIA NIM** | Multi-step intent planning and reasoning |
| **Backend ERP** | **VAPS / IVRM** | Educational ERP APIs (`LoginFacade`, `StudentDashboardFacade`, etc.) |

---

## 📁 Project Directory Structure

```text
IVRM_KISOK/
├── public/                       # Static public assets, institution brands & icons
│   ├── bdc/brand/                # BD Campus logos & assets
│   ├── mvps/brand/               # Madhuvan Vatika logos & assets
│   └── Madhuvan_Vatika_...mp4    # Campus promo video asset
├── src/
│   ├── app/                      # Next.js 16 App Router Routes
│   │   ├── admin/                # Administrator Command Center
│   │   ├── alumni/               # Alumni & Heritage Network
│   │   ├── api/                  # Server-Side API Handlers & Proxies
│   │   │   ├── branding/         # Dynamic SaaS Tenant Branding Endpoint
│   │   │   ├── chat/             # 29-Agent AI Copilot Chat Endpoint
│   │   │   ├── kiosk/            # Public Kiosk APIs (birthdays, sports, toppers, smartcard)
│   │   │   ├── login/            # Universal Authentication Gateway Proxy
│   │   │   ├── plan/             # AI Agent Routing & Intent Classification
│   │   │   ├── staff/            # Staff Modules (details, timetable, leave, punch-log, salary)
│   │   │   └── student/          # Student Modules (attendance, timetable, fees, exams, homework)
│   │   ├── campus-info/          # Public Campus Information Route
│   │   ├── login/                # Universal Login Route
│   │   ├── parent/               # Parent Gateway Route
│   │   ├── role-selection/       # Interactive Role Selector Route
│   │   ├── staff/                # Staff & Faculty Hub Route
│   │   ├── student/              # Student Portal Route
│   │   ├── visitor/              # Visitor Registration Route
│   │   ├── dashboards.css        # Role-specific dashboard design tokens
│   │   ├── globals.css           # Global typography, glassmorphism & resets
│   │   ├── layout.tsx            # Global Root Layout
│   │   └── page.tsx              # Interactive Kiosk Landing Screen
│   ├── components/               # Production UI Components
│   │   ├── chat/                 # AI Assistant & Markdown Renderers
│   │   ├── AdminDashboard.tsx    # Administrator Console Component
│   │   ├── AlumniDashboard.tsx   # Alumni Network Component
│   │   ├── CampusInfoPortal.tsx  # Standalone Public Kiosk Experience
│   │   ├── LoginScreen.tsx       # Touch Login + Virtual Keyboard Component
│   │   ├── RoleSelectionScreen.tsx # Touch Role Gateway Component
│   │   ├── StaffDashboard.tsx    # Staff Workspace Component
│   │   ├── StudentDashboard.tsx  # Student Academic Suite Component
│   │   └── VisitorDashboard.tsx  # Visitor Experience Component
│   ├── config/
│   │   └── api.ts                # Centralized VAPS Backend Facade Endpoints
│   ├── lib/
│   │   ├── agents/               # 29 AI Agent System Prompts & Registry
│   │   ├── groq.ts               # Groq Cloud SDK Wrapper
│   │   ├── nvidia.ts             # NVIDIA NIM SDK Wrapper
│   │   ├── session.ts            # Dynamic Multi-Tenant Session & Branding Engine
│   │   └── validation.ts         # Input Sanitization & Safety Guardrails
│   └── types/
│       └── auth.ts               # Data Transfer Objects & Session Interfaces
├── .env.example                  # Template configuration for SaaS & VAPS
├── next.config.ts                # Multi-tenant config, remote image hosts & proxy tunnels
├── package.json                  # Scripts & project dependencies
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Master Documentation
```

---

## 🔌 Backend VAPS / IVRM API Architecture

The application acts as a secure, high-performance middleware layer communicating with VAPS IVRM .NET/Java cloud microservices:

| Internal Route | Target VAPS Facade Service | Description |
|---|---|---|
| `POST /api/login` | `${LOGIN_URL}/api/LoginFacade/` | Multi-role user credential verification & JWT session generation |
| `POST /api/kiosk/smartcard` | `${LOGIN_URL}/api/LoginFacade/KioskStudentSmartCardPunch/` | RFID / Smart card badge punch-in |
| `POST /api/student/attendance` | `${PORTAL_URL}/api/StudentDashboardFacade/Getdetails/` | Subject-wise attendance calculation |
| `POST /api/student/timetable` | `${PORTAL_URL}/api/Student_TTFacade/getStudentTT/` | Student weekly period schedules |
| `POST /api/student/fees` | `${PORTAL_URL}/api/CumulativeFeeAnalysisFacade/getloaddata/` | Cumulative fee breakdown & payment history |
| `POST /api/student/exam` | `${PORTAL_URL}/api/ExamReportFacade/getexamdata/` | Exam schedules and report cards |
| `POST /api/student/homework` | `${PORTAL_URL}/api/StudentDashboardFacade/Getdetails/` | Daily homework tasks and syllabus |
| `POST /api/student/notice` | `${PORTAL_URL}/api/StudentDashboardFacade/onclick_notice/` | Target notices and circulars |
| `POST /api/staff/details` | `${PORTAL_URL}/api/EmployeePtalFacade/getdata/` | Staff biographical and service record |
| `POST /api/staff/timetable` | `${PORTAL_URL}/api/EmployeeTTFacade/getdata/` | Teacher teaching schedule |
| `POST /api/staff/leave` | `${LEAVE_URL}/api/LeaveReportFacade/get_report/` | Leave ledger and approval status |
| `POST /api/staff/punch-log` | `${PORTAL_URL}/api/EmployeePunchAttendenceFacade/getrpt/` | Biometric fingerprint/face punch records |
| `POST /api/staff/salary` | `${PORTAL_URL}/api/EmployeeSalaryDetailsFacade/getdaily_data/`| Salary slips and breakdown |
| `GET /api/kiosk/birthdays` | `${BDAY_URL}/api/BirthDayFacade/BindStaff/` | Today's campus student/staff birthdays |
| `GET /api/kiosk/sports` | `${SPORTS_URL}/api/EventsStudentRecordFacade/KioskSportsWinners/` | Sports achievements and medals |
| `GET /api/kiosk/toppers` | `${PORTAL_URL}/api/ExamToppersListFacade/showreport/` | Board exam top performers |

---

## ⚙️ Environment Configuration & Multi-Tenant Setup

Create a `.env.local` file by copying the included `.env.example`:

```bash
cp .env.example .env.local
```

### Essential Tenant & VAPS Variables

```bash
# ------------------------------------------------------------------------------
# 1. Institution Tenant Identification
# ------------------------------------------------------------------------------
LOGIN_MI_ID=6
NEXT_PUBLIC_LOGIN_MI_ID=6
LOGIN_ASMAY_ID=195
NEXT_PUBLIC_LOGIN_ASMAY_ID=195
LOGIN_ASMAY_YEAR="2025-2026"
NEXT_PUBLIC_LOGIN_ASMAY_YEAR="2025-2026"

# ------------------------------------------------------------------------------
# 2. White-Label Branding Overrides
# ------------------------------------------------------------------------------
INST_CODE="BBHS"
NEXT_PUBLIC_INST_CODE="BBHS"
NEXT_PUBLIC_INSTITUTE_NAME="BALDWIN BOYS HIGH SCHOOL"
NEXT_PUBLIC_INSTITUTE_LOGO="https://dcampusstrg.blob.core.windows.net/files/17/ISM_Attachments/1252eb07-a89a-4cb9-a888-14f42c144a0d.png"
INST_CODE_BGIMAGE="https://dcampusstrg.blob.core.windows.net/files/17/ISM_Attachments/1252eb07-a89a-4cb9-a888-14f42c144a0d.png"

# Optional Subdomain multi-tenancy
MI_Subdomain=""
NEXT_PUBLIC_MI_SUBDOMAIN=""

# ------------------------------------------------------------------------------
# 3. VAPS / IVRM Backend Server Endpoints
# ------------------------------------------------------------------------------
LOGIN_URL=http://bdcampus.azurewebsites.net/
PORTAL_URL=http://bdportalhub.azurewebsites.net/
LEAVE_URL=http://bdportalhub.azurewebsites.net/

# Microservice facade overrides
API_VAPS_LOGIN=http://bdcampus.azurewebsites.net/api/LoginFacade/
API_VAPS_STUDENT_ATTENDANCE=http://bdportalhub.azurewebsites.net/api/StudentDashboardFacade/Getdetails/
API_VAPS_STUDENT_TIMETABLE=http://bdportalhub.azurewebsites.net/api/Student_TTFacade/getStudentTT/
API_VAPS_STUDENT_FEES=http://bdportalhub.azurewebsites.net/api/CumulativeFeeAnalysisFacade/getloaddata/
API_VAPS_EXAM_LIST=http://bdportalhub.azurewebsites.net/api/ExamReportFacade/getexamdata/
API_VAPS_EXAM_DETAILS=http://bdportalhub.azurewebsites.net/api/ExamReportFacade/StudentExamDetails/
API_VAPS_STAFF_DETAILS=http://bdportalhub.azurewebsites.net/api/EmployeePtalFacade/getdata/
API_VAPS_STAFF_TIMETABLE=http://bdportalhub.azurewebsites.net/api/EmployeeTTFacade/getdata/
API_VAPS_STAFF_LEAVE=http://bdportalhub.azurewebsites.net/api/LeaveReportFacade/get_report/
API_VAPS_STAFF_PUNCH_LOG=http://bdportalhub.azurewebsites.net/api/EmployeePunchAttendenceFacade/getrpt/
API_VAPS_STAFF_SALARY=http://bdportalhub.azurewebsites.net/api/EmployeeSalaryDetailsFacade/getdaily_data/

# ------------------------------------------------------------------------------
# 4. AI Campus Copilot Engines (Groq + NVIDIA NIM)
# ------------------------------------------------------------------------------
GROQ_API_KEY=your_groq_api_key_here
GROQ_BASE_URL=https://api.groq.com
GROQ_MODEL=openai/gpt-oss-120b

NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=moonshotai/kimi-k3
NVIDIA_REASONING_EFFORT=max
NVIDIA_MAX_TOKENS=16384
```

> **Instant White-Labeling**: Want to deploy for another school (e.g. Madhuvan Vatika Public School)? Simply change:
> ```bash
> INST_CODE="MVPS"
> LOGIN_MI_ID=31
> LOGIN_URL=https://madhuvanvatikacloud.com:21093/
> PORTAL_URL=https://madhuvanvatikacloud.com:21105/
> ```
> The entire kiosk re-brands itself automatically upon the next request.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: `v18.17.0` or higher (`v20.x` / `v22.x` LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Installation
```bash
git clone https://github.com/sushmashree2003/Kiosk2026.git
cd Kiosk2026
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your VAPS endpoint or leave defaults for staging
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🖥️ Deployment Modes

### A. Physical Kiosk Hardware (Chromium Fullscreen)

For dedicated hardware terminals (Raspberry Pi, Intel NUC, Windows IoT, Ubuntu Kiosk):

1. **Start Production Server**:
   ```bash
   npm run build
   npm run start
   ```

2. **Launch Chromium in Dedicated Touch Kiosk Mode**:
   - **Linux / Raspberry Pi**:
     ```bash
     chromium-browser \
       --kiosk \
       --noerrdialogs \
       --disable-infobars \
       --check-for-update-interval=31536000 \
       --overscroll-history-navigation=0 \
       --disable-pinch \
       --touch-events=enabled \
       http://localhost:3000
     ```
   - **Windows**:
     ```powershell
     Start-Process "chrome.exe" -ArgumentList "--kiosk", "--disable-pinch", "http://localhost:3000"
     ```

3. **Built-in Touchscreen Fullscreen Toggle**:
   Users can also simply tap the **Maximize (Fullscreen)** icon located in the upper-right corner of the kiosk interface.

### B. Cloud SaaS Production (Vercel / Azure / Docker)

#### Deploying on Vercel
1. Import repository into [Vercel](https://vercel.com).
2. Set Environment Variables in **Project Settings > Environment Variables** (matching `.env.example`).
3. Deploy! Next.js 16 Route Handlers and Server Components execute as edge/serverless functions.

#### Deploying on Azure App Service / Node.js
```bash
# Production build
npm run build

# Start with host binding
npm run start
```
The server listens on `0.0.0.0:3000`, making it accessible across local LANs, enterprise intranets, and through reverse proxies.

### C. Windows Native Desktop Executable (.exe) & Kiosk Packaging

The kiosk application can be packaged into a native Windows executable (`.exe`) powered by **Electron** and **electron-builder**. This bundles the internal Next.js production server, local proxy routes, and a hardened kiosk browser window into a single distributable binary.

#### 1. Available Executable Formats
- **NSIS Setup Wizard (`Campus-Smart-Kiosk-Setup-<version>.exe`)**: Traditional installer that sets up the kiosk under `Program Files` / user profile, generates desktop & start menu shortcuts, and supports launching on system startup.
- **Standalone Portable (`Campus-Smart-Kiosk-Portable-<version>.exe`)**: Single self-contained `.exe` that launches immediately from any folder or USB drive with zero installation steps.

#### 2. Building the Windows `.exe`

Run the build script from the project root:

```bash
# Clean production Next.js build and package Windows .exe
npm run electron:build
```

*(On Windows PowerShell, use `npm.cmd run electron:build`).*

Once the command completes, the final executables are located in the `dist/` folder:
```
dist/
├── Campus-Smart-Kiosk-Setup-0.1.0.exe      # Windows NSIS Installer
├── Campus-Smart-Kiosk-Portable-0.1.0.exe   # Single Portable Executable
└── win-unpacked/                           # Direct unpacked binaries for fast testing
```

#### 3. Development & Testing Commands

| Command | Purpose |
| :--- | :--- |
| `npm run electron:dev` | Launches the Next.js dev server with the native Electron desktop wrapper |
| `npm run electron:pack` | Compiles Next.js and generates unpacked binary folder in `dist/win-unpacked` |
| `npm run electron:build` | Generates the official Windows `.exe` installer and portable packages in `dist/` |

#### 4. Hardware Kiosk Controls & Shortcuts

The packaged executable runs in hardened Kiosk Mode:
- **True Fullscreen**: Launches edge-to-edge with all window headers, minimize/close buttons, and system taskbars hidden.
- **Admin Emergency Exit**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd> to cleanly terminate both the kiosk window and background Node processes.
- **Maintenance Fullscreen Toggle**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> to switch between fullscreen kiosk and windowed mode for configuration or debugging.

---

## 🔒 Kiosk Hardening & Security Standards

- **Virtual Touchscreen Keypad**: Sensitive passwords and PINs can be typed using the on-screen keypad to prevent physical keylogger exposure on public kiosks.
- **Auto-Logout on Inactivity**: Role sessions automatically expire and wipe cached student/staff details back to the public screen after configurable timeout intervals.
- **Server-Side Credential Masking**: VAPS backend URLs, admin credentials, and AI API keys are never exposed to the client bundle; all queries route via Next.js server-side Route Handlers.
- **Zero-Escape Layout**: Enforced `100dvh` container bounds prevent browser window scrolling, bounce effects, and accidental navigation away from the kiosk environment.
- **Anti-Hallucination Guardrails**: AI Copilot prompt constraints strictly restrict answering to school matters, campus policies, and verified ERP records.

---

## 📝 License & Support

- **System**: **IVRM_KISOK** — Enterprise SaaS Campus Operating Terminal
- **Architecture**: Designed for Multi-Tenant Educational ERP Integration (VAPS IVRM).
- **Inquiries & Deployments**: Contact your institutional ERP administrator or the system maintenance team.

---

*Engineered with precision for modern smart educational campuses.*
