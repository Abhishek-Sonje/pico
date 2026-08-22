"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto size-10 text-danger" />
        <h1 className="mt-5 text-3xl font-semibold tracking-[-.03em]">
          Pico lost this signal
        </h1>
        <p className="mt-3 leading-7 text-muted">
          The saved dataset is safe. Retry the request to reconnect this view.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
