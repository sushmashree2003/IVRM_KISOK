# 🏫 Green Valley Public School — Smart Campus Kiosk & Role Portal (2026)

A modern, touch-interactive Digital Campus Kiosk and comprehensive Role-Based Portal system built for **Green Valley Public School**. Designed for physical touchscreen kiosk deployment on campus as well as cross-device web portal access.

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

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphic Design System |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Directory Structure

```text
Kiosk2026/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin portal route
│   │   ├── alumni/          # Alumni network route
│   │   ├── login/           # Universal authentication portal
│   │   ├── parent/          # Parent viewer route
│   │   ├── staff/           # Faculty & staff dashboard route
│   │   ├── student/         # Student portal route
│   │   ├── dashboards.css   # Role-specific dashboard themes & styles
│   │   ├── globals.css      # Core global styles, tokens, and animations
│   │   ├── layout.tsx       # Root layout configuration
│   │   └── page.tsx         # Main interactive kiosk landing screen
│   └── components/
│       ├── AdminDashboard.tsx    # Admin interface component
│       ├── AlumniDashboard.tsx   # Alumni network component
│       ├── LoginScreen.tsx       # Role authentication component
│       ├── StaffDashboard.tsx    # Staff management component
│       └── StudentDashboard.tsx  # Student portal component
├── public/                  # Static campus assets & icons
├── package.json             # Scripts & dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sushmashree2003/Kiosk2026.git
   cd Kiosk2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles and optimizes the project for production |
| `npm run start` | Starts the production server after running `build` |
| `npm run lint` | Runs ESLint to check for code style and syntax issues |

---

## 🖥️ Deploying in Kiosk Mode

To run this application on a physical touch kiosk or Raspberry Pi / Intel NUC display:

1. **Build and start production**:
   ```bash
   npm run build
   npm run start
   ```
2. **Launch Chromium in Fullscreen Kiosk Mode**:
   ```bash
   chromium-browser --kiosk --noerrdialogs --disable-infobars --check-for-update-interval=31536000 http://localhost:3000
   ```
3. Alternatively, click the **Maximize (Fullscreen)** button on the top-right corner of the kiosk homepage.

---

## 🤖 Role-Based AI Chatbot System (Groq + NVIDIA NIM)

The kiosk includes a production-ready, serverless role-based AI chatbot architecture powered by **Groq** (for ~300ms ultra-low latency conversational responses) and **NVIDIA NIM** (for deep reasoning, academic predictions, and personalized recommendations).

### 29 Specialized Role Agents Across 4 Groups

| Role Group | Count | Agents Included |
| :--- | :--- | :--- |
| **Student / Parent** | 9 | `StudentAssistant`, `Attendance`, `Academic`, `Exam`, `Fee`, `Transport`, `Notice`, `Learning`, `FamilySupport` |
| **Teacher / Staff** | 8 | `TeacherCopilot`, `Class`, `AttendanceAnalysis`, `Assessment`, `Lesson`, `StaffKnowledge`, `HRLeave`, `Resource` |
| **Visitor / Applicant** | 6 | `Visitor`, `Admission`, `CampusNavigation`, `Appointment`, `Application`, `PublicKnowledge` |
| **Alumni / Ex-Employee** | 6 | `AlumniAssistant`, `Event`, `Records`, `Community`, `Achievement`, `OfficeSupport` |

### API Endpoints

1. **POST `/api/chat`**
   - **Request**: `{ "message": string, "role": string, "history"?: ChatMessage[] }`
   - **Response**: `{ "success": boolean, "answer": string, "role": string, "model": string, "selectedAgent": string, "provider": "groq" | "nvidia" }`
   - **Features**: Automatic routing to Groq or NVIDIA NIM based on query complexity; automatic failover; anti-hallucination guardrails.

2. **POST `/api/plan`**
   - **Request**: `{ "message": string, "role": string }`
   - **Response**: `{ "success": boolean, "intent": string, "selectedAgent": string, "needsPrediction": boolean, "needsRecommendation": boolean, "needsKnowledgeBase": boolean, "provider": "groq" | "nvidia" }`
   - **Features**: Sub-second Groq-powered intent detection with a deterministic keyword heuristic fallback.

### Environment Variables

Configure these in `.env.local` for local development or in **Vercel Project Settings > Environment Variables**:

```bash
# 1. Groq Cloud API (Fast Conversational Response & Planning)
GROQ_API_KEY=your_groq_api_key_here
GROQ_BASE_URL=https://api.groq.com
GROQ_MODEL=openai/gpt-oss-120b

# 2. NVIDIA NIM Cloud (Deep Thinking, Predictions & Recommendations)
NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=moonshotai/kimi-k3
NVIDIA_REASONING_EFFORT=max
NVIDIA_MAX_TOKENS=16384
```

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), import your repository.
3. In **Project Settings > Environment Variables**, add the Groq and NVIDIA variables (`GROQ_API_KEY`, `NVIDIA_API_KEY`, etc.).
4. Click **Deploy**. Both `/api/chat` and `/api/plan` will run as serverless Node.js functions within execution limits.

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

## 📝 License & Attribution

Developed for **Madhuvan Vatika Public School (MVPS)**. Built with Next.js, React, Groq, and NVIDIA NIM.

