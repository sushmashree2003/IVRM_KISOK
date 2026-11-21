"use client";

import React, { useState, useEffect, useRef } from "react";
import LiveClock from "@/components/LiveClock";
import AdminExitFullscreenModal from "@/components/common/AdminExitFullscreenModal";
import { useRouter } from "next/navigation";
import { getUserSession, getInstituteLogo, getInstituteName } from "@/lib/session";
import {
  CampusInfoData,
  CampusLiveNotice,
  CampusEvent,
  CampusAchievement,
  LeadershipMember,
  TourFacility,
  GalleryItem,
} from "@/types/campus";
import defaultCampusData from "@/data/campus_info.json";
import {
  Calendar,
  GraduationCap,
  Users,
  ArrowRight,
  Trophy,
  Camera,
  MapPin,
  Megaphone,
  X,
  Maximize,
  Minimize,
  Building2,
  ChevronRight,
  ChevronLeft,
  Play,
  Leaf,
  ShieldCheck,
  Activity,
  FlaskConical,
  Sparkles,
  Award,
  QrCode,
  BookOpen,
  Cpu,
  Lock,
} from "lucide-react";








export interface CampusInfoPortalProps {
  onEnterRoleSelection: () => void;
  isFullscreen?: boolean;
  toggleFullscreen?: (e?: React.MouseEvent) => void;
  currentTime?: Date | null;
  draftData?: any;
}

