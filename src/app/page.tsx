"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RoleType } from "@/components/LoginScreen";
import AdminExitFullscreenModal from "@/components/common/AdminExitFullscreenModal";

const RoleSelectionScreen = dynamic(() => import("@/components/RoleSelectionScreen"), {
  ssr: false,
});
const CampusInfoPortal = dynamic(() => import("@/components/CampusInfoPortal"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<"portal" | "roles">("portal");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
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
      document.documentElement.requestFullscreen().catch(console.error);
    }
  };

  const handleSelectRole = (role: RoleType) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <>
      {activePage === "portal" && (
        <CampusInfoPortal
          onEnterRoleSelection={() => setActivePage("roles")}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      )}

      {activePage === "roles" && (
        <RoleSelectionScreen
          onSelectRole={handleSelectRole}
          onBackToPortal={() => setActivePage("portal")}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      )}

      <AdminExitFullscreenModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsFullscreen(false)}
      />
    </>
  );
}
