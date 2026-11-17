"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const VisitorDashboard = dynamic(() => import("@/components/VisitorDashboard"), {
  ssr: false,
});

export default function VisitorPage() {
  const router = useRouter();
  return <VisitorDashboard onBackToKiosk={() => router.push("/roles")} />;
}
