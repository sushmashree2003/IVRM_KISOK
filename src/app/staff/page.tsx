"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const StaffDashboard = dynamic(() => import("@/components/StaffDashboard"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fffcf9",
        color: "#0c3558",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 700,
      }}
    >
      Loading Staff Portal...
    </div>
  ),
});

export default function StaffPage() {
  const router = useRouter();
  return <StaffDashboard onBackToKiosk={() => router.push("/roles")} />;
}
