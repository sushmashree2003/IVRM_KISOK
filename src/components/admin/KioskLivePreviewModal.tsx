"use client";

import React, { useState } from "react";
import { CampusInfoData } from "@/types/campus";
import CampusInfoPortal from "@/components/CampusInfoPortal";
import {
  X,
  Maximize2,
  Smartphone,
  Monitor,
  RotateCcw,
  CheckCircle2,
  Eye,
  Send,
} from "lucide-react";

interface KioskLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftData: CampusInfoData;
  onPublish: () => void;
  isPublishing?: boolean;
}

type DeviceMode = "landscape" | "portrait" | "responsive";

export default function KioskLivePreviewModal({
  isOpen,
  onClose,
  draftData,
  onPublish,
  isPublishing = false,
}: KioskLivePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("responsive");
  const [reloadKey, setReloadKey] = useState(0);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(10, 15, 29, 0.95)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Preview Control Bar */}
      <header
        style={{
          height: "64px",
          background: "linear-gradient(90deg, #0e2a47 0%, #1e3a5f 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          color: "#ffffff",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(234, 88, 12, 0.2)",
              border: "1px solid #ea580c",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
            }}
          >
            <Eye size={15} style={{ color: "#ea580c" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fed7aa", letterSpacing: "0.5px" }}>
              LIVE KIOSK PREVIEW (UNPUBLISHED DRAFT)
            </span>
          </div>

          <span style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)" }}>
            Review your dynamic changes before saving to physical terminals
          </span>
        </div>

        {/* Device Switcher & Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "3px",
              display: "flex",
              gap: "4px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >

            <button
              onClick={() => setDeviceMode("responsive")}
              title="Full Window Responsive View"
              style={{
                background: deviceMode === "responsive" ? "#ea580c" : "transparent",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.35rem 0.7rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Maximize2 size={14} /> Fullscreen
            </button>
          </div>

          <button
            onClick={() => setReloadKey((k) => k + 1)}
            title="Reload Preview Container"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "0.45rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={15} />
          </button>

          {/* Save & Publish Action */}
          <button
            onClick={onPublish}
            disabled={isPublishing}
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              fontSize: "0.82rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: isPublishing ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(22, 163, 74, 0.4)",
              opacity: isPublishing ? 0.7 : 1,
            }}
          >
            <Send size={14} /> {isPublishing ? "Publishing..." : "Save & Publish to Kiosks"}
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            title="Exit Preview"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              cursor: "pointer",
              marginLeft: "0.5rem",
            }}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Preview Stage Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: deviceMode === "responsive" ? "0" : "1.5rem",
          overflow: "auto",
          background: "#0b1329",
        }}
      >
        <div
          key={reloadKey}
          style={{
            width:
              deviceMode === "landscape"
                ? "min(1366px, 96vw)"
                : deviceMode === "portrait"
                  ? "540px"
                  : "100%",
            height:
              deviceMode === "landscape"
                ? "min(768px, calc(100vh - 120px))"
                : deviceMode === "portrait"
                  ? "min(960px, calc(100vh - 120px))"
                  : "100%",
            background: "#081020",
            borderRadius: deviceMode === "responsive" ? "0" : "18px",
            overflow: "hidden",
            boxShadow:
              deviceMode === "responsive"
                ? "none"
                : "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.1)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Virtual Kiosk Bezel Header for Landscape/Portrait */}
          {deviceMode !== "responsive" && (
            <div
              style={{
                height: "22px",
                background: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                fontSize: "0.65rem",
                color: "#64748b",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                userSelect: "none",
              }}
            >
              <span>● KIOSK SIMULATOR (DRAFT)</span>
              <span>100DVH TOUCH BOUNDS</span>
            </div>
          )}

          {/* Actual Live CampusInfoPortal Component Fed by Draft State */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <CampusInfoPortal
              onEnterRoleSelection={() => {
                alert("Role Selection navigation triggered in preview mode.");
              }}
              draftData={draftData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
