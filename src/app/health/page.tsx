import type { Metadata } from "next";
import { SourceHealthPanel } from "@/components/dashboard/source-health-panel";
import { AppNavbar } from "@/components/navigation/app-navbar";
import { getDashboardData } from "@/server/queries/startups";

export const metadata: Metadata = {
  title: "Source health",
  description: "Review Pico's latest public-source collection outcomes.",
};
export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const data = await getDashboardData();
  return (
    <main className="min-h-screen bg-background">
      <AppNavbar page="health" />
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-.035em] sm:text-5xl">
            Source health
          </h1>
          <p className="mt-4 leading-7 text-muted">
            Latest collection outcomes for Pico’s approved YC Companies
            collector. Warning and failed runs preserve previously successful
            opportunity data.
          </p>
        </div>
        {data.notice && (
          <div className="mt-8 border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            {data.notice}
          </div>
        )}
        <div className="mt-10">
          <SourceHealthPanel health={data.health} />
        </div>
      </div>
    </main>
  );
}
