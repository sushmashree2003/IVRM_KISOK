"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const AlumniDashboard = dynamic(() => import("@/components/AlumniDashboard"), {
  ssr: false,
});

export default function AlumniPage() {
  const router = useRouter();
  return <AlumniDashboard onBackToKiosk={() => router.push("/roles")} />;
}
