import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardData } from "@/server/queries/startups";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Search and compare scored public startup opportunities.",
};
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardShell initialData={data} />;
}
