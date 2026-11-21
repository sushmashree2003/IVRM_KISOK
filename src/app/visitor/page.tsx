"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const VisitorDashboard = dynamic(() => import("@/components/VisitorDashboard"), {
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
      Loading Visitor Portal...
    </div>
  ),
});

export default function VisitorPage() {
  const router = useRouter();
  return <VisitorDashboard onBackToKiosk={() => router.push("/roles")} />;
}