export default function CampusInfoPortal({
  onEnterRoleSelection,
  isFullscreen: externalIsFullscreen,
  toggleFullscreen: externalToggleFullscreen,
  currentTime: externalCurrentTime,
}: CampusInfoPortalProps) {
  const router = useRouter();
  const [internalTime, setInternalTime] = useState<Date | null>(null);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<{ src: string; title: string } | null>(null);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [leadershipModalOpen, setLeadershipModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<LeadershipMember | null>(null);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>("all");
  const [activeTourFacilityIndex, setActiveTourFacilityIndex] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("stem");
  const [schoolName, setSchoolName] = useState<string>(
    () => (defaultCampusData as any)?.branding?.instituteName || getInstituteName()
  );
  const [schoolLogo, setSchoolLogo] = useState<string>(
    () => (defaultCampusData as any)?.branding?.logo || getInstituteLogo()
  );
  const [campusData, setCampusData] = useState<CampusInfoData>(
    () => defaultCampusData as unknown as CampusInfoData
  );
  const [tourTabMode, setTourTabMode] = useState<"video" | "facilities">("video");
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // ─── DYNAMIC ACTIVE DATA (derived directly from dynamic campusData state) ────
  const activeAchievements: CampusAchievement[] = campusData?.achievements || [];
  const activeGallery: GalleryItem[] = campusData?.gallery || [];
  const activeEvents: CampusEvent[] = campusData?.events || [];
  const dynamicHeroVideo =
    campusData?.hero?.videoUrl ||
    campusData?.branding?.virtualTour360Url ||
    "";
  const dynamic360TourVideo =
    campusData?.branding?.virtualTour360Url ||
    campusData?.hero?.videoUrl ||
    "";
  const activeFacilities: TourFacility[] = (campusData?.facilities || []).filter(
    (f) => f.active !== false
  );
  const activeLeaders: LeadershipMember[] = (campusData?.leadership || []).filter(
    (l) => l.active !== false
  );

  const dynamicTickerNotices: CampusLiveNotice[] = (campusData?.branding?.tickerNotices || []).map(
    (n, idx) =>
      typeof n === "string"
        ? { id: `notice-${idx}`, text: n, priority: "normal" }
        : n
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGalleryModalOpen(false);
        setSelectedGalleryIndex(null);
        setSelectedGalleryImg(null);
        setVirtualTourOpen(false);
        setAchievementsModalOpen(false);
        setEventsModalOpen(false);
        setLeadershipModalOpen(false);
        setSelectedLeader(null);
      } else if (galleryModalOpen && selectedGalleryIndex !== null && activeGallery.length > 0) {
        if (e.key === "ArrowLeft") {
          setSelectedGalleryIndex((prev) =>
            prev !== null ? (prev - 1 + activeGallery.length) % activeGallery.length : 0
          );
        } else if (e.key === "ArrowRight") {
          setSelectedGalleryIndex((prev) =>
            prev !== null ? (prev + 1) % activeGallery.length : 0
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryModalOpen, selectedGalleryIndex, activeGallery.length]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: any) => {
          // AbortError is expected when sources switch or browser power-saver throttles background video
          if (err.name === "AbortError" || err.name === "NotAllowedError") {
            return;
          }
          console.debug("[CampusInfoPortal] Autoplay deferred:", err);
        });
      }
    };

    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.addEventListener("loadeddata", attemptPlay, { once: true });
    }

    // Touch/click listener to awaken video if browser paused it for power-saving
    const handleAwaken = () => {
      if (video && video.paused) {
        video.play().catch(() => { });
      }
    };
    window.addEventListener("touchstart", handleAwaken, { once: true, passive: true });
    window.addEventListener("click", handleAwaken, { once: true, passive: true });

    return () => {
      window.removeEventListener("touchstart", handleAwaken);
      window.removeEventListener("click", handleAwaken);
    };
  }, [dynamicHeroVideo]);

  useEffect(() => {
    const session = getUserSession();
    if (session?.initname) {
      setSchoolName(session.initname);
      document.title = `${session.initname} • Smart Campus Kiosk`;
    } else if (campusData?.branding?.instituteName) {
      setSchoolName(campusData.branding.instituteName);
      document.title = `${campusData.branding.instituteName} • Smart Campus Kiosk`;
    } else {
      document.title = `${getInstituteName()} • Smart Campus Kiosk`;
    }

    const dynamicLogo = session?.initlogo || campusData?.branding?.logo || getInstituteLogo();
    if (dynamicLogo) {
      setSchoolLogo(dynamicLogo);
    }

    // Dynamic campus info & CMS data sync
    fetch("/api/kiosk/campus-info", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CampusInfoData | null) => {
        if (!data) return;
        setCampusData(data);
        if (data.branding?.instituteName) {
          setSchoolName(data.branding.instituteName);
          document.title = `${data.branding.instituteName} • Smart Campus Kiosk`;
          try {
            localStorage.setItem("kiosk_institute_name", data.branding.instituteName);
          } catch { }
        }
        if (data.branding?.logo) {
          setSchoolLogo(data.branding.logo);
          try {
            localStorage.setItem("kiosk_institute_logo", data.branding.logo);
          } catch { }
        }
      })
      .catch((err) => {
        console.warn("[CampusInfoPortal] Could not load dynamic campus info:", err);
      });

    // Live branding sync from server config (reads INST_CODE_BGIMAGE from env)
    fetch("/api/branding", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        const currentSession = getUserSession();
        if (data.logo && !currentSession?.initlogo) {
          setSchoolLogo(data.logo);
          try {
            localStorage.setItem("kiosk_institute_logo", data.logo);
          } catch { }
        }
        if (data.name && !currentSession?.initname) {
          setSchoolName(data.name);
          document.title = `${data.name} • Smart Campus Kiosk`;
          try {
            localStorage.setItem("kiosk_institute_name", data.name);
          } catch { }
        }
        if (data.backgroupdlo) {
          try {
            sessionStorage.setItem("backgroupdlo", data.backgroupdlo);
            localStorage.setItem("kiosk_backgroupdlo", data.backgroupdlo);
          } catch { }
        }
      })
      .catch(() => { });

    const handleFsChange = () => {
      setInternalIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const currentTime = externalCurrentTime || internalTime;
  const isFullscreen = externalIsFullscreen !== undefined ? externalIsFullscreen : internalIsFullscreen;

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (externalToggleFullscreen) {
      externalToggleFullscreen(e);
      return;
    }
    if (e) e.stopPropagation();
    const isCurrentlyFs = isFullscreen || !!document.fullscreenElement || (typeof window !== "undefined" && !!(window as any).kioskNative?.isKioskApp);

    if (isCurrentlyFs) {
      setIsAdminModalOpen(true);
      return;
    }

    if (typeof window !== "undefined" && (window as any).kioskNative?.toggleFullscreen) {
      (window as any).kioskNative.toggleFullscreen().then((isFs: boolean) => {
        setInternalIsFullscreen(isFs);
      }).catch(() => {});
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="mv-kiosk-wrapper">
      {/* =========================================================================
         1. FLOATING GLASS COMMAND HEADER
         ========================================================================= */}
      <header className="mv-header-bar">
        {/* Brand Group */}
        <div className="mv-brand-group">
          <img
            src={schoolLogo}
            alt={`${schoolName} Official Crest`}
            className="mv-brand-logo-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.opacity = "0.4";
            }}
          />
          <div className="mv-brand-titles">
            <h1 className="mv-brand-name">{schoolName}</h1>
            <div className="mv-brand-sub">
              <span>{campusData?.branding?.motto || "Empowering Minds, Shaping Futures"}</span>
              {campusData?.branding?.affiliation && (
                <>
                  <span>•</span>
                  <span>{campusData.branding.affiliation} Affiliated</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center News Marquee Capsule */}
        <div className="mv-news-capsule">
          <div className="mv-news-badge">
            <Megaphone size={12} />
            <span>Campus Live</span>
          </div>
          <div className="mv-news-scroller">
            <div className="mv-news-track">
              {dynamicTickerNotices.length > 0 ? (
                dynamicTickerNotices.map((notice, idx) => (
                  <React.Fragment key={notice.id || idx}>
                    <span className="mv-news-sep">|</span>
                    {notice.badge && (
                      <span
                        style={{
                          background:
                            notice.priority === "urgent"
                              ? "#ef4444"
                              : notice.priority === "high"
                                ? "#ea580c"
                                : "#0284c7",
                          color: "#ffffff",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          marginRight: "6px",
                          textTransform: "uppercase",
                        }}
                      >
                        {notice.badge}
                      </span>
                    )}
                    <span>{notice.text}</span>
                  </React.Fragment>
                ))
              ) : (
                <>
                  <span className="mv-news-sep">|</span>
                  <span>Welcome to {schoolName}</span>
                  <span className="mv-news-sep">|</span>
                  <span>{campusData?.branding?.motto || "Empowering Minds, Shaping Futures"}</span>
                  {campusData?.hero?.ctaText && (
                    <>
                      <span className="mv-news-sep">|</span>
                      <span>{campusData.hero.ctaText}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Status & Clock */}
        <div className="mv-header-tools">
          {/* <div className="mv-live-pill">
            <span className="mv-pulse-dot" />
            <span>Kiosk Online</span>
          </div> */}

          <LiveClock className="mv-clock-pill" />

          <button
            className="mv-fs-trigger"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>
      </header>

      {/* =========================================================================
         2. MAIN ASYMMETRICAL BENTO GRID
         ========================================================================= */}
      <main className="mv-bento-grid">
        {/* =====================================================================
           ZONE A (LEFT): CINEMATIC SHOWCASE & DIRECT TOUCH ROLES
           ===================================================================== */}
        <div className="mv-col-left">
          {/* Card A1: Hero Cinematic Showcase */}
          <div
            className="mv-hero-showcase"
            style={
              campusData?.hero?.backgroundImageUrl
                ? { backgroundImage: `url('${campusData.hero.backgroundImageUrl}')` }
                : undefined
            }
          >
            <div className="mv-hero-sc-content">
              {/* Background Looping Video */}
              <video
                ref={heroVideoRef}
                className="mv-hero-bg-video"
                src={dynamicHeroVideo}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="auto"
                poster={campusData?.hero?.posterUrl || ""}
                aria-hidden="true"
                onError={(e) => {
                  console.warn("[CampusInfoPortal] Video playback notice:", e);
                }}
              />

              {/* Dark Gradient Overlay for Readability */}
              <div className="mv-hero-sc-overlay" aria-hidden="true" />

              <div>
                <span className="mv-hero-cursive-kicker">
                  {campusData?.hero?.kicker || "Welcome to"}
                </span>
                <h2 className="mv-hero-main-title">
                  {campusData?.hero?.headline || schoolName}
                </h2>
                <p className="mv-hero-desc">
                  {campusData?.hero?.subheadline ||
                    "Empowering young minds with world-class scholastic rigor, ethical leadership, and futuristic STEM innovation."}
                </p>
              </div>

              {/* 4 Distinction Stat Badges */}
              <div className="mv-hero-pills-row">
                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <Trophy size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>{campusData?.hero?.badge1Bold ?? "100% Pass"}</b>
                    <span>{campusData?.hero?.badge1Sub ?? (campusData?.branding?.affiliation ? `${campusData.branding.affiliation} Board` : "Academic Distinction")}</span>
                  </div>
                </div>

                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <GraduationCap size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>{campusData?.hero?.badge2Bold ?? (campusData?.quickStats?.facultyCount ? `${campusData.quickStats.facultyCount} Faculty` : "Dedicated Faculty")}</b>
                    <span>{campusData?.hero?.badge2Sub ?? "Academic Excellence"}</span>
                  </div>
                </div>

                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <Users size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>{campusData?.hero?.badge3Bold ?? (campusData?.quickStats?.studentsCount ? `${campusData.quickStats.studentsCount} Students` : "Enrolled Scholars")}</b>
                    <span>{campusData?.hero?.badge3Sub ?? "Happy Scholars"}</span>
                  </div>
                </div>

                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <Cpu size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>{campusData?.hero?.badge4Bold ?? (campusData?.quickStats?.labsCount ? `${campusData.quickStats.labsCount} Labs` : "Smart Labs")}</b>
                    <span>{campusData?.hero?.badge4Sub ?? "Robotics & AI Smart Hubs"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mv-hero-bottom-actions">
                <button
                  className="mv-tour-glow-btn"
                  onClick={() => {
                    setTourTabMode("video");
                    setVirtualTourOpen(true);
                  }}
                >
                  <Play size={11} fill="#ea580c" />
                  <span>{campusData?.hero?.button1Text || "Explore 360° Campus"}</span>
                </button>
                <button
                  className="mv-leadership-btn"
                  onClick={() => {
                    setSelectedLeader(null);
                    setLeadershipModalOpen(true);
                  }}
                  title="View Chairman, Director & Principal Messages"
                >
                  <Award size={13} style={{ color: "#facc15" }} />
                  <span>{campusData?.hero?.button2Text || "Leadership & Vision"}</span>
                </button>
                <span className="mv-creed-author">— {schoolName} {campusData?.hero?.legacyTag || "Legacy"}</span>
              </div>
            </div>
          </div>

          {/* Card A2: Touch-To-Enter Role Hub */}
          <div
            className={`mv-role-hub-card ${campusData?.roleHub?.backgroundImageUrl ? "has-video-bg has-backdrop-bg" : ""}`}
            style={
              campusData?.roleHub?.backgroundImageUrl
                ? {
                  backgroundImage: `url('${campusData.roleHub.backgroundImageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
                : undefined
            }
          >
            {/* Transparent Scrim Overlay for Contrast & Glassmorphism */}
            {campusData?.roleHub?.backgroundImageUrl && (
              <div className="mv-role-hub-sc-overlay" aria-hidden="true" />
            )}

            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "100%" }}>
              <div className="mv-hub-header">
                <h3 className="mv-hub-title">
                  <ShieldCheck size={16} style={{ color: "#c9642eff" }} />
                  <span>{campusData?.roleHub?.title || "Self-Service Gateway"}</span>
                </h3>
                <span className="mv-hub-kicker">
                  {campusData?.roleHub?.kicker || "Touch To Sign In"}
                </span>
              </div>

              <div className="mv-roles-grid">
                <div
                  className="mv-role-pill-btn"
                  onClick={() => router.push("/login?role=student")}
                  title="Open Student & Parent Portal"
                >
                  <div className="mv-role-icon student">
                    <GraduationCap size={18} />
                  </div>
                  <div className="mv-role-text">
                    <b>Student &amp; Parent</b>
                    <span>Reports, Fees &amp; HW</span>
                  </div>
                </div>

                <div
                  className="mv-role-pill-btn"
                  onClick={() => router.push("/login?role=staff")}
                  title="Open Staff Portal"
                >
                  <div className="mv-role-icon staff">
                    <Users size={18} />
                  </div>
                  <div className="mv-role-text">
                    <b>Faculty &amp; Staff</b>
                    <span>Timetable &amp; Leaves</span>
                  </div>
                </div>

                {/* <div
                  className="mv-role-pill-btn"
                  onClick={() => router.push("/visitor")}
                  title="Open Visitor Desk"
                >
                  <div className="mv-role-icon visitor">
                    <QrCode size={18} />
                  </div>
                  <div className="mv-role-text">
                    <b>Visitor &amp; Guest</b>
                    <span>Digital Pass &amp; Maps</span>
                  </div>
                </div> */}
                {/* 
                <div
                  className="mv-role-pill-btn"
                  onClick={() => router.push("/alumni")}
                  title="Open Alumni Network"
                >
                  <div className="mv-role-icon alumni">
                    <Award size={18} />
                  </div>
                  <div className="mv-role-text">
                    <b>Alumni Network</b>
                    <span>Reunions &amp; Mentoring</span>
                  </div>
                </div> */}
              </div>

              <button
                className="mv-primary-login-btn"
                onClick={onEnterRoleSelection}
                title="Open Full Portal Roster"
                style={campusData?.roleHub?.backgroundImageUrl ? {
                  background: "rgba(216, 155, 79, 0.95)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                } : undefined}
              >
                <span>Tap to Open All Portals</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
           ZONE B (CENTER): HONORS SPOTLIGHT & RECENT MOMENTS GALLERY
           ===================================================================== */}
        <div className="mv-col-center">
          {/* Card B1: Honors & Awards Showcase */}
          <div className="mv-achieve-spotlight-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Trophy size={16} style={{ color: "#ea580c" }} />
                <h3 className="mv-section-title">Hall of Fame &amp; Awards</h3>
              </div>
              <button
                className="mv-view-all-btn"
                onClick={() => setAchievementsModalOpen(true)}
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-achieve-cards-row">
              {activeAchievements.length > 0 ? (
                activeAchievements.slice(0, 3).map((ach, idx) => (
                  <div key={ach.id} className="mv-achieve-card">
                    <div className="mv-achieve-img-box">
                      <img
                        src={ach.image}
                        alt={ach.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.opacity = "0.3";
                        }}
                      />
                      <div
                        className="mv-achieve-rank-pill"
                        style={
                          idx === 2
                            ? { background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }
                            : undefined
                        }
                      >
                        <span>{ach.badge || ach.rank}</span>
                      </div>
                    </div>
                    <div className="mv-achieve-meta">
                      <h4 className="mv-achieve-title">{ach.title}</h4>
                      <span className="mv-achieve-level">{ach.category}</span>
                      <span className="mv-achieve-winner">
                        {ach.description || `${ach.rank || ach.badge || "Winner"} • ${ach.date}`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "0.85rem", width: "100%" }}>
                  No campus achievements published yet.
                </div>
              )}
            </div>
          </div>

          {/* Card B2: Recent Moments 2x2 Lightbox Gallery */}
          <div className="mv-gallery-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Camera size={16} style={{ color: "#0d9488" }} />
                <h3 className="mv-section-title" style={{ color: "#0d9488" }}>
                  Campus Life in Motion
                </h3>
              </div>
              <button
                className="mv-view-all-btn"
                style={{ color: "#0d9488" }}
                onClick={() => {
                  setSelectedGalleryIndex(null);
                  setSelectedGalleryImg(null);
                  setGalleryModalOpen(true);
                }}
                title="Open Campus Photo Gallery"
              >
                <span>Gallery</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-gallery-grid">
              {activeGallery.length > 0 ? (
                activeGallery.slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id}
                    className="mv-gallery-item"
                    onClick={() => {
                      setSelectedGalleryIndex(idx);
                      setSelectedGalleryImg({ src: item.src, title: item.title });
                      setGalleryModalOpen(true);
                    }}
                    title={`Click to open ${item.shortTitle} photo popup`}
                  >
                    <img
                      src={item.src}
                      alt={item.shortTitle}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.opacity = "0.3";
                      }}
                    />
                    <div className="mv-gallery-label-bar">{item.shortTitle}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "0.85rem", width: "100%", gridColumn: "1 / -1" }}>
                  No gallery moments published yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================================
           ZONE C (RIGHT): LIVE EVENTS TIMELINE & CAMPUS FACILITIES
           ===================================================================== */}
        <div className="mv-col-right">
          {/* Card C1: Upcoming Events Timeline */}
          <div className="mv-timeline-container mv-timeline-panel">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Calendar size={16} style={{ color: "#ea580c" }} />
                <h3 className="mv-section-title">Upcoming Schedule</h3>
              </div>
              <button
                className="mv-view-all-btn"
                onClick={() => setEventsModalOpen(true)}
              >
                <span>Calendar</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-timeline-list">
              {activeEvents.length > 0 ? (
                activeEvents.map((event) => {
                  const isSelected = selectedScheduleId === event.id;
                  const venueDisplay = event.time ? `${event.time} | ${event.venue}` : event.venue;
                  return (
                    <div
                      key={event.id}
                      className={`mv-timeline-card mv-timeline-row ${(event as any).cardClass ?? ""} ${isSelected ? "selected active" : ""}`}
                      onClick={() => setSelectedScheduleId(event.id)}
                      style={{
                        backgroundImage: (event as any).image
                          ? `linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.90) 45%, rgba(255,255,255,0.30) 75%, rgba(255,255,255,0) 100%), url('${(event as any).image}')`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        ...(isSelected ? { borderColor: "#ea580c", borderWidth: "2px", borderStyle: "solid" } : {}),
                      }}
                    >
                      <div className="mv-timeline-date">
                        <span className="mv-timeline-day">{event.day}</span>
                        <span className="mv-timeline-month">{event.month}</span>
                      </div>
                      <div className="mv-timeline-info">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4 className="mv-timeline-name">{event.name}</h4>
                          {(event as any).tag && (
                            <span className={`mv-timeline-tag ${(event as any).tagClass ?? ""}`}>{(event as any).tag}</span>
                          )}
                        </div>
                        <span className="mv-timeline-venue">{venueDisplay}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                  No upcoming events scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Card C2: Campus Facilities Peek + Quote Ribbon */}
          <div className="mv-facilities-quote-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Building2 size={16} style={{ color: "#ea580c" }} />
                <h3 className="mv-section-title">World-Class Facilities</h3>
              </div>
              <button
                className="mv-view-all-btn"
                onClick={() => setVirtualTourOpen(true)}
              >
                <span>Tour</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-fac-mini-grid">
              {activeFacilities.length > 0 ? (
                activeFacilities.slice(0, 6).map((fac, idx) => (
                  <div
                    key={fac.id || idx}
                    className="mv-fac-mini-item"
                    onClick={() => {
                      setActiveTourFacilityIndex(idx);
                      setTourTabMode("facilities");
                      setVirtualTourOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveTourFacilityIndex(idx);
                        setTourTabMode("facilities");
                        setVirtualTourOpen(true);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    title={`Explore ${fac.title}`}
                  >
                    <img src={fac.image} alt={fac.title} className="mv-fac-mini-img" />
                    <span className="mv-fac-mini-title">{fac.title}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "0.85rem", width: "100%", gridColumn: "1 / -1" }}>
                  Campus facilities will appear here.
                </div>
              )}
            </div>

            <div className="mv-creed-ribbon">
              <span className="mv-creed-quote-mark">“</span>
              <p className="mv-creed-text">
                {campusData?.branding?.motto || "Education is not just about books, it’s about building a better tomorrow."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
         3. BOTTOM STATUS RIBBON
         ========================================================================= */}
      <footer className="mv-footer-bar">
        <div className="mv-footer-tags">
          <div className="mv-footer-tag">
            <ShieldCheck size={13} style={{ color: "#059669" }} />
            <span>Safe &amp; Biometric Secured Campus</span>
          </div>
          <div className="mv-footer-tag">
            <Users size={13} style={{ color: "#ea580c" }} />
            <span>{campusData?.quickStats?.facultyCount ? `${campusData.quickStats.facultyCount} Dedicated Faculty` : "Dedicated Faculty"}</span>
          </div>
          <div className="mv-footer-tag">
            <Leaf size={13} style={{ color: "#16a34a" }} />
            <span>Eco-Smart Green Campus</span>
          </div>
        </div>

        <div className="mv-footer-motto">
          {campusData?.footerMotto || campusData?.branding?.motto || "— Together for a Brighter Tomorrow 🍃 —"}
        </div>

        <div className="mv-footer-links">
          <span>Academics</span> | <span>Sports</span> | <span>Arts</span> | <span>Values</span> | <span>Life Skills</span> |{" "}
          <span
            onClick={() => router.push("/admin")}
            className="mv-footer-admin-link"
            title="Access Admin Portal & CMS"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push("/admin");
              }
            }}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "#ea580c",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "4px",
              background: "rgba(234, 88, 12, 0.1)",
              border: "1px solid rgba(234, 88, 12, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            <Lock size={12} /> Admin
          </span>
        </div>
      </footer>

      {/* =========================================================================
         MODAL 1: 360 VIRTUAL TOUR & FACILITIES EXPLORER
         ========================================================================= */}
      {virtualTourOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => setVirtualTourOpen(false)}
        >
          <div
            className="mp-modal-window"
            style={{ width: "900px", maxWidth: "94vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {schoolName} • Campus Architecture &amp; Facilities Tour
                </h3>
              </div>
              <button
                onClick={() => setVirtualTourOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.1rem", background: "#f8fafc" }}>
              {/* Tour Mode Switch: Video Walkthrough vs Photo Explorer */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "10px" }}>
                <button
                  type="button"
                  onClick={() => setTourTabMode("video")}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: tourTabMode === "video" ? "#ea580c" : "#e2e8f0",
                    color: tourTabMode === "video" ? "#ffffff" : "#475569",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.18s ease",
                  }}
                >
                  <Play size={14} />
                  <span>Campus Video Walkthrough</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTourTabMode("facilities")}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: tourTabMode === "facilities" ? "#ea580c" : "#e2e8f0",
                    color: tourTabMode === "facilities" ? "#ffffff" : "#475569",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.18s ease",
                  }}
                >
                  <Building2 size={14} />
                  <span>Architecture &amp; Facility Photos ({activeFacilities.length})</span>
                </button>
              </div>

              {tourTabMode === "video" ? (
                <div
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                    background: "#000000",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <video
                    controls
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    autoPlay
                    playsInline
                    key={dynamic360TourVideo}
                    src={dynamic360TourVideo}
                    style={{
                      width: "100%",
                      maxHeight: "440px",
                      background: "#000000",
                      display: "block",
                      objectFit: "contain",
                    }}
                  />
                  <div
                    style={{
                      padding: "10px 16px",
                      background: "#0f172a",
                      color: "#ffffff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {campusData?.branding?.virtualTourTitle || "Campus 360° Architecture & Video Walkthrough"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTourTabMode("facilities")}
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: "none",
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Browse Facilities →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Facility Tabs Bar */}
                  <div className="mv-tour-tabs-bar" style={{ marginBottom: "12px" }}>
                    {activeFacilities.map((facility, idx) => (
                      <button
                        key={facility.id || idx}
                        className={`mv-tour-tab-btn ${activeTourFacilityIndex === idx ? "active" : ""}`}
                        onClick={() => setActiveTourFacilityIndex(idx)}
                      >
                        <span>{facility.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Facility View */}
                  {activeFacilities[activeTourFacilityIndex] && (
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "14px",
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                        height: "380px",
                        background: "#0f172a",
                      }}
                    >
                      <img
                        src={activeFacilities[activeTourFacilityIndex].image}
                        alt={activeFacilities[activeTourFacilityIndex].title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(180deg, transparent 40%, rgba(14, 42, 71, 0.90) 100%)",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          left: "20px",
                          right: "20px",
                          color: "#ffffff",
                        }}
                      >
                        <span
                          style={{
                            background: "rgba(234, 88, 12, 0.95)",
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {activeFacilities[activeTourFacilityIndex].category}
                        </span>
                        <h4 style={{ margin: "6px 0 3px", fontSize: "1.2rem", fontWeight: 800 }}>
                          {activeFacilities[activeTourFacilityIndex].title}
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.92, lineHeight: 1.4, maxWidth: "700px" }}>
                          {activeFacilities[activeTourFacilityIndex].description}
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.85rem",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>
                      📍 Campus Architecture • Facility {activeTourFacilityIndex + 1} of {activeFacilities.length}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setActiveTourFacilityIndex((prev) => (prev - 1 + activeFacilities.length) % activeFacilities.length)}
                        style={{
                          background: "#ffffff",
                          border: "1.5px solid #cbd5e1",
                          borderRadius: "9999px",
                          padding: "0.35rem 0.9rem",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          color: "#334155",
                        }}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setActiveTourFacilityIndex((prev) => (prev + 1) % activeFacilities.length)}
                        style={{
                          background: "#ea580c",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "9999px",
                          padding: "0.35rem 1rem",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                        }}
                      >
                        Next Facility
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 2: RECENT EVENTS GALLERY LIGHTBOX POPUP
         ========================================================================= */}
      {(galleryModalOpen || selectedGalleryIndex !== null || selectedGalleryImg) && (
        <div
          className="mp-modal-backdrop"
          onClick={() => {
            setGalleryModalOpen(false);
            setSelectedGalleryIndex(null);
            setSelectedGalleryImg(null);
          }}
        >
          <div
            className="mp-modal-window"
            style={{ width: selectedGalleryIndex !== null ? "840px" : "800px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 800 }}>
                    {selectedGalleryIndex !== null
                      ? (activeGallery[selectedGalleryIndex]?.title ?? "")
                      : `${schoolName} • Campus Life in Motion`}
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.85)", fontWeight: 600 }}>
                    {selectedGalleryIndex !== null
                      ? `Photo ${selectedGalleryIndex + 1} of ${activeGallery.length} • Tap arrows or thumbnails to navigate`
                      : "Campus Moments & Extracurricular Highlights"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {selectedGalleryIndex !== null && (
                  <button
                    onClick={() => setSelectedGalleryIndex(null)}
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      borderRadius: "9999px",
                      padding: "0.35rem 0.85rem",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.15s ease",
                    }}
                    title="View all photos in grid"
                  >
                    <span>All Photos</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setGalleryModalOpen(false);
                    setSelectedGalleryIndex(null);
                    setSelectedGalleryImg(null);
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                  }}
                  title="Close popup"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.1rem", background: "#f8fafc", overflowY: "auto", maxHeight: "82vh" }}>
              {selectedGalleryIndex !== null ? (
                /* SINGLE PHOTO LIGHTBOX VIEW */
                <div>
                  {/* Photo with Navigation Overlay */}
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
                      background: "#0f172a",
                    }}
                  >
                    <img
                      src={activeGallery[selectedGalleryIndex]?.src ?? ""}
                      alt={activeGallery[selectedGalleryIndex]?.title ?? ""}
                      style={{
                        width: "100%",
                        height: "clamp(260px, 44vh, 400px)",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.opacity = "0.3";
                      }}
                    />

                    {/* Previous Button */}
                    <button
                      className="mp-lightbox-nav-btn prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGalleryIndex((prev) =>
                          prev !== null ? (prev - 1 + activeGallery.length) % activeGallery.length : 0
                        );
                      }}
                      title="Previous Photo"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    {/* Next Button */}
                    <button
                      className="mp-lightbox-nav-btn next"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGalleryIndex((prev) =>
                          prev !== null ? (prev + 1) % activeGallery.length : 0
                        );
                      }}
                      title="Next Photo"
                    >
                      <ChevronRight size={22} />
                    </button>

                    {/* Top overlay pills */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(13, 148, 136, 0.9)",
                          color: "#ffffff",
                          backdropFilter: "blur(6px)",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <Sparkles size={11} />
                        {activeGallery[selectedGalleryIndex]?.category ?? ""}
                      </span>
                      <span
                        style={{
                          background: "rgba(15, 23, 42, 0.75)",
                          color: "#ffffff",
                          backdropFilter: "blur(6px)",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {activeGallery[selectedGalleryIndex]?.date ?? ""}
                      </span>
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "rgba(15, 23, 42, 0.75)",
                        color: "#ffffff",
                        backdropFilter: "blur(6px)",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                      }}
                    >
                      {selectedGalleryIndex + 1} / {activeGallery.length}
                    </div>
                  </div>

                  {/* Description bar */}
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      marginTop: "10px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                        {activeGallery[selectedGalleryIndex]?.title ?? ""}
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.4 }}>
                      {activeGallery[selectedGalleryIndex]?.description ?? ""}
                    </p>
                  </div>

                  {/* Thumbnails row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "10px",
                      marginTop: "12px",
                      overflowX: "auto",
                      paddingBottom: "8px",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {activeGallery.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`mp-thumb-item ${selectedGalleryIndex === idx ? "active" : ""}`}
                        onClick={() => setSelectedGalleryIndex(idx)}
                        title={item.shortTitle}
                      >
                        <img
                          src={item.src}
                          alt={item.shortTitle}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.opacity = "0.3";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* GRID VIEW WITH CATEGORY FILTERS */
                <div>
                  {/* Category Filter Pills */}
                  <div className="mv-gallery-filter-bar">
                    {[
                      { id: "all", label: "All Photos" },
                      { id: "sports", label: "Sports & Athletics" },
                      { id: "academics", label: "Academics & Labs" },
                      { id: "cultural", label: "Cultural & Stage" },
                      { id: "facilities", label: "Campus Facilities" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        className={`mv-gallery-filter-pill ${galleryCategoryFilter === tab.id ? "active" : ""}`}
                        onClick={() => setGalleryCategoryFilter(tab.id)}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "14px",
                    }}
                  >
                    {(galleryCategoryFilter === "all"
                      ? activeGallery
                      : activeGallery.filter((item) => (item as any).categoryFilter === galleryCategoryFilter)
                    ).map((item) => {
                      const origIndex = activeGallery.findIndex((orig) => orig.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className="mp-gallery-modal-card"
                          onClick={() => setSelectedGalleryIndex(origIndex >= 0 ? origIndex : 0)}
                          title={`Click to enlarge ${item.shortTitle}`}
                        >
                          <div style={{ position: "relative", height: "140px", overflow: "hidden" }}>
                            <img
                              src={item.src}
                              alt={item.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.3s ease",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                background: "rgba(13, 148, 136, 0.9)",
                                color: "#ffffff",
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "0.68rem",
                                fontWeight: 800,
                              }}
                            >
                              {item.category}
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                background: "rgba(15, 23, 42, 0.75)",
                                color: "#ffffff",
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                              }}
                            >
                              {item.date}
                            </div>
                          </div>
                          <div style={{ padding: "10px 12px" }}>
                            <h4 style={{ margin: "0 0 4px", fontSize: "0.86rem", fontWeight: 800, color: "#0f172a" }}>
                              {item.shortTitle}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.74rem",
                                color: "#64748b",
                                lineHeight: 1.35,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.description}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#0d9488",
                                fontSize: "0.74rem",
                                fontWeight: 800,
                                marginTop: "8px",
                              }}
                            >
                              <span>Tap to view photo</span>
                              <ArrowRight size={12} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 3: VIEW ALL ACHIEVEMENTS
         ========================================================================= */}
      {achievementsModalOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => setAchievementsModalOpen(false)}
        >
          <div
            className="mp-modal-window"
            style={{ width: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Trophy size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {schoolName} Hall of Fame &amp; Honors
                </h3>
              </div>
              <button
                onClick={() => setAchievementsModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", background: "#f8fafc", maxHeight: "450px", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {activeAchievements.map((ach) => (
                  <div key={ach.id} style={{ background: "#ffffff", borderRadius: "10px", padding: "10px", border: "1px solid #fed7aa" }}>
                    <img
                      src={ach.image}
                      alt={ach.title}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/achievement_math.jpg"; }}
                      style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <span style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "9999px", marginTop: "6px" }}>
                      {(ach as any).badge || ach.rank}
                    </span>
                    <h4 style={{ margin: "4px 0 2px", fontSize: "0.85rem", fontWeight: 800 }}>{ach.title}</h4>
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>{ach.category} • {ach.date}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.72rem", fontWeight: 700, color: "#c2410c" }}>
                      {ach.description || (ach.badge || ach.rank)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 4: VIEW ALL UPCOMING EVENTS
         ========================================================================= */}
      {eventsModalOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => setEventsModalOpen(false)}
        >
          <div
            className="mp-modal-window"
            style={{ width: "650px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {schoolName} Upcoming Schedule
                </h3>
              </div>
              <button
                onClick={() => setEventsModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", background: "#f8fafc", maxHeight: "420px", overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activeEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      border: "1px solid #fed7aa",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        background: "#fff7ed",
                        borderRadius: "6px",
                        width: 44,
                        height: 44,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #fed7aa",
                        flexShrink: 0,
                      }}
                    >
                      <b style={{ fontSize: "1rem", color: "#c2410c" }}>{event.day}</b>
                      <span style={{ fontSize: "0.62rem", color: "#ea580c", fontWeight: 800 }}>{event.month}</span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800 }}>{event.name}</h4>
                      <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                        {event.time ? `${event.time} | ${event.venue}` : event.venue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
         MODAL 5: LEADERSHIP & VISION MODAL
         ========================================================================= */}
      {leadershipModalOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => {
            setLeadershipModalOpen(false);
            setSelectedLeader(null);
          }}
        >
          <div
            className="mp-modal-window"
            style={{ width: "880px", maxWidth: "94vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0e2a47 0%, #1e3a8a 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={18} style={{ color: "#facc15" }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                    {selectedLeader ? selectedLeader.name : "Institutional Leadership & Vision"}
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.82)", fontWeight: 600 }}>
                    {selectedLeader ? selectedLeader.designation : `${schoolName} • Guiding Philosophies`}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {selectedLeader && (
                  <button
                    onClick={() => setSelectedLeader(null)}
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      borderRadius: "9999px",
                      padding: "0.35rem 0.85rem",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    View All Leaders
                  </button>
                )}
                <button
                  onClick={() => {
                    setLeadershipModalOpen(false);
                    setSelectedLeader(null);
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.2rem", background: "#f8fafc", maxHeight: "80vh", overflowY: "auto" }}>
              {selectedLeader ? (
                /* SINGLE LEADER DETAIL VIEW */
                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: "240px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(14, 42, 71, 0.12)",
                      flexShrink: 0,
                      background: "#ffffff",
                      border: "2px solid #fed7aa",
                    }}
                  >
                    <img
                      src={selectedLeader.image}
                      alt={selectedLeader.name}
                      style={{ width: "100%", height: "280px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "12px", textAlign: "center" }}>
                      <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0e2a47" }}>
                        {selectedLeader.name}
                      </h4>
                      <p style={{ margin: "2px 0 0", fontSize: "0.8rem", fontWeight: 800, color: "#ea580c" }}>
                        {selectedLeader.designation}
                      </p>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "1.2rem",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "2.5rem",
                          lineHeight: 1,
                          color: "#ea580c",
                          fontFamily: "serif",
                          fontWeight: 900,
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        “
                      </span>
                      <p
                        style={{
                          fontSize: "0.92rem",
                          lineHeight: 1.65,
                          color: "#334155",
                          whiteSpace: "pre-line",
                          margin: 0,
                          fontWeight: 500,
                        }}
                      >
                        {selectedLeader.fullQuote}
                      </p>
                      <div
                        style={{
                          marginTop: "1.2rem",
                          paddingTop: "0.8rem",
                          borderTop: "1px solid #f1f5f9",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem", color: "#64748b", fontStyle: "italic" }}>
                          — {schoolName} Leadership Desk
                        </span>
                        <button
                          onClick={() => setSelectedLeader(null)}
                          style={{
                            background: "#ea580c",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "9999px",
                            padding: "0.4rem 1rem",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Back to Leaders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* GRID OF LEADERS */
                <div>
                  <p style={{ margin: "0 0 14px", fontSize: "0.84rem", color: "#64748b", fontWeight: 600 }}>
                    Tap any leadership card to read their complete vision and message for {schoolName} scholars:
                  </p>
                  {activeLeaders.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          activeLeaders.length === 1
                            ? "minmax(280px, 360px)"
                            : activeLeaders.length === 2
                              ? "repeat(auto-fit, minmax(260px, 1fr))"
                              : "repeat(auto-fit, minmax(200px, 1fr))",
                        justifyContent: activeLeaders.length === 1 ? "center" : "stretch",
                        gap: "14px",
                      }}
                    >
                      {activeLeaders.map((leader) => (
                        <div
                          key={leader.id}
                          className="mv-leader-card"
                          onClick={() => setSelectedLeader(leader)}
                          title={`Click to read message from ${leader.name}`}
                        >
                          <div className="mv-leader-img-box">
                            <img src={leader.image} alt={leader.name} className="mv-leader-img" />
                          </div>
                          <div className="mv-leader-meta">
                            <h4 className="mv-leader-name">{leader.name}</h4>
                            <span className="mv-leader-role">{leader.designation}</span>
                            <p className="mv-leader-preview">{leader.quotePreview}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "30px", textAlign: "center", color: "#64748b", fontSize: "0.88rem" }}>
                      No leadership vision statements published yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AdminExitFullscreenModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setInternalIsFullscreen(false)}
      />
    </div>
  );
}
