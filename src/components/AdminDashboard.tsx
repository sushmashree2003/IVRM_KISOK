"use client";

import React, { useState, useEffect, useRef } from "react";
import MarkdownResponse from "@/components/chat/MarkdownResponse";
import { getUserSession, clearUserSession, getInstituteLogo, getInstituteName, getAiAssistantName } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import PortalCmsManager from "@/components/admin/PortalCmsManager";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Award,
  Building2,
  Activity,
  Sparkles,
  User,
  Users,
  X,
  Play,
  Bell,
  Quote,
  RefreshCw,
  GraduationCap,
  BarChart3,
  FileCheck,
  ClipboardList,
  ShieldCheck,
  Lock,
  Cpu,
  IndianRupee,
  TrendingUp,
  Bus,
  Zap,
  Wifi,
  UserCheck,
  Maximize,
  Minimize,
  Home,
  Megaphone,
  Bot,
  Send,
  Briefcase,
  Fingerprint,
  AlertCircle,
  CreditCard,
  Film,
  Layers,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

type ActiveScreen = "dashboard" | "attendance" | "finance" | "admissions" | "profile" | "aispace" | "portal-cms";

// Official Inspiring Slogans & Leadership Wisdom for Governance
const ADMIN_SLOGANS = [
  {
    quote: "Leadership is not about being in charge. It is about taking care of those in your charge.",
    author: "Simon Sinek",
    badge: "Institutional Vision",
  },
  {
    quote: "Integrity is doing the right thing, even when no one is watching. Excellence follows integrity.",
    author: "C. S. Lewis",
    badge: "Campus Governance",
  },
  {
    quote: "To lead tomorrow, we must innovate today with empathy, transparency, and unyielding purpose.",
    author: "Dr. A. P. J. Abdul Kalam",
    badge: "Visionary Leadership",
  },
  {
    quote: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell",
    badge: "Operations Creed",
  },
  {
    quote: "The function of leadership is to produce more leaders, not more followers.",
    author: "Ralph Nader",
    badge: "Institutional Stewardship",
  },
];

// Official Administrative Directives & Circulars
const ADMIN_NOTICES = [
  {
    id: 1,
    tag: "GOVERNANCE",
    tagColor: "#15803d",
    tagBg: "#dcfce7",
    title: "CBSE Affiliation Renewal (2026-2031) Formally Ratified",
    time: "1h ago",
    date: "14 Oct 2026",
    authority: "Central Board of Secondary Education",
    details: "Institutional board affiliation has been extended for another 5-year cycle with Grade A++ accreditation status. Full compliance documentation has been archived into the institutional audit locker.",
  },
  {
    id: 2,
    tag: "SAFETY",
    tagColor: "#2563eb",
    tagBg: "#dbeafe",
    title: "Transport Fleet GPS & Speed Governor Compliance Audit Completed",
    time: "Today",
    date: "14 Oct 2026",
    authority: "State Transport Directorate",
    details: "All 38 campus buses have successfully cleared the bi-annual GPS telemetry and speed governor safety inspection. Real-time telemetry is broadcast to parent dashboard apps with zero route deviations reported.",
  },
  {
    id: 3,
    tag: "FINANCE",
    tagColor: "#d97706",
    tagBg: "#fef3c7",
    title: "Quarterly Audit & Fee Reconciliation Milestone Achieved",
    time: "Yesterday",
    date: "13 Oct 2026",
    authority: "Finance & Accounts Board",
    details: "Term-2 tuition fee collection has reached 88.1% of projected target (₹ 62.4 Lakhs reconciled). Automated SMS and email payment reminders have been queued for the remaining 11.9% outstanding dues.",
  },
  {
    id: 4,
    tag: "CAMPUS",
    tagColor: "#7c3aed",
    tagBg: "#f5f3ff",
    title: "Smart Solar Grid 96% Energy Self-Sufficiency Milestone",
    time: "2d ago",
    date: "12 Oct 2026",
    authority: "Campus Infrastructure Command",
    details: "The rooftop solar photovoltaic array generated 48.2 kWh today, operating at 96% peak efficiency and powering 100% of campus smart boards, laboratories, and HVAC systems.",
  },
];

