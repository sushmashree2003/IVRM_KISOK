"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const StaffDashboard = dynamic(() => import("@/components/StaffDashboard"), {
  ssr: false,
});

export default function StaffPage() {
  const router = useRouter();
  return <StaffDashboard onBackToKiosk={() => router.push("/roles")} />;
}
