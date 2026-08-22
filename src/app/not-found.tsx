import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="max-w-lg text-center">
        <Radar className="mx-auto size-10 text-accent" />
        <h1 className="mt-6 text-4xl font-semibold tracking-[-.035em]">
          This signal is off the radar
        </h1>
        <p className="mt-4 leading-7 text-muted">
          The page may have moved, but the opportunity feed is still live.
        </p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex h-12 items-center gap-2 bg-primary px-5 font-medium text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Return to opportunities
        </Link>
      </div>
    </main>
  );
}