// Grade-wise Campus Attendance Telemetry
const CLASS_ATTENDANCE_DATA = [
  { class: "Class 10 A", total: 42, present: 41, absent: 1, pct: "97.6%", teacher: "Mr. Ramesh Kumar" },
  { class: "Class 10 B", total: 40, present: 39, absent: 1, pct: "97.5%", teacher: "Mrs. Sunita Deshmukh" },
  { class: "Class 9 A", total: 44, present: 42, absent: 2, pct: "95.5%", teacher: "Mr. David Wilson" },
  { class: "Class 9 B", total: 39, present: 38, absent: 1, pct: "97.4%", teacher: "Mrs. Kavitha Menon" },
  { class: "Class 8 A", total: 45, present: 44, absent: 1, pct: "97.8%", teacher: "Mr. Suresh Hegde" },
  { class: "Class 8 B", total: 43, present: 41, absent: 2, pct: "95.3%", teacher: "Mrs. Deepa Nair" },
  { class: "Class 7 A", total: 46, present: 45, absent: 1, pct: "97.8%", teacher: "Mrs. Rachel Thomas" },
  { class: "Class 7 B", total: 44, present: 42, absent: 2, pct: "95.5%", teacher: "Mr. Ashok Patil" },
  { class: "Class 6 A", total: 48, present: 47, absent: 1, pct: "97.9%", teacher: "Mrs. Meenakshi Rao" },
  { class: "Class 6 B", total: 47, present: 45, absent: 2, pct: "95.7%", teacher: "Mr. Vikram Joshi" },
];

// Fee Reconciliation & Collections by Grade
const FINANCE_RECONCILIATION = [
  { grade: "Class 10 (A & B)", strength: 82, target: "₹ 14,76,000", collected: "₹ 13,57,920", dues: "₹ 1,18,080", pct: "92.0%", status: "Nominal" },
  { grade: "Class 9 (A & B)", strength: 83, target: "₹ 14,94,000", collected: "₹ 13,14,720", dues: "₹ 1,79,280", pct: "88.0%", status: "Nominal" },
  { grade: "Class 8 (A & B)", strength: 88, target: "₹ 14,08,000", collected: "₹ 12,39,040", dues: "₹ 1,68,960", pct: "88.0%", status: "Nominal" },
  { grade: "Class 7 (A & B)", strength: 90, target: "₹ 13,50,000", collected: "₹ 11,88,000", dues: "₹ 1,62,000", pct: "88.0%", status: "Nominal" },
  { grade: "Class 6 (A & B)", strength: 95, target: "₹ 13,30,000", collected: "₹ 11,43,800", dues: "₹ 1,86,200", pct: "86.0%", status: "Follow-up" },
];

// Admissions Pipeline (AY 2026-27 Desk)
const ADMISSIONS_PIPELINE = [
  { appNo: "ADM-2026-104", name: "Aarav S. Deshmukh", grade: "Class 6", parent: "Dr. Sandeep Deshmukh", date: "12 Oct 2026", status: "Seat Confirmed", badgeBg: "#dcfce7", badgeColor: "#15803d" },
  { appNo: "ADM-2026-105", name: "Kavya R. Nair", grade: "Class 7", parent: "Capt. Rajesh Nair", date: "13 Oct 2026", status: "Interview Passed", badgeBg: "#dbeafe", badgeColor: "#1d4ed8" },
  { appNo: "ADM-2026-106", name: "Ishan M. Joshi", grade: "Class 9", parent: "Mr. Manoj Joshi", date: "13 Oct 2026", status: "Document Verification", badgeBg: "#fef3c7", badgeColor: "#b45309" },
  { appNo: "ADM-2026-107", name: "Diya P. Patel", grade: "Class 8", parent: "Mrs. Prerna Patel", date: "14 Oct 2026", status: "Interview Scheduled", badgeBg: "#f3e8ff", badgeColor: "#7e22ce" },
  { appNo: "ADM-2026-108", name: "Siddharth Verma", grade: "Class 10", parent: "Mr. Amit Verma", date: "14 Oct 2026", status: "Under Review", badgeBg: "#fee2e2", badgeColor: "#b91c1c" },
  { appNo: "ADM-2026-109", name: "Anika K. Sundaram", grade: "Class 6", parent: "Prof. K. Sundaram", date: "14 Oct 2026", status: "Seat Confirmed", badgeBg: "#dcfce7", badgeColor: "#15803d" },
];

