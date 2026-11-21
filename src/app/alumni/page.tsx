"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const AlumniDashboard = dynamic(() => import("@/components/AlumniDashboard"), {
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
      Loading Alumni Portal...
    </div>
  ),
});

export default function AlumniPage() {
  const router = useRouter();
  return <AlumniDashboard onBackToKiosk={() => router.push("/roles")} />;
}
