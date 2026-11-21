"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const StudentDashboard = dynamic(() => import("@/components/StudentDashboard"), {
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
      Loading Student Portal...
    </div>
  ),
});

export default function StudentPage() {
  const router = useRouter();
  return <StudentDashboard onBackToKiosk={() => router.push("/roles")} />;
}
