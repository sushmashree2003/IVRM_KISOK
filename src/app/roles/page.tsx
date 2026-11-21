"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RoleType } from "@/components/LoginScreen";
import { getInstituteName } from "@/lib/session";
import AdminExitFullscreenModal from "@/components/common/AdminExitFullscreenModal";

const RoleSelectionScreen = dynamic(() => import("@/components/RoleSelectionScreen"), {
  ssr: false,
});

export default function RolesPage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    document.title = `Role Selection Portal | ${getInstituteName()}`;

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // If currently in fullscreen (or in Electron kiosk mode), exiting or minimizing requires Admin Password
    const isCurrentlyFs = isFullscreen || !!document.fullscreenElement || (typeof window !== "undefined" && !!(window as any).kioskNative?.isKioskApp);

    if (isCurrentlyFs) {
      setIsAdminModalOpen(true);
      return;
    }

    if (typeof window !== "undefined" && (window as any).kioskNative?.toggleFullscreen) {
      (window as any).kioskNative.toggleFullscreen().then((isFs: boolean) => {
        setIsFullscreen(isFs);
      }).catch(() => {});
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    }
  };

  const handleSelectRole = (role: RoleType) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <>
      <RoleSelectionScreen
        onSelectRole={handleSelectRole}
        onBackToPortal={() => router.push("/dashboard")}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
      <AdminExitFullscreenModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsFullscreen(false)}
      />
    </>
  );
}
