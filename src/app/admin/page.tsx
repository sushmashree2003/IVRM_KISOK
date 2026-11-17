"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import AdminPasswordGate from "@/components/admin/AdminPasswordGate";

const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), {
  ssr: false,
});

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if administrator authenticated in the current browser session
    const isAuth = sessionStorage.getItem("kiosk_admin_auth") === "authenticated";
    setIsAuthenticated(isAuth);
  }, []);

  const handleBackToKiosk = () => {
    // Clear admin session token upon returning to public kiosk
    sessionStorage.removeItem("kiosk_admin_auth");
    router.push("/dashboard");
  };

  // Brief initial check to prevent layout flash
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminPasswordGate
        onSuccess={() => setIsAuthenticated(true)}
        onBackToKiosk={() => router.push("/dashboard")}
      />
    );
  }

  return <AdminDashboard onBackToKiosk={handleBackToKiosk} />;
}
