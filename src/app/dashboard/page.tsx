"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CampusInfoPortal = dynamic(() => import("@/components/CampusInfoPortal"), {
  ssr: false,
});

export default function DashboardPage() {
  const router = useRouter();
  return <CampusInfoPortal onEnterRoleSelection={() => router.push("/roles")} />;
}
