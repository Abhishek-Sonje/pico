"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto size-10 text-danger" />
        <h1 className="mt-5 text-2xl font-semibold">
          Pico couldn&apos;t load the dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The saved data is temporarily unavailable. Nothing was deleted; try
          loading it again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
