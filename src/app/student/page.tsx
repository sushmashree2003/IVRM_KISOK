"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const StudentDashboard = dynamic(() => import("@/components/StudentDashboard"), {
  ssr: false,
});

export default function StudentPage() {
  const router = useRouter();
  return <StudentDashboard onBackToKiosk={() => router.push("/roles")} />;
}
