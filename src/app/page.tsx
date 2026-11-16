"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RoleType } from "@/components/LoginScreen";

const RoleSelectionScreen = dynamic(() => import("@/components/RoleSelectionScreen"), {
  ssr: false,
});
const CampusInfoPortal = dynamic(() => import("@/components/CampusInfoPortal"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<"portal" | "roles">("portal");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
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
          currentTime={currentTime}
        />
      )}

      {activePage === "roles" && (
        <RoleSelectionScreen
          onSelectRole={handleSelectRole}
          onBackToPortal={() => setActivePage("portal")}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          currentTime={currentTime}
        />
      )}
    </>
  );
}
