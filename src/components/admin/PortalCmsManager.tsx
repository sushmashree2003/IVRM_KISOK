"use client";

import React, { useState, useEffect } from "react";
import {
  CampusInfoData,
  CampusBranding,
  LeadershipMember,
  TourFacility,
  GalleryItem,
  CampusEvent,
  CampusAchievement,
  CampusLiveNotice,
} from "@/types/campus";
import KioskLivePreviewModal from "@/components/admin/KioskLivePreviewModal";
import {
  Building2,
  Sparkles,
  Save,
  Eye,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Users,
  MapPin,
  Calendar,
  Award,
  Layers,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  Megaphone,
  Globe,
  Sliders,
  X,
  Play,
} from "lucide-react";

type CmsTab =
  | "branding"
  | "hero"
  | "facilities"
  | "gallery"
  | "events"
  | "achievements"
  | "stats";

// =========================================================================
// REUSABLE DUAL PHOTO INPUT CONTROL (Upload File OR Enter URL)
// =========================================================================
interface PhotoInputControlProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  category: string;
  subtext?: string;
  placeholder?: string;
  isUploading?: boolean;
  onUploadFile: (file: File, category: string, onSuccess: (url: string) => void) => void;
  previewShape?: "square" | "circle" | "banner";
}

function PhotoInputControl({
  label,
  value,
  onChange,
  category,
  subtext,
  placeholder = "https://... or /path/to/image.jpg",
  isUploading,
  onUploadFile,
  previewShape = "square",
}: PhotoInputControlProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const inputId = `upload-${category}-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "0.85rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          {label}
        </label>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            type="button"
            onClick={() => setMode("url")}
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: mode === "url" ? "#ea580c" : "#cbd5e1",
              background: mode === "url" ? "#ffedd5" : "#f8fafc",
              color: mode === "url" ? "#c2410c" : "#64748b",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: mode === "upload" ? "#ea580c" : "#cbd5e1",
              background: mode === "upload" ? "#ffedd5" : "#f8fafc",
              color: mode === "upload" ? "#c2410c" : "#64748b",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {/* Live Thumbnail Preview */}
        <div
          style={{
            width: previewShape === "banner" ? 72 : 46,
            height: 46,
            borderRadius: previewShape === "circle" ? "9999px" : "8px",
            background: "#f1f5f9",
            border: "1.5px solid #cbd5e1",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ImageIcon size={18} style={{ color: "#94a3b8" }} />
          )}
        </div>

        {/* Input or Upload Form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {mode === "url" ? (
            <input
              type="text"
              value={value || ""}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: "100%",
                padding: "0.45rem 0.65rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.78rem",
              }}
            />
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="file"
                accept="image/*"
                id={inputId}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadFile(file, category, (url) => {
                      onChange(url);
                    });
                  }
                }}
              />
              <label
                htmlFor={inputId}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  padding: "0.38rem 0.8rem",
                  borderRadius: "6px",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Upload size={13} /> {isUploading ? "Uploading..." : "Choose Local File"}
              </label>
              {value && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "220px",
                  }}
                  title={value}
                >
                  {value}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Clear image"
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#ef4444",
              borderRadius: "6px",
              padding: "0.35rem 0.5rem",
              fontSize: "0.7rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {subtext && (
        <span style={{ fontSize: "0.68rem", color: "#64748b", margin: 0 }}>
          {subtext}
        </span>
      )}
    </div>
  );
}

// =========================================================================
// REUSABLE DUAL VIDEO INPUT CONTROL (Upload MP4/WebM OR Enter URL)
// =========================================================================
interface VideoInputControlProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isUploading?: boolean;
  onUploadFile: (file: File, category: string, onSuccess: (url: string) => void) => void;
  subtext?: string;
}

function VideoInputControl({
  label,
  value,
  onChange,
  isUploading,
  onUploadFile,
  subtext = "Upload a 15–30 second MP4/WebM campus promo clip or enter a public asset path / remote video URL.",
}: VideoInputControlProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const inputId = `upload-video-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "0.95rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
          <Video size={16} style={{ color: "#ea580c" }} />
          {label}
        </label>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            type="button"
            onClick={() => setMode("url")}
            style={{
              padding: "2px 10px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: mode === "url" ? "#ea580c" : "#cbd5e1",
              background: mode === "url" ? "#ffedd5" : "#f8fafc",
              color: mode === "url" ? "#c2410c" : "#64748b",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            style={{
              padding: "2px 10px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: mode === "upload" ? "#ea580c" : "#cbd5e1",
              background: mode === "upload" ? "#ffedd5" : "#f8fafc",
              color: mode === "upload" ? "#c2410c" : "#64748b",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Upload MP4
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Live Video Player Preview */}
        <div
          style={{
            width: "180px",
            height: "105px",
            borderRadius: "8px",
            background: "#0f172a",
            border: "1.5px solid #cbd5e1",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {value ? (
            <video
              key={value}
              src={value}
              controls
              muted
              playsInline
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => {
                console.warn("[VideoInputControl] Preview load notice for:", value);
              }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "#64748b" }}>
              <Video size={24} />
              <span style={{ fontSize: "0.68rem" }}>No video loaded</span>
            </div>
          )}
        </div>

        {/* Input or Upload Form */}
        <div style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {mode === "url" ? (
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "3px" }}>
                Direct Video Path or Cloud URL:
              </label>
              <input
                type="text"
                value={value || ""}
                placeholder="/Madhuvan_Vatika_Public_School_Full_Promo_20s.mp4 or https://..."
                onChange={(e) => onChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.8rem",
                }}
              />
            </div>
          ) : (
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
                Choose local MP4 or WebM video file:
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  id={inputId}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUploadFile(file, "hero", (url) => {
                        onChange(url);
                      });
                    }
                  }}
                />
                <label
                  htmlFor={inputId}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    padding: "0.45rem 0.95rem",
                    borderRadius: "6px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Upload size={14} /> {isUploading ? "Uploading Video..." : "Choose Local Video File"}
                </label>
                {value && (
                  <span
                    style={{
                      fontSize: "0.74rem",
                      color: "#64748b",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "240px",
                    }}
                    title={value}
                  >
                    {value}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
              {subtext}
            </span>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                title="Clear video"
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  borderRadius: "6px",
                  padding: "0.3rem 0.65rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <X size={12} /> Clear Video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN COMPONENT: PORTAL CMS MANAGER
// =========================================================================
export default function PortalCmsManager({ onBackToDashboard }: { onBackToDashboard?: () => void }) {
  const [data, setData] = useState<CampusInfoData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [activeTab, setActiveTab] = useState<CmsTab>("branding");
  const [brandingSubTab, setBrandingSubTab] = useState<"identity" | "news" | "tour" | "leaders" | "all">("identity");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/campus-info");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setSavedSnapshot(JSON.stringify(json));
      } else {
        const fallbackRes = await fetch("/api/kiosk/campus-info");
        const json = await fallbackRes.json();
        setData(json);
        setSavedSnapshot(JSON.stringify(json));
      }
    } catch (e: any) {
      console.error("Failed to load campus info in CMS:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const hasUnsavedChanges = data ? JSON.stringify(data) !== savedSnapshot : false;

  // Publish / Save handler with automatic .env synchronization
  const handlePublish = async () => {
    if (!data) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/admin/campus-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setSavedSnapshot(JSON.stringify(data));
        setSaveStatus({
          type: "success",
          message: "Published successfully! Terminals on /dashboard and .env configurations have been updated.",
        });
        setIsPreviewOpen(false);
      } else {
        setSaveStatus({
          type: "error",
          message: resJson.error || "Failed to publish changes.",
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        message: err.message || "Network error while saving.",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  // File upload handler
  const handleFileUpload = async (
    file: File,
    category: string,
    onSuccess: (url: string) => void
  ) => {
    if (file.size > 500 * 1024 * 1024) {
      alert(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of 500MB.`);
      return;
    }

    const uploadId = `${category}-${Date.now()}`;
    setUploadingField(uploadId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/admin/campus-info/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok && result.success && result.url) {
        onSuccess(result.url);
      } else {
        alert(result.error || "Upload failed. Please try again.");
      }
    } catch (error: any) {
      alert(`File upload failed: ${error.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  if (isLoading || !data) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 1rem", color: "#ea580c" }} />
        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Loading Campus CMS Configuration...</p>
      </div>
    );
  }

  // Helper for ticker notices to convert legacy strings to structured objects
  const structuredTicker = data.branding.tickerNotices.map((n, idx) => {
    if (typeof n === "object" && n !== null) return n as CampusLiveNotice;
    return {
      id: `notice-${idx}`,
      text: String(n),
      badge: "NOTICE",
      priority: "normal" as const,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {/* CMS HEADER ACTION BAR */}
      <header
        style={{
          background: "linear-gradient(135deg, #0e2a47 0%, #1e3a5f 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "0 10px 25px -5px rgba(14, 42, 71, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "10px",
              background: "rgba(234, 88, 12, 0.2)",
              border: "1.5px solid rgba(234, 88, 12, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fb923c",
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Campus Portal CMS</h2>
              <span
                style={{
                  background: hasUnsavedChanges ? "#ea580c" : "rgba(34, 197, 94, 0.25)",
                  color: hasUnsavedChanges ? "#ffffff" : "#4ade80",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  border: `1px solid ${hasUnsavedChanges ? "transparent" : "rgba(74, 222, 128, 0.4)"}`,
                }}
              >
                {hasUnsavedChanges ? "● Unsaved Draft" : "✓ In Sync with Kiosk & .env"}
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
              Manage dynamic media, events, leadership, facilities, and announcements for <code>/dashboard</code>
            </p>
          </div>
        </div>

        {/* Global CMS Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Reload / Discard Draft Button */}
          {hasUnsavedChanges && (
            <button
              onClick={loadData}
              title="Discard draft edits and reload published state"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#e2e8f0",
                borderRadius: "8px",
                padding: "0.55rem 0.9rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={13} /> Discard Changes
            </button>
          )}

          {/* Live Preview Button */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            title="Preview live changes before publishing"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "0.55rem 1.15rem",
              fontSize: "0.82rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.35)",
            }}
          >
            <Eye size={15} /> 👁️ Live Preview Kiosk
          </button>

          {/* Save & Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isSaving}
            style={{
              background: isSaving
                ? "#94a3b8"
                : "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              border: "none",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "0.55rem 1.25rem",
              fontSize: "0.82rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(234, 88, 12, 0.4)",
            }}
          >
            {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            {isSaving ? "Saving..." : "💾 Save & Publish to Kiosk"}
          </button>
        </div>
      </header>

      {/* STATUS NOTIFICATION TOAST */}
      {saveStatus && (
        <div
          style={{
            background: saveStatus.type === "success" ? "#ecfdf5" : "#fef2f2",
            border: `1px solid ${saveStatus.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            color: saveStatus.type === "success" ? "#065f46" : "#991b1b",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.82rem",
            fontWeight: 700,
          }}
        >
          {saveStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* TAB NAVIGATION PILLS */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          background: "#f1f5f9",
          padding: "6px",
          borderRadius: "14px",
          overflowX: "auto",
        }}
      >
        {[
          { id: "branding" as CmsTab, label: "Branding, Live News, 360 Tour & Leaders", icon: Building2 },
          { id: "hero" as CmsTab, label: "Hero Video & Reel", icon: Video },
          { id: "facilities" as CmsTab, label: "Campus Facilities", icon: MapPin },
          { id: "gallery" as CmsTab, label: "Photo Gallery", icon: ImageIcon },
          { id: "events" as CmsTab, label: "Upcoming Events", icon: Calendar },
          { id: "achievements" as CmsTab, label: "Wall of Fame", icon: Award },
          { id: "stats" as CmsTab, label: "Campus Telemetry", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#ea580c" : "#64748b",
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.06)" : "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-NAVIGATION TAB BAR FOR TAB 1 (TOP-NAVIGATION STYLE & FEATURE) */}
      {activeTab === "branding" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f1f5f9",
            padding: "6px",
            borderRadius: "14px",
            border: "1.5px solid #fed7aa",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 10px 0 6px",
              borderRight: "1px solid #cbd5e1",
              flexShrink: 0,
            }}
          >
            <Sparkles size={14} style={{ color: "#ea580c" }} />
            <span
              style={{
                fontSize: "0.74rem",
                fontWeight: 800,
                color: "#ea580c",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              Sub-Navigation:
            </span>
          </div>

          {[
            { id: "identity" as const, label: "1. Branding & Identity", icon: Building2 },
            { id: "news" as const, label: `2. Campus Live News (${structuredTicker.length})`, icon: Megaphone },
            { id: "tour" as const, label: "3. 360° Tour Walkthrough", icon: Play },
            { id: "leaders" as const, label: `4. Leadership Desk (${data.leadership?.length || 0})`, icon: Users },
            { id: "all" as const, label: "👁️ View All Sections (Scrollable)", icon: Layers },
          ].map((sub) => {
            const Icon = sub.icon;
            const isSubActive = brandingSubTab === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setBrandingSubTab(sub.id);
                  if (sub.id === "all") {
                    const el = document.getElementById("sub-branding");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0.52rem 0.95rem",
                  borderRadius: "10px",
                  border: isSubActive ? "1px solid #fdba74" : "1px solid transparent",
                  background: isSubActive ? "#ffffff" : "transparent",
                  color: isSubActive ? "#ea580c" : "#64748b",
                  fontWeight: isSubActive ? 800 : 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  boxShadow: isSubActive ? "0 2px 8px rgba(234, 88, 12, 0.12)" : "none",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
              >
                <Icon size={14} style={{ color: isSubActive ? "#ea580c" : "#64748b" }} />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT PANELS */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
        }}
      >
        {/* =========================================================================
           TAB 1: BRANDING, LIVE NEWS, 360 TOUR & LEADERS
           ========================================================================= */}
        {activeTab === "branding" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* TAB MAIN HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0e2a47", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Building2 size={18} style={{ color: "#ea580c" }} />
                  Branding, Live News, 360 Tour &amp; Leaders
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.76rem", color: "#64748b" }}>
                  Primary configuration hub: updates here synchronize with <code>.env</code>, kiosk marquees, 360 walkthroughs, and leadership messages.
                </p>
              </div>
              <span style={{ fontSize: "0.72rem", background: "#f0fdf4", color: "#16a34a", padding: "4px 10px", borderRadius: "6px", fontWeight: 700, border: "1px solid #bbf7d0" }}>
                ✓ .env Auto-Sync Active
              </span>
            </div>

            {/* Quick in-page navigation anchors when in All mode */}
            {brandingSubTab === "all" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "#fff7ed",
                  borderRadius: "10px",
                  border: "1px dashed #fed7aa",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#c2410c" }}>Scroll directly to:</span>
                {[
                  { target: "sub-branding", label: "1. Identity & Logo" },
                  { target: "sub-live-news", label: "2. Live News" },
                  { target: "sub-tour-360", label: "3. 360° Tour" },
                  { target: "sub-leaders", label: "4. Leadership Desk" },
                ].map((item) => (
                  <button
                    key={item.target}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(item.target);
                      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #fdba74",
                      color: "#ea580c",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {item.label} ↓
                  </button>
                ))}
              </div>
            )}

            {/* SUB-SECTION 1: INSTITUTIONAL BRANDING & IDENTITY */}
            {(brandingSubTab === "all" || brandingSubTab === "identity") && (
              <div id="sub-branding" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: "1.5px solid #fed7aa", paddingBottom: "6px" }}>
                  <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                    1
                  </span>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0e2a47" }}>
                    Institutional Identity &amp; Accreditations
                  </h4>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Institution Full Name
                    </label>
                    <input
                      type="text"
                      value={data.branding.instituteName}
                      onChange={(e) =>
                        setData({ ...data, branding: { ...data.branding, instituteName: e.target.value } })
                      }
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Short Acronym / Code (e.g. MVPS, BBHS)
                    </label>
                    <input
                      type="text"
                      value={data.branding.shortCode}
                      onChange={(e) =>
                        setData({ ...data, branding: { ...data.branding, shortCode: e.target.value } })
                      }
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      AI Copilot / Assistant Name (e.g. MVPS AI, SGS AI)
                    </label>
                    <input
                      type="text"
                      value={data.branding.aiName || ""}
                      onChange={(e) =>
                        setData({ ...data, branding: { ...data.branding, aiName: e.target.value } })
                      }
                      placeholder="e.g. MVPS AI"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Institutional Motto / Slogan
                    </label>
                    <input
                      type="text"
                      value={data.branding.motto}
                      onChange={(e) =>
                        setData({ ...data, branding: { ...data.branding, motto: e.target.value } })
                      }
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Affiliation &amp; Accreditations Badge
                    </label>
                    <input
                      type="text"
                      value={data.branding.affiliation}
                      onChange={(e) =>
                        setData({ ...data, branding: { ...data.branding, affiliation: e.target.value } })
                      }
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>

                {/* Logo Photo Control (Upload OR URL) */}
                <PhotoInputControl
                  label="Institutional Logo Asset (Synchronized with .env NEXT_PUBLIC_INSTITUTE_LOGO)"
                  value={data.branding.logo}
                  onChange={(val) => setData({ ...data, branding: { ...data.branding, logo: val } })}
                  category="brand"
                  subtext="High-resolution PNG or SVG logo. If modified, automatically updates both kiosk JSON and .env variables."
                  previewShape="circle"
                  isUploading={uploadingField?.startsWith("brand")}
                  onUploadFile={handleFileUpload}
                />

                {/* Sub-tab footer switch when viewing single identity tab */}
                {brandingSubTab === "identity" && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Section 1 of 4 • Identity &amp; Accreditations</span>
                    <button
                      type="button"
                      onClick={() => setBrandingSubTab("news")}
                      style={{
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                        color: "#ea580c",
                        padding: "0.45rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Next: 2. Campus Live News &amp; Marquee →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUB-SECTION 2: CAMPUS LIVE NEWS & NOTICE TICKER */}
            {(brandingSubTab === "all" || brandingSubTab === "news") && (
              <div id="sub-live-news" style={{ borderTop: brandingSubTab === "all" ? "1.5px solid #fed7aa" : "none", paddingTop: brandingSubTab === "all" ? "1.25rem" : "0", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: "8px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                    2
                  </span>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0e2a47", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Megaphone size={16} style={{ color: "#ea580c" }} />
                    Campus Live News &amp; Notice Marquee
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                  Headlines scrolling continuously in the top live marquee of the main kiosk dashboard.
                </p>
              </div>

                <button
                  type="button"
                  onClick={() => {
                    const newNotice: CampusLiveNotice = {
                      id: `notice_${Date.now()}`,
                      text: "New campus announcement notice.",
                      badge: "ADMISSION",
                      priority: "normal",
                    };
                    setData({
                      ...data,
                      branding: {
                        ...data.branding,
                        tickerNotices: [...data.branding.tickerNotices, newNotice],
                      },
                    });
                  }}
                  style={{
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={13} /> Add Live News Item
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {structuredTicker.map((notice, idx) => (
                  <div
                    key={notice.id || idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr 110px auto auto",
                      gap: "8px",
                      alignItems: "center",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "8px 10px",
                    }}
                  >
                    {/* Badge Input */}
                    <input
                      type="text"
                      value={notice.badge || "NOTICE"}
                      placeholder="Badge Tag"
                      onChange={(e) => {
                        const updated = [...structuredTicker];
                        updated[idx].badge = e.target.value.toUpperCase();
                        setData({ ...data, branding: { ...data.branding, tickerNotices: updated } });
                      }}
                      style={{
                        padding: "0.38rem 0.55rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: notice.priority === "urgent" ? "#dc2626" : notice.priority === "high" ? "#ea580c" : "#0284c7",
                      }}
                    />

                    {/* Headline Text */}
                    <input
                      type="text"
                      value={notice.text}
                      placeholder="News headline or announcement..."
                      onChange={(e) => {
                        const updated = [...structuredTicker];
                        updated[idx].text = e.target.value;
                        setData({ ...data, branding: { ...data.branding, tickerNotices: updated } });
                      }}
                      style={{
                        padding: "0.38rem 0.65rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.8rem",
                      }}
                    />

                    {/* Priority Selector */}
                    <select
                      value={notice.priority || "normal"}
                      onChange={(e) => {
                        const updated = [...structuredTicker];
                        updated[idx].priority = e.target.value as any;
                        setData({ ...data, branding: { ...data.branding, tickerNotices: updated } });
                      }}
                      style={{
                        padding: "0.38rem 0.55rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>

                    {/* Move Up / Down */}
                    <div style={{ display: "flex", gap: "2px" }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...structuredTicker];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          setData({ ...data, branding: { ...data.branding, tickerNotices: updated } });
                        }}
                        style={{
                          background: "#e2e8f0",
                          border: "none",
                          borderRadius: "4px",
                          width: "26px",
                          height: "26px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: idx === 0 ? "default" : "pointer",
                          opacity: idx === 0 ? 0.4 : 1,
                        }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === structuredTicker.length - 1}
                        onClick={() => {
                          if (idx === structuredTicker.length - 1) return;
                          const updated = [...structuredTicker];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          setData({ ...data, branding: { ...data.branding, tickerNotices: updated } });
                        }}
                        style={{
                          background: "#e2e8f0",
                          border: "none",
                          borderRadius: "4px",
                          width: "26px",
                          height: "26px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: idx === structuredTicker.length - 1 ? "default" : "pointer",
                          opacity: idx === structuredTicker.length - 1 ? 0.4 : 1,
                        }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Delete Notice */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = structuredTicker.filter((_, i) => i !== idx);
                        setData({ ...data, branding: { ...data.branding, tickerNotices: updated } });
                      }}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        color: "#ef4444",
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sub-tab footer switch when viewing single news tab */}
              {brandingSubTab === "news" && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setBrandingSubTab("identity")}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      color: "#475569",
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← 1. Identity &amp; Accreditations
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandingSubTab("tour")}
                    style={{
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      color: "#ea580c",
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Next: 3. 360° Virtual Tour &amp; Video →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SUB-SECTION 3: 360° CAMPUS TOUR & VIDEO WORKFLOW CONFIGURATION */}
          {(brandingSubTab === "all" || brandingSubTab === "tour") && (
            <div id="sub-tour-360" style={{ borderTop: brandingSubTab === "all" ? "1.5px solid #fed7aa" : "none", paddingTop: brandingSubTab === "all" ? "1.25rem" : "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                      3
                    </span>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0e2a47", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Play size={16} style={{ color: "#ea580c" }} />
                      360° Virtual Campus Tour &amp; Video Walkthrough
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                    Configure the school's existing 360° tour video or virtual walkthrough link for the "Explore 360° Campus" button.
                  </p>
                </div>
              </div>

              <VideoInputControl
                label="360° Tour Video / Walkthrough Asset (MP4/WebM/YouTube/Cloud URL)"
                value={data.branding.virtualTour360Url || "/campus_promo.mp4"}
                onChange={(val) =>
                  setData({
                    ...data,
                    branding: { ...data.branding, virtualTour360Url: val },
                    virtualTour360Url: val,
                    hero: { ...data.hero, videoUrl: val },
                  })
                }
                isUploading={uploadingField?.startsWith("hero")}
                onUploadFile={handleFileUpload}
                subtext="Upload the school's 360 walkthrough clip or enter an existing public asset (e.g. /campus_promo.mp4, YouTube, or Kuula/Matterport tour). Automatically synchronizes as the Hero Showcase video."
              />

              {/* Sub-tab footer switch when viewing single tour tab */}
              {brandingSubTab === "tour" && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setBrandingSubTab("news")}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      color: "#475569",
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← 2. Campus Live News
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandingSubTab("leaders")}
                    style={{
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      color: "#ea580c",
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Next: 4. Leadership Desk &amp; Vision →
                  </button>
                </div>
              )}
            </div>
          )}

            {/* SUB-SECTION 4: LEADERSHIP DESK DIRECT SECTION IN TAB 1 */}
            {(brandingSubTab === "all" || brandingSubTab === "leaders") && (
              <div id="sub-leaders" style={{ borderTop: brandingSubTab === "all" ? "1.5px solid #fed7aa" : "none", paddingTop: brandingSubTab === "all" ? "1.25rem" : "0", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                      4
                    </span>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0e2a47", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users size={16} style={{ color: "#ea580c" }} />
                      Leadership Desk &amp; Vision Statements
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                    Chairman, Principal, and Director statements featured in the Leadership &amp; Vision modal on /dashboard.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newMember: LeadershipMember = {
                      id: `leader_${Date.now()}`,
                      name: "New Leader",
                      designation: "Administrator",
                      image: "/admin_avatar.png",
                      quotePreview: "Inspiring excellence across all academic disciplines.",
                      fullQuote: "Welcome to our esteemed institution. We strive to nurture every student's innate potential through dedicated mentorship and state-of-the-art facilities.",
                      active: true,
                    };
                    setData({ ...data, leadership: [...data.leadership, newMember] });
                  }}
                  style={{
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={13} /> Add Leader
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {data.leadership.map((leader, idx) => (
                  <div
                    key={leader.id}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
                      <div>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Full Name</label>
                        <input
                          type="text"
                          value={leader.name}
                          onChange={(e) => {
                            const updated = [...data.leadership];
                            updated[idx].name = e.target.value;
                            setData({ ...data, leadership: updated });
                          }}
                          style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem", fontWeight: 700 }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Designation</label>
                        <input
                          type="text"
                          value={leader.designation}
                          onChange={(e) => {
                            const updated = [...data.leadership];
                            updated[idx].designation = e.target.value;
                            setData({ ...data, leadership: updated });
                          }}
                          style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>

                    <PhotoInputControl
                      label={`Leader Portrait (${leader.name})`}
                      value={leader.image}
                      onChange={(val) => {
                        const updated = [...data.leadership];
                        updated[idx].image = val;
                        setData({ ...data, leadership: updated });
                      }}
                      category="leadership"
                      previewShape="circle"
                      isUploading={uploadingField?.startsWith("leadership")}
                      onUploadFile={handleFileUpload}
                    />

                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Quote Preview (Teaser)</label>
                      <input
                        type="text"
                        value={leader.quotePreview}
                        onChange={(e) => {
                          const updated = [...data.leadership];
                          updated[idx].quotePreview = e.target.value;
                          setData({ ...data, leadership: updated });
                        }}
                        style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Full Message</label>
                      <textarea
                        rows={3}
                        value={leader.fullQuote}
                        onChange={(e) => {
                          const updated = [...data.leadership];
                          updated[idx].fullQuote = e.target.value;
                          setData({ ...data, leadership: updated });
                        }}
                        style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem", resize: "vertical" }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", cursor: "pointer", fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={leader.active !== false}
                          onChange={(e) => {
                            const updated = [...data.leadership];
                            updated[idx].active = e.target.checked;
                            setData({ ...data, leadership: updated });
                          }}
                        />
                        Active on Dashboard
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.leadership.filter((_, i) => i !== idx);
                          setData({ ...data, leadership: updated });
                        }}
                        style={{
                          background: "#fee2e2",
                          border: "1px solid #fecaca",
                          color: "#ef4444",
                          borderRadius: "6px",
                          padding: "0.3rem 0.75rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-tab footer switch when viewing single leadership tab */}
              {brandingSubTab === "leaders" && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setBrandingSubTab("tour")}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      color: "#475569",
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← 3. 360° Virtual Tour
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandingSubTab("all")}
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#1d4ed8",
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    👁️ View All Sections
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        )}

        {/* =========================================================================
           TAB 2: HERO SHOWCASE (.mv-hero-showcase) & VIDEO REEL
           ========================================================================= */}
        {activeTab === "hero" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header info */}
            <div>
              <h3 style={{ margin: 0, fontSize: "1.08rem", fontWeight: 800, color: "#0e2a47" }}>
                Hero Showcase Card (.mv-hero-showcase) &amp; Cinematic Media
              </h3>
              <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "#64748b" }}>
                Configure all text headlines, typography, media, and distinction stat badges rendered inside the main kiosk hero showcase card.
              </p>
            </div>

            {/* SECTION 1: TYPOGRAPHY & STORY */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                  1
                </span>
                <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0e2a47" }}>
                  Showcase Headlines &amp; Story
                </h4>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Cursive Welcome Kicker
                  </label>
                  <input
                    type="text"
                    value={data.hero.kicker || ""}
                    placeholder="Welcome to"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, kicker: e.target.value } })}
                    style={{ width: "100%", padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px", display: "block" }}>
                    Cursive font kicker displayed above the main school name.
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Main Headline Title
                  </label>
                  <input
                    type="text"
                    value={data.hero.headline || ""}
                    placeholder={data.branding.instituteName || "Leave blank to use Institute Name"}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, headline: e.target.value } })}
                    style={{ width: "100%", padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px", display: "block" }}>
                    Defaults to Institutional Name if left empty.
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Hero Description / Scholastic Mission
                </label>
                <textarea
                  rows={2}
                  value={data.hero.subheadline || ""}
                  placeholder="Empowering young minds with world-class scholastic rigor, ethical leadership, and futuristic STEM innovation."
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, subheadline: e.target.value } })}
                  style={{ width: "100%", padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem", resize: "vertical" }}
                />
              </div>
            </div>

            {/* SECTION 2: THE 4 DISTINCTION STAT BADGES (.mv-hero-pills-row) */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                  2
                </span>
                <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0e2a47" }}>
                  4 Distinction Stat Badges (.mv-hero-pills-row)
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.74rem", color: "#64748b" }}>
                Configure the 4 distinction badges shown across the middle of the showcase card.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                {/* Badge 1 */}
                <div style={{ background: "#f8fafc", border: "1.5px solid #fed7aa", borderRadius: "10px", padding: "10px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#ea580c", marginBottom: "6px" }}>
                    Badge 1 (Academic Distinction)
                  </div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Bold Text:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge1Bold ?? "100% Pass"}
                    placeholder="100% Pass"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge1Bold: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", marginBottom: "6px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Subtitle / Board:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge1Sub ?? "CBSE Board Distinction"}
                    placeholder="e.g. CBSE Board Distinction or CISCE"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge1Sub: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                  />
                </div>

                {/* Badge 2 */}
                <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "10px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#0e2a47", marginBottom: "6px" }}>
                    Badge 2 (Faculty &amp; Excellence)
                  </div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Bold Text:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge2Bold ?? "180+ Faculty"}
                    placeholder="180+ Faculty"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge2Bold: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", marginBottom: "6px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Subtitle:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge2Sub ?? "Academic Excellence"}
                    placeholder="Academic Excellence"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge2Sub: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                  />
                </div>

                {/* Badge 3 */}
                <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "10px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#0e2a47", marginBottom: "6px" }}>
                    Badge 3 (Scholars Community)
                  </div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Bold Text:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge3Bold ?? "4,200+"}
                    placeholder="4,200+"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge3Bold: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", marginBottom: "6px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Subtitle:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge3Sub ?? "Happy Scholars"}
                    placeholder="Happy Scholars"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge3Sub: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                  />
                </div>

                {/* Badge 4 */}
                <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "10px" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#0e2a47", marginBottom: "6px" }}>
                    Badge 4 (Labs &amp; Innovation)
                  </div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Bold Text:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge4Bold ?? "12 Labs"}
                    placeholder="12 Labs"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge4Bold: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", marginBottom: "6px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                    Subtitle:
                  </label>
                  <input
                    type="text"
                    value={data.hero.badge4Sub ?? "Robotics & AI Smart Hubs"}
                    placeholder="Robotics & AI Smart Hubs"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, badge4Sub: e.target.value } })}
                    style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: VISUAL MEDIA & BACKDROPS */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                  3
                </span>
                <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0e2a47" }}>
                  Showcase Media &amp; Backgrounds
                </h4>
              </div>

              {/* Video File / URL Input with Live Preview Player */}
              <VideoInputControl
                label="Showcase Background Looping Video Asset (MP4/WebM)"
                value={data.hero.videoUrl}
                onChange={(val) =>
                  setData({
                    ...data,
                    hero: { ...data.hero, videoUrl: val },
                    branding: { ...data.branding, virtualTour360Url: val },
                    virtualTour360Url: val,
                  })
                }
                isUploading={uploadingField?.startsWith("hero")}
                onUploadFile={handleFileUpload}
                subtext="Upload a 15–30s MP4/WebM looping promo clip to local storage or enter any direct cloud URL. Automatically synchronizes as the 360° Walkthrough Video."
              />

              <PhotoInputControl
                label="Hero Video Poster / Buffer Fallback Image"
                value={data.hero.posterUrl}
                onChange={(val) => setData({ ...data, hero: { ...data.hero, posterUrl: val } })}
                category="hero"
                subtext="Image displayed while video is buffering or on touch kiosks that restrict video autoplay."
                previewShape="banner"
                isUploading={uploadingField?.startsWith("hero")}
                onUploadFile={handleFileUpload}
              />

              <PhotoInputControl
                label="Showcase Card Backdrop Image (.mv-hero-showcase)"
                value={data.hero.backgroundImageUrl || "/hero_school_building.jpg"}
                onChange={(val) => setData({ ...data, hero: { ...data.hero, backgroundImageUrl: val } })}
                category="hero"
                subtext="Primary architecture backdrop photo displayed behind the video overlay."
                previewShape="banner"
                isUploading={uploadingField?.startsWith("hero")}
                onUploadFile={handleFileUpload}
              />
            </div>

            {/* SECTION 4: ACTION BUTTONS & FOOTER TAGLINE */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ background: "#ea580c", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                  4
                </span>
                <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0e2a47" }}>
                  Action Buttons &amp; Footer Tagline
                </h4>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Primary Button Label (Opens 360 Tour)
                  </label>
                  <input
                    type="text"
                    value={data.hero.button1Text ?? "Explore 360° Campus"}
                    placeholder="Explore 360° Campus"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, button1Text: e.target.value } })}
                    style={{ width: "100%", padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Secondary Button Label (Opens Leadership)
                  </label>
                  <input
                    type="text"
                    value={data.hero.button2Text ?? "Leadership & Vision"}
                    placeholder="Leadership & Vision"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, button2Text: e.target.value } })}
                    style={{ width: "100%", padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Footer Tagline Suffix (— {data.branding.instituteName || "School"} ...)
                  </label>
                  <input
                    type="text"
                    value={data.hero.legacyTag ?? "Legacy"}
                    placeholder="Legacy (e.g. Legacy, Excellence, Vision)"
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, legacyTag: e.target.value } })}
                    style={{ width: "100%", padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 3: CAMPUS FACILITIES (360 TOUR)
           ========================================================================= */}
        {activeTab === "facilities" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0e2a47" }}>
                  Campus Facilities &amp; 360° Architecture Tour
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Items here are rendered both in the interactive 360° tour modal and the right column mini-grid.
                </p>
              </div>

              <button
                onClick={() => {
                  const newFac: TourFacility = {
                    id: `facility_${Date.now()}`,
                    title: "New Facility",
                    category: "Campus Infrastructure",
                    image: "/mvps/facilities/classrooms_01.jpg",
                    description: "Modern facility equipped with state-of-the-art infrastructure.",
                    highlights: ["Smart Interactive Panels", "Air-conditioned", "24/7 Monitored"],
                    active: true,
                  };
                  setData({ ...data, facilities: [...data.facilities, newFac] });
                }}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Add Facility
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {data.facilities.map((fac, idx) => (
                <div
                  key={fac.id}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <PhotoInputControl
                    label={`Facility Photo (${fac.title})`}
                    value={fac.image}
                    onChange={(val) => {
                      const updated = [...data.facilities];
                      updated[idx].image = val;
                      setData({ ...data, facilities: updated });
                    }}
                    category="facilities"
                    previewShape="banner"
                    isUploading={uploadingField?.startsWith("facilities")}
                    onUploadFile={handleFileUpload}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Facility Name</label>
                      <input
                        type="text"
                        value={fac.title}
                        onChange={(e) => {
                          const updated = [...data.facilities];
                          updated[idx].title = e.target.value;
                          setData({ ...data, facilities: updated });
                        }}
                        style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Category</label>
                      <input
                        type="text"
                        value={fac.category}
                        onChange={(e) => {
                          const updated = [...data.facilities];
                          updated[idx].category = e.target.value;
                          setData({ ...data, facilities: updated });
                        }}
                        style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Description</label>
                    <textarea
                      rows={2}
                      value={fac.description}
                      onChange={(e) => {
                        const updated = [...data.facilities];
                        updated[idx].description = e.target.value;
                        setData({ ...data, facilities: updated });
                      }}
                      style={{ width: "100%", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", cursor: "pointer", fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={fac.active !== false}
                        onChange={(e) => {
                          const updated = [...data.facilities];
                          updated[idx].active = e.target.checked;
                          setData({ ...data, facilities: updated });
                        }}
                      />
                      Active in Tour
                    </label>

                    <button
                      onClick={() => {
                        const updated = data.facilities.filter((_, i) => i !== idx);
                        setData({ ...data, facilities: updated });
                      }}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        color: "#ef4444",
                        borderRadius: "6px",
                        padding: "0.3rem 0.7rem",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 5: PHOTO GALLERY & HOME SLIDESHOW (BROWSE FULL GALLERY)
           ========================================================================= */}
        {activeTab === "gallery" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0e2a47", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ImageIcon size={18} style={{ color: "#ea580c" }} />
                  Photo Gallery &amp; Home Slideshow (Browse Full Gallery)
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Upload and manage campus photos displayed in the Kiosk home background slideshow, the "Browse Full Gallery" modal, and on /dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newItem: GalleryItem = {
                    id: `gallery_${Date.now()}`,
                    title: "New Campus Moment",
                    shortTitle: "Campus Life",
                    category: "Campus & Fleet",
                    categoryFilter: "facilities",
                    date: "Nov 2026",
                    description: "Capturing dynamic student growth, activities, and campus excellence.",
                    src: "/mvps/facilities/classrooms_01.jpg",
                    featured: true,
                  };
                  setData({ ...data, gallery: [newItem, ...data.gallery] });
                }}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
                }}
              >
                <Plus size={15} /> Add Gallery Photo
              </button>
            </div>

            {/* Quick summary stats pill */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "0.74rem",
                color: "#475569",
              }}
            >
              <span>Total Photos: <b>{data.gallery.length}</b></span>
              <span>• Sports: <b>{data.gallery.filter((g) => g.categoryFilter === "sports").length}</b></span>
              <span>• Academics: <b>{data.gallery.filter((g) => g.categoryFilter === "academics").length}</b></span>
              <span>• Co-Curricular &amp; Stage: <b>{data.gallery.filter((g) => g.categoryFilter === "cultural").length}</b></span>
              <span>• Campus &amp; Fleet: <b>{data.gallery.filter((g) => g.categoryFilter === "facilities").length}</b></span>
              <span>• In Home Slideshow: <b>{data.gallery.filter((g) => g.featured !== false).length}</b></span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {data.gallery.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1.5px solid #e2e8f0",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  {/* Photo Input (Upload or URL with banner preview) */}
                  <PhotoInputControl
                    label={`Photo #${idx + 1}: ${item.title || "Campus Moment"}`}
                    value={item.src}
                    onChange={(val) => {
                      const updated = [...data.gallery];
                      updated[idx].src = val;
                      setData({ ...data, gallery: updated });
                    }}
                    category="gallery"
                    previewShape="banner"
                    subtext="Select a local JPG/PNG/WebP photo or enter a cloud image URL."
                    isUploading={uploadingField?.startsWith("gallery")}
                    onUploadFile={handleFileUpload}
                  />

                  {/* Title */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Photo Title (Headline)</label>
                    <input
                      type="text"
                      value={item.title}
                      placeholder="Photo Title (e.g. Inter-House Cricket Championship Final)"
                      onChange={(e) => {
                        const updated = [...data.gallery];
                        updated[idx].title = e.target.value;
                        setData({ ...data, gallery: updated });
                      }}
                      style={{ padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem", fontWeight: 700 }}
                    />
                  </div>

                  {/* Category & Date */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Category Tab</label>
                      <select
                        value={item.categoryFilter}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          const labelMap: Record<string, string> = {
                            sports: "Sports & Athletics",
                            academics: "Academics & Labs",
                            cultural: "Co-Curricular & Stage",
                            facilities: "Campus & Fleet",
                          };
                          const updated = [...data.gallery];
                          updated[idx].categoryFilter = val;
                          updated[idx].category = labelMap[val] || "Campus";
                          setData({ ...data, gallery: updated });
                        }}
                        style={{ width: "100%", padding: "0.45rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                      >
                        <option value="sports">Sports &amp; Athletics</option>
                        <option value="academics">Academics &amp; Labs</option>
                        <option value="cultural">Co-Curricular &amp; Stage</option>
                        <option value="facilities">Campus &amp; Fleet</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>Event Date / Period</label>
                      <input
                        type="text"
                        value={item.date}
                        placeholder="e.g. Nov 2026"
                        onChange={(e) => {
                          const updated = [...data.gallery];
                          updated[idx].date = e.target.value;
                          setData({ ...data, gallery: updated });
                        }}
                        style={{ width: "100%", padding: "0.45rem 0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                      />
                    </div>
                  </div>

                  {/* Description / Caption for Full Gallery Lightbox */}
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>
                      Caption / Description (Displayed in "Browse Full Gallery" Lightbox)
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ""}
                      placeholder="Detailed caption explaining this campus event or achievement..."
                      onChange={(e) => {
                        const updated = [...data.gallery];
                        updated[idx].description = e.target.value;
                        setData({ ...data, gallery: updated });
                      }}
                      style={{
                        width: "100%",
                        padding: "0.45rem 0.65rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.76rem",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* Action Bar: Slideshow Toggle, Reorder, and Delete */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem", marginTop: "2px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", cursor: "pointer", fontWeight: 600, color: item.featured !== false ? "#ea580c" : "#64748b" }}>
                      <input
                        type="checkbox"
                        checked={item.featured !== false}
                        onChange={(e) => {
                          const updated = [...data.gallery];
                          updated[idx].featured = e.target.checked;
                          setData({ ...data, gallery: updated });
                        }}
                      />
                      ★ Home Slideshow
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {/* Reorder Buttons */}
                      <div style={{ display: "flex", gap: "2px" }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...data.gallery];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setData({ ...data, gallery: updated });
                          }}
                          title="Move photo earlier in gallery"
                          style={{
                            background: "#f1f5f9",
                            border: "none",
                            borderRadius: "4px",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: idx === 0 ? "default" : "pointer",
                            opacity: idx === 0 ? 0.4 : 1,
                          }}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === data.gallery.length - 1}
                          onClick={() => {
                            if (idx === data.gallery.length - 1) return;
                            const updated = [...data.gallery];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setData({ ...data, gallery: updated });
                          }}
                          title="Move photo later in gallery"
                          style={{
                            background: "#f1f5f9",
                            border: "none",
                            borderRadius: "4px",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: idx === data.gallery.length - 1 ? "default" : "pointer",
                            opacity: idx === data.gallery.length - 1 ? 0.4 : 1,
                          }}
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.gallery.filter((_, i) => i !== idx);
                          setData({ ...data, gallery: updated });
                        }}
                        style={{
                          background: "#fee2e2",
                          border: "1px solid #fecaca",
                          color: "#ef4444",
                          borderRadius: "6px",
                          padding: "0.3rem 0.65rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 6: UPCOMING EVENTS & TIMELINE (With Dynamic Banner Photo)
           ========================================================================= */}
        {activeTab === "events" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0e2a47" }}>
                  Upcoming Events &amp; Academic Timeline
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Events rendered on the front dashboard timeline ribbon with custom banner imagery.
                </p>
              </div>

              <button
                onClick={() => {
                  const newEv: CampusEvent = {
                    id: `event_${Date.now()}`,
                    day: "25",
                    month: "NOV",
                    name: "Institutional Annual Day",
                    tag: "Fest",
                    tagClass: "fest",
                    venue: "Grand Auditorium",
                    time: "05:00 PM – 08:00 PM",
                    image: "/Indian Classical Arts on Stage-5.png",
                    cardClass: "cultural-card",
                  };
                  setData({ ...data, events: [...data.events, newEv] });
                }}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Add Event
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {data.events.map((ev, idx) => (
                <div
                  key={ev.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "1.1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr 140px auto",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {/* Day & Month Date Badge */}
                    <div style={{ textAlign: "center", background: "#ea580c", color: "#fff", padding: "8px", borderRadius: "8px" }}>
                      <input
                        type="text"
                        value={ev.day}
                        onChange={(e) => {
                          const updated = [...data.events];
                          updated[idx].day = e.target.value;
                          setData({ ...data, events: updated });
                        }}
                        style={{ width: "100%", textAlign: "center", fontWeight: 900, background: "transparent", border: "none", color: "#fff", fontSize: "1.2rem" }}
                      />
                      <input
                        type="text"
                        value={ev.month}
                        onChange={(e) => {
                          const updated = [...data.events];
                          updated[idx].month = e.target.value.toUpperCase();
                          setData({ ...data, events: updated });
                        }}
                        style={{ width: "100%", textAlign: "center", fontWeight: 700, background: "transparent", border: "none", color: "#fed7aa", fontSize: "0.75rem" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <input
                        type="text"
                        value={ev.name}
                        placeholder="Event Name"
                        onChange={(e) => {
                          const updated = [...data.events];
                          updated[idx].name = e.target.value;
                          setData({ ...data, events: updated });
                        }}
                        style={{ padding: "0.4rem 0.7rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", fontWeight: 700 }}
                      />
                      <input
                        type="text"
                        value={ev.venue}
                        placeholder="Venue (e.g. Grand Auditorium)"
                        onChange={(e) => {
                          const updated = [...data.events];
                          updated[idx].venue = e.target.value;
                          setData({ ...data, events: updated });
                        }}
                        style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                      />
                      <input
                        type="text"
                        value={ev.time || ""}
                        placeholder="Time (e.g. 10:00 AM – 12:00 PM)"
                        onChange={(e) => {
                          const updated = [...data.events];
                          updated[idx].time = e.target.value;
                          setData({ ...data, events: updated });
                        }}
                        style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                      />
                    </div>

                    <select
                      value={ev.tagClass}
                      onChange={(e) => {
                        const updated = [...data.events];
                        updated[idx].tagClass = e.target.value as any;
                        updated[idx].tag = e.target.options[e.target.selectedIndex].text;
                        setData({ ...data, events: updated });
                      }}
                      style={{ padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                    >
                      <option value="academics">Academics</option>
                      <option value="sports">Sports</option>
                      <option value="stem">STEM</option>
                      <option value="fest">Cultural</option>
                      <option value="ptm">PTM</option>
                    </select>

                    <button
                      onClick={() => {
                        const updated = data.events.filter((_, i) => i !== idx);
                        setData({ ...data, events: updated });
                      }}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        color: "#ef4444",
                        borderRadius: "6px",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Dual Photo Input for Event Banner */}
                  <PhotoInputControl
                    label="Event Card Background Banner Photo"
                    value={ev.image || ""}
                    onChange={(val) => {
                      const updated = [...data.events];
                      updated[idx].image = val;
                      setData({ ...data, events: updated });
                    }}
                    category="events"
                    subtext="Card background image rendered across the kiosk timeline ribbon."
                    previewShape="banner"
                    isUploading={uploadingField?.startsWith("events")}
                    onUploadFile={handleFileUpload}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 7: ACHIEVEMENTS & WALL OF FAME (With Dynamic Trophy Photo)
           ========================================================================= */}
        {activeTab === "achievements" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0e2a47" }}>
                  Wall of Fame &amp; Accolades
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Record trophies, medals, inter-school victories, and student distinctions with winner photos.
                </p>
              </div>

              <button
                onClick={() => {
                  const newAch: CampusAchievement = {
                    id: `ach_${Date.now()}`,
                    title: "State Level Competition",
                    badge: "★ 1st Rank",
                    rank: "1st Rank",
                    category: "State Level",
                    date: "Oct 2026",
                    image: "/achievement_science.jpg",
                    description: "Student Team • 1st Prize Winner",
                  };
                  setData({ ...data, achievements: [...data.achievements, newAch] });
                }}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Add Achievement
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {data.achievements.map((ach, idx) => (
                <div
                  key={ach.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #fed7aa",
                    borderRadius: "14px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <PhotoInputControl
                    label={`Award / Winner Photo (${ach.title})`}
                    value={ach.image || ""}
                    onChange={(val) => {
                      const updated = [...data.achievements];
                      updated[idx].image = val;
                      setData({ ...data, achievements: updated });
                    }}
                    category="achievements"
                    subtext="Displayed on the Hall of Fame card and honors spotlight carousel."
                    previewShape="square"
                    isUploading={uploadingField?.startsWith("achievements")}
                    onUploadFile={handleFileUpload}
                  />

                  <input
                    type="text"
                    value={ach.title}
                    placeholder="Competition Title"
                    onChange={(e) => {
                      const updated = [...data.achievements];
                      updated[idx].title = e.target.value;
                      setData({ ...data, achievements: updated });
                    }}
                    style={{ padding: "0.4rem 0.7rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", fontWeight: 800 }}
                  />

                  <input
                    type="text"
                    value={ach.description || ""}
                    placeholder="Winner / Student Name & Award (e.g. Aarav Sharma • 100/100)"
                    onChange={(e) => {
                      const updated = [...data.achievements];
                      updated[idx].description = e.target.value;
                      setData({ ...data, achievements: updated });
                    }}
                    style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <input
                      type="text"
                      value={ach.badge}
                      placeholder="Badge e.g. ★ 1st Rank"
                      onChange={(e) => {
                        const updated = [...data.achievements];
                        updated[idx].badge = e.target.value;
                        setData({ ...data, achievements: updated });
                      }}
                      style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                    />
                    <input
                      type="text"
                      value={ach.category}
                      placeholder="Category e.g. STEM / Sports"
                      onChange={(e) => {
                        const updated = [...data.achievements];
                        updated[idx].category = e.target.value;
                        setData({ ...data, achievements: updated });
                      }}
                      style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <input
                      type="text"
                      value={ach.date}
                      placeholder="Date (e.g. Aug 2026)"
                      onChange={(e) => {
                        const updated = [...data.achievements];
                        updated[idx].date = e.target.value;
                        setData({ ...data, achievements: updated });
                      }}
                      style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem", width: "140px" }}
                    />

                    <button
                      onClick={() => {
                        const updated = data.achievements.filter((_, i) => i !== idx);
                        setData({ ...data, achievements: updated });
                      }}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        color: "#ef4444",
                        borderRadius: "6px",
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 8: CAMPUS TELEMETRY & STATS
           ========================================================================= */}
        {activeTab === "stats" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0e2a47" }}>
              Campus Telemetry &amp; Quick Statistics
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
              Displayed on hero distinction pills and bottom telemetry ribbons.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Enrolled Students Count
                </label>
                <input
                  type="text"
                  value={data.quickStats?.studentsCount || ""}
                  onChange={(e) => setData({ ...data, quickStats: { ...(data.quickStats || { studentsCount: "", facultyCount: "", busCount: "", labsCount: "", campusArea: "" }), studentsCount: e.target.value } })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Faculty Members Count
                </label>
                <input
                  type="text"
                  value={data.quickStats?.facultyCount || ""}
                  onChange={(e) => setData({ ...data, quickStats: { ...(data.quickStats || { studentsCount: "", facultyCount: "", busCount: "", labsCount: "", campusArea: "" }), facultyCount: e.target.value } })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  GPS Smart Buses Fleet
                </label>
                <input
                  type="text"
                  value={data.quickStats?.busCount || ""}
                  onChange={(e) => setData({ ...data, quickStats: { ...(data.quickStats || { studentsCount: "", facultyCount: "", busCount: "", labsCount: "", campusArea: "" }), busCount: e.target.value } })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Advanced STEM Laboratories
                </label>
                <input
                  type="text"
                  value={data.quickStats?.labsCount || ""}
                  onChange={(e) => setData({ ...data, quickStats: { ...(data.quickStats || { studentsCount: "", facultyCount: "", busCount: "", labsCount: "", campusArea: "" }), labsCount: e.target.value } })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Campus Area (Acres)
                </label>
                <input
                  type="text"
                  value={data.quickStats?.campusArea || ""}
                  onChange={(e) => setData({ ...data, quickStats: { ...(data.quickStats || { studentsCount: "", facultyCount: "", busCount: "", labsCount: "", campusArea: "" }), campusArea: e.target.value } })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CMS NATURAL SCROLL-CONTAINED STATUS FOOTER */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.85rem 1.25rem",
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          fontSize: "0.74rem",
          color: "#64748b",
          marginTop: "0.25rem",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a" }} />
          <span><b>Campus Portal CMS</b> • Active .env &amp; Kiosk Storage Synchronization</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span>Institutional Code: <b>{data.branding?.shortCode || "MVPS"}</b></span>
          <span>Safe &amp; Encrypted Kiosk Management</span>
        </div>
      </footer>

      {/* LIVE PREVIEW MODAL (Defaults directly to Responsive Full Live) */}
      {isPreviewOpen && (
        <KioskLivePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          draftData={data}
          onPublish={handlePublish}
          isPublishing={isSaving}
        />
      )}
    </div>
  );
}