export default function AdminDashboard({ onBackToKiosk }: DashboardProps) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>("portal-cms");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Widget state
  const [sloganIndex, setSloganIndex] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // AI Space Interactive Chat State (Campus Executive Copilot)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string; time: string; tag?: string }>>([
    {
      sender: "bot",
      text: `Greetings, Administrator. I am **${getAiAssistantName()}**, your Institutional Intelligence Assistant. I am connected to the campus smart grid, CBSE compliance ledger, fee reconciliation, and attendance telemetry. How may I assist your administration today?`,
      time: "Just now",
      tag: "ADMIN EXECUTIVE DESK",
    },
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentScreen === "aispace") {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, currentScreen]);

  const handleSendChatMessage = async (textToSend?: string) => {
    if (isTyping) return;
    const query = (textToSend || chatInputText).trim();
    if (!query) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsgList = [...chatMessages, { sender: "user" as const, text: query, time: userTime }];
    setChatMessages(newMsgList);
    if (!textToSend) setChatInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          role: "admin",
          history: chatMessages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botResponse =
        data.answer ||
        `✨ Understood, Administrator. ${getAiAssistantName()} has logged your request: "${query}". All institutional databases are synchronized.`;

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tag: data.selectedAgent ? `${data.selectedAgent.toUpperCase()} DESK` : "ADMIN EXECUTIVE DESK",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Administrative AI Telemetry is temporarily unavailable. Please retry shortly.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tag: "SYSTEM ALERT",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic quote rotation
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % ADMIN_SLOGANS.length);
    }, 8000);
    return () => clearInterval(quoteTimer);
  }, []);

  // Fullscreen sync
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Load session
  useEffect(() => {
    const activeSession = getUserSession();
    if (activeSession) {
      setSession(activeSession);
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = () => {
    clearUserSession();
    try {
      sessionStorage.removeItem("kiosk_admin_auth");
    } catch {
      // ignore
    }
    onBackToKiosk();
  };

  const adminName = session?.username || "";
  const schoolName = session?.initname || getInstituteName();
  const schoolLogo = session?.initlogo || getInstituteLogo();
  const aiName = getAiAssistantName();
  const adminRole = session?.Rolename || "Campus Administrator";
  const academicYear = session?.ASMAY_Year || "2025-2026";

  return (
    <div className="dashboard-page">
      {/* FLOATING AMBIENT ORBS (MATCHING ROLE SELECTION SCREEN) */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR (ROLE SELECTION COMMAND THEME) */}
      <header className="dash-navbar" suppressHydrationWarning>
        <div className="command-brand" onClick={handleLogout} style={{ cursor: "pointer" }} suppressHydrationWarning>
          <div className="command-mark" aria-hidden="true" suppressHydrationWarning>
            <img
              src={schoolLogo}
              alt={`${schoolName} Logo`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/mvps/brand/logo.png";
              }}
              suppressHydrationWarning
            />
          </div>
          <div suppressHydrationWarning>
            <p className="command-kicker" suppressHydrationWarning>{schoolName.toUpperCase()} • CAMPUS KIOSK CMS</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }} suppressHydrationWarning>
              <h1 style={{ margin: 0, fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#1e293b" }} suppressHydrationWarning>
                Campus Portal CMS (Dashboard Manager)
              </h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                  color: "#ea580c",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  padding: "0.22rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(234, 88, 12, 0.35)",
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.1)",
                  letterSpacing: "0.02em",
                }}
              >
                <Sparkles size={12} style={{ color: "#ea580c" }} />
                ADMINISTRATOR ROLE
              </span>
            </div>
          </div>
        </div>

        {/* Profile Pill & Control Actions */}
        <div className="dash-nav-actions">
          {/* Admin Profile Pill */}
          <div
            className="dash-profile-pill"
            onClick={() => setCurrentScreen("profile")}
            title="Click to view Administrator Profile"
            style={{ cursor: "pointer" }}
          >
            <img src={session?.img || "/admin_avatar.png"} alt={adminName} className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{adminName}</span>
              <span className="dash-user-role">{adminRole} • Directorate</span>
            </div>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="command-live-status">
            <span style={{ background: "#ea580c" }} />
            <span>Kiosk Online</span>
          </div>

          {/* Command Time Pill */}
          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>
              {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })} •{" "}
              <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
            </span>
          </div>

          {/* Fullscreen Button */}
          <button className="command-fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
          </button>

          {/* Back to Kiosk Home */}
          <button className="dash-kiosk-back-btn" onClick={onBackToKiosk || handleLogout} title="Return to Kiosk Dashboard">
            <Home size={14} /> Back to Kiosk
          </button>
        </div>
      </header>

      {/* ========================================================
          CAMPUS PORTAL CMS (DASHBOARD MANAGER)
          ======================================================== */}
      {(currentScreen === "portal-cms" || currentScreen === "dashboard") && (
        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "1.25rem",
            maxWidth: "1650px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <PortalCmsManager onBackToDashboard={onBackToKiosk} />
        </main>
      )}

      {/* ========================================================
          VIEW 2: DEDICATED FULL SCREEN — ATTENDANCE TELEMETRY
          ======================================================== */}
      {currentScreen === "attendance" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                <Users size={20} />
              </div>
              <div>
                <h2>Campus Attendance Telemetry & Biometrics</h2>
                <p>Real-Time Campus Turnstiles & Classroom Attendance Command</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                }}
              >
                ● 96.8% Overall Quorum
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Students Present</span>
                  <h4>6,040 / 6,240</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                  <Users size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Staff on Duty</span>
                  <h4>82 / 86 Faculty</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <UserCheck size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Turnstile Swipes</span>
                  <h4>4,820 Verified</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Safety Alerts</span>
                  <h4>0 Incident</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* CLASS ATTENDANCE TABLE */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <Activity size={18} style={{ color: "#0284c7" }} />
                  Class-by-Class Attendance Roster (Academic Year 2026-27)
                </h4>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Live Campus Feed • Synced 1m ago</span>
              </div>

              <table className="student-screen-table">
                <thead>
                  <tr>
                    <th>Class / Section</th>
                    <th>Total Strength</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Turnout %</th>
                    <th>Class Teacher</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASS_ATTENDANCE_DATA.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: "#1e293b" }}>{item.class}</td>
                      <td>{item.total} Students</td>
                      <td style={{ color: "#16a34a", fontWeight: 700 }}>{item.present}</td>
                      <td style={{ color: "#dc2626", fontWeight: 700 }}>{item.absent}</td>
                      <td>
                        <b style={{ color: "#0284c7" }}>{item.pct}</b>
                      </td>
                      <td style={{ color: "#475569" }}>{item.teacher}</td>
                      <td>
                        <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.72rem" }}>
                          ● Reconciled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: DEDICATED FULL SCREEN — FINANCIAL & FEE LEDGER
          ======================================================== */}
      {currentScreen === "finance" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#dcfce7", color: "#059669" }}>
                <IndianRupee size={20} />
              </div>
              <div>
                <h2>Institutional Fee Ledger & Accounts Reconciliation</h2>
                <p>Term-2 Tuition & Transportation Fee Ledger • {schoolName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#dcfce7",
                  color: "#059669",
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  border: "1px solid rgba(5, 150, 105, 0.3)",
                }}
              >
                ● 88.1% Collected
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Collected</span>
                  <h4>₹ 62,40,000</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#059669" }}>
                  <IndianRupee size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Outstanding Dues</span>
                  <h4>₹ 8,42,500</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Collection Efficiency</span>
                  <h4>88.1%</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                  <BarChart3 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Payment Mode</span>
                  <h4>74% Online/UPI</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <Zap size={20} />
                </div>
              </div>
            </div>

            {/* RECONCILIATION TABLE */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <FileCheck size={18} style={{ color: "#059669" }} />
                  Grade-Wise Term Fee Collection Breakdown
                </h4>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Audited by Accounts Directorate</span>
              </div>

              <table className="student-screen-table">
                <thead>
                  <tr>
                    <th>Grade / Wing</th>
                    <th>Strength</th>
                    <th>Target Amount</th>
                    <th>Amount Collected</th>
                    <th>Outstanding Dues</th>
                    <th>Collection %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {FINANCE_RECONCILIATION.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: "#1e293b" }}>{item.grade}</td>
                      <td>{item.strength} Students</td>
                      <td>{item.target}</td>
                      <td style={{ color: "#059669", fontWeight: 700 }}>{item.collected}</td>
                      <td style={{ color: "#dc2626", fontWeight: 700 }}>{item.dues}</td>
                      <td>
                        <b style={{ color: "#0284c7" }}>{item.pct}</b>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            background: item.status === "Nominal" ? "#dcfce7" : "#fef3c7",
                            color: item.status === "Nominal" ? "#15803d" : "#b45309",
                          }}
                        >
                          ● {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 4: DEDICATED FULL SCREEN — ADMISSIONS DESK
          ======================================================== */}
      {currentScreen === "admissions" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h2>Admissions Pipeline & Verification Desk</h2>
                <p>New Student Enrollment Queue • Academic Session 2026-27</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#f5f3ff",
                  color: "#7c3aed",
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                }}
              >
                ● 145 Confirmed Enrolments
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Applications</span>
                  <h4>340 Inquiries</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <ClipboardList size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Interviews Held</span>
                  <h4>210 Cleared</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                  <UserCheck size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Confirmed Enrolments</span>
                  <h4>145 Students</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Available Seats</span>
                  <h4>35 Remaining</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Building2 size={20} />
                </div>
              </div>
            </div>

            {/* ADMISSIONS PIPELINE TABLE */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <Users size={18} style={{ color: "#7c3aed" }} />
                  Recent Prospective Applicant Dossiers (AY 2026-27)
                </h4>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Admissions Office Desk</span>
              </div>

              <table className="student-screen-table">
                <thead>
                  <tr>
                    <th>Application No</th>
                    <th>Student Name</th>
                    <th>Grade Applied</th>
                    <th>Parent / Guardian</th>
                    <th>Application Date</th>
                    <th>Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMISSIONS_PIPELINE.map((item) => (
                    <tr key={item.appNo}>
                      <td style={{ fontWeight: 800, color: "#7c3aed" }}>{item.appNo}</td>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>{item.name}</td>
                      <td>{item.grade}</td>
                      <td style={{ color: "#475569" }}>{item.parent}</td>
                      <td>{item.date}</td>
                      <td>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            background: item.badgeBg,
                            color: item.badgeColor,
                          }}
                        >
                          ● {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 5: DEDICATED FULL SCREEN — ADMINISTRATOR PROFILE
          ======================================================== */}
      {currentScreen === "profile" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                <User size={20} />
              </div>
              <div>
                <h2>Administrator Credentials & Operations Registry</h2>
                <p>Institutional Oversight Identity • {adminName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button className="student-back-to-dash-btn" onClick={handleLogout} style={{ color: "#dc2626", borderColor: "#fca5a5" }}>
                Sign Out
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            <div
              className="student-screen-card"
              style={{ padding: "1.5rem", display: "flex", gap: "2rem", alignItems: "center" }}
            >
              <img
                src={session?.img || "/admin_avatar.png"}
                alt={adminName}
                style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid #7c3aed", objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                  <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.45rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                    {adminName}
                  </h2>
                  <span style={{ background: "#f5f3ff", color: "#7c3aed", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                    Chief Campus Administrator
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  Directorate of Institutional Governance • {schoolName}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Admin Code</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>GV-DIR-001</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>System Access</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>Root / Command Full Access</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Campus Base</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>Administrative Wing • Central</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-screen-card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                Campus Telemetry & System Status
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div style={{ background: "#f0fdf4", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(22, 163, 74, 0.3)" }}>
                  <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#16a34a" }}>GPS Fleet Telemetry</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                    38/38 Active Buses en-route with zero speeding or route violation alerts.
                  </p>
                </div>

                <div style={{ background: "#eff6ff", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(37, 99, 235, 0.3)" }}>
                  <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#2563eb" }}>Biometric Gate Pass</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                    Turnstiles operational with 4,820 student swipes and 42 verified visitor passes.
                  </p>
                </div>

                <div style={{ background: "#fdf4ff", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(192, 38, 211, 0.3)" }}>
                  <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#c026d3" }}>Solar Smart Grid</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                    Peak solar generation at 48.2 kWh, delivering 96% power independence across campus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 6: DEDICATED FULL SCREEN — AI SPACE & OPERATIONS COPILOT
          ======================================================== */}
      {currentScreen === "aispace" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                <Bot size={20} />
              </div>
              <div>
                <h2>{aiName} Executive Assistant</h2>
                <p>Institutional Operations Copilot • Governance & Smart Campus Telemetry</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#f5f3ff",
                  color: "#7c3aed",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Sparkles size={13} />
                Institutional Engine Active
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* TWO-COLUMN RESPONSIVE LAYOUT */}
            <div className="ai-space-screen-layout">
              {/* LEFT SIDEBAR: ROBOT HERO PERSONA & TOPICS */}
              <aside className="ai-space-persona-card">
                <div className="ai-robot-hero-box" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)", borderColor: "rgba(124, 58, 237, 0.25)" }}>
                  <div className="ai-robot-showcase-frame" style={{ borderColor: "#7c3aed", boxShadow: "0 8px 24px rgba(124, 58, 237, 0.2)" }}>
                    <img
                      src="/ai_robot.png"
                      alt={`${aiName} Robot`}
                      className="ai-robot-showcase-img"
                    />
                  </div>
                  <div className="ai-robot-badge" style={{ background: "#7c3aed" }}>
                    <Bot size={13} /> {aiName} • ADMIN DESK
                  </div>
                </div>

                <div className="ai-speech-bubble-intro">
                  &ldquo;Welcome, Administrator. I monitor campus telemetry, fee realization, admissions pipeline, transport safety, and regulatory compliance. Click any executive topic or enter your inquiry.&rdquo;
                </div>

                <div className="ai-quick-topics-list">
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
                    Executive Operations Topics
                  </div>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("What is today's campus attendance summary?")}>
                    <Users size={13} style={{ color: "#0284c7" }} /> Campus Attendance Overview
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("What is the status of fee collections?")}>
                    <IndianRupee size={13} style={{ color: "#16a34a" }} /> Term 2 Fee Collections
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Show me the latest admissions pipeline")}>
                    <GraduationCap size={13} style={{ color: "#7c3aed" }} /> Admissions AY 2026-27
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("What is the status of our transport fleet?")}>
                    <Bus size={13} style={{ color: "#ea580c" }} /> Transport Fleet & GPS
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Check CBSE affiliation and compliance status")}>
                    <ShieldCheck size={13} style={{ color: "#059669" }} /> CBSE Affiliation & Compliance
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("How is the campus solar smart grid performing?")}>
                    <Zap size={13} style={{ color: "#ca8a04" }} /> Solar Smart Grid Telemetry
                  </button>
                </div>

                {/* Administrator Context Card */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "0.55rem 0.75rem",
                    fontSize: "0.68rem",
                    color: "#64748b",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#1e293b" }}>{adminName}</div>
                  <div>Role: Chief Campus Administrator • Directorate</div>
                  <div>Authorization: Full Root Executive Access</div>
                </div>
              </aside>

              {/* RIGHT MAIN CHAT AREA */}
              <div className="ai-space-chat-card">
                {/* Mini Header */}
                <div className="ai-chat-header">
                  <div className="ai-chat-header-left">
                    <Sparkles size={16} style={{ color: "#7c3aed" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b" }}>
                      Executive Operations Copilot
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Active Context: <strong style={{ color: "#7c3aed" }}>Campus Directorate</strong>
                    </div>
                    <button
                      onClick={() => setChatMessages([
                        {
                          sender: "bot",
                          text: `Conversation refreshed. ${aiName} executive ledger is ready. How can I assist you?`,
                          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                          tag: "ADMIN EXECUTIVE DESK",
                        }
                      ])}
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        padding: "0.2rem 0.55rem",
                        fontSize: "0.68rem",
                        color: "#64748b",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="ai-chat-messages-stream">
                  {chatMessages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className={`ai-msg-row ${msg.sender === "bot" ? "ai-msg-row-bot" : "ai-msg-row-user"}`}
                    >
                      {msg.sender === "bot" ? (
                        <img src="/ai_robot.png" alt={aiName} className="ai-msg-avatar" style={{ border: "2px solid #7c3aed" }} />
                      ) : (
                        <img src={session?.img || "/admin_avatar.png"} alt={adminName} className="ai-msg-avatar" style={{ border: "2px solid #ea580c" }} />
                      )}

                      <div className="ai-msg-content-wrap">
                        <div className="ai-msg-sender-meta">
                          <span>{msg.sender === "bot" ? `${aiName} Executive` : adminName}</span>
                          {msg.sender === "bot" && (
                            <span
                              style={{
                                background: "#f5f3ff",
                                color: "#7c3aed",
                                fontSize: "0.6rem",
                                padding: "1px 5px",
                                borderRadius: 4,
                                fontWeight: 800,
                              }}
                            >
                              AI Director
                            </span>
                          )}
                          <span>• {msg.time}</span>
                        </div>

                        <div className={`ai-bubble ${msg.sender === "bot" ? "ai-bubble-bot" : "ai-bubble-user"}`}>
                          <MarkdownResponse content={msg.text} isUser={msg.sender === "user"} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="ai-msg-row ai-msg-row-bot">
                      <img src="/ai_robot.png" alt={aiName} className="ai-msg-avatar" style={{ border: "2px solid #7c3aed" }} />
                      <div className="ai-typing-indicator">
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                      </div>
                    </div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="ai-quick-prompts-bar">
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", flexShrink: 0 }}>
                    Quick Directives:
                  </span>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What is today's campus attendance summary?")}>
                    📊 Attendance
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What is the status of fee collections?")}>
                    💳 Fee Collections
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Show me the latest admissions pipeline")}>
                    🎓 Admissions Pipeline
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What is the status of our transport fleet?")}>
                    🚌 Transport Fleet
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Check CBSE affiliation and compliance status")}>
                    🛡️ CBSE Compliance
                  </button>
                </div>

                {/* Chat Input Bar */}
                <div className="ai-chat-input-bar">
                  <input
                    type="text"
                    className="ai-chat-text-input"
                    placeholder={`Ask ${aiName} about attendance, admissions, finances, solar grid, compliance...`}
                    value={chatInputText}
                    disabled={isTyping}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendChatMessage();
                      }
                    }}
                  />
                  <button
                    className="ai-chat-send-btn"
                    onClick={() => handleSendChatMessage()}
                    disabled={isTyping}
                    title={`Send instruction to ${aiName}`}
                    style={{ background: isTyping ? "#94a3b8" : "#7c3aed", cursor: isTyping ? "not-allowed" : "pointer" }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPACT COMMAND FOOTER - Hidden in CMS Manager mode so it never floats over CMS inputs or videos */}
      {currentScreen !== "portal-cms" && currentScreen !== "dashboard" && (
        <footer className="command-footer" style={{ marginTop: "auto", borderTop: "1px solid rgba(254, 215, 170, 0.5)", background: "rgba(255, 255, 255, 0.88)" }}>
          <div><span className="footer-dot" style={{ background: "#7c3aed" }} /> Official Institutional Command &amp; Operations Portal</div>
          <div className="footer-links">
            <span>CBSE Affiliation 1930281</span>
            <span>NAAC Grade A++</span>
            <span>38 Smart Buses Live GPS</span>
            <span>Campus Surveillance 100% Operational</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#7c3aed" }}>
            <ShieldCheck size={14} /> Safe &amp; Encrypted Kiosk
          </div>
        </footer>
      )}

      {/* ========================================================
          VIDEO TOUR MODAL PLAYER
          ======================================================== */}
      {isVideoModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              background: "#0f172a",
              borderRadius: "16px",
              maxWidth: "800px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              border: "1px solid rgba(254, 215, 170, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1.25rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Play size={16} fill="#7c3aed" color="#7c3aed" />
                <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.85rem" }}>
                  {schoolName} Campus Aerial Architecture & Infrastructure
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  border: "none",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000000" }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title={`${schoolName} Infrastructure Tour`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                background: "#0f172a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#94a3b8",
                fontSize: "0.75rem",
              }}
            >
              <span>Smart Solar Photovoltaic Grid • Biometric Gates • Transport Bus Bay • Administrative Directorate</span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  padding: "0.35rem 0.85rem",
                  background: "#7c3aed",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          OFFICIAL DIRECTIVES & NOTICES MODAL
          ======================================================== */}
      {selectedNotice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedNotice(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "540px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    background: selectedNotice.tagBg,
                    color: selectedNotice.tagColor,
                  }}
                >
                  {selectedNotice.tag}
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{selectedNotice.time}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  border: "none",
                  background: "#e2e8f0",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#475569",
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <h3
                style={{
                  margin: "0 0 0.4rem 0",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {selectedNotice.title}
              </h3>
              <div style={{ fontSize: "0.72rem", color: "#7c3aed", fontWeight: 700, marginBottom: "0.85rem" }}>
                Issued by: {selectedNotice.authority} • Date: {selectedNotice.date}
              </div>
              <div
                style={{
                  background: "#fffcf9",
                  padding: "0.9rem",
                  borderRadius: 10,
                  border: "1px solid rgba(254, 215, 170, 0.5)",
                  fontSize: "0.8rem",
                  color: "#334155",
                  lineHeight: 1.6,
                }}
              >
                {selectedNotice.details}
              </div>
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  padding: "0.38rem 1.15rem",
                  borderRadius: 8,
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  background: "#7c3aed",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                Close Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
