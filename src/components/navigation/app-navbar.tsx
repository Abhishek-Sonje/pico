"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, LayoutDashboard, Radar } from "lucide-react";

type NavbarPage = "home" | "dashboard" | "health";

export function AppNavbar({ page }: { page: NavbarPage }) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY.current;
      setVisible(currentScrollY < 80 || scrollingUp);
      lastScrollY.current = currentScrollY;
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-foreground text-background shadow-soft transition-transform duration-200 ease-out motion-reduce:transition-none ${visible ? "translate-y-0" : "-translate-y-full"}`}
      onFocusCapture={() => setVisible(true)}
    >
      <nav
        className="mx-auto flex h-[73px] max-w-[1500px] items-center justify-between px-5 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-9 place-items-center bg-primary text-primary-foreground">
            <Radar className="size-4" />
          </span>
          Pico
        </Link>
        <div className="hidden items-center gap-7 text-sm text-background/65 md:flex">
          {page === "home" ? (
            <>
              <a href="#workflow" className="hover:text-primary">
                Workflow
              </a>
              <a href="#resilience" className="hover:text-primary">
                Resilience
              </a>
              <Link href="/health" className="hover:text-primary">
                Source health
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-primary">
                Product story
              </Link>
              {page !== "dashboard" && (
                <Link href="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
              )}
              {page !== "health" && (
                <Link href="/health" className="hover:text-primary">
                  Source health
                </Link>
              )}
            </>
          )}
        </div>
        {page === "dashboard" ? (
          <Link
            href="/health"
            className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            <Activity className="size-4" /> Health
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Dashboard{" "}
            {page === "home" ? (
              <ArrowRight className="size-4" />
            ) : (
              <LayoutDashboard className="size-4" />
            )}
          </Link>
        )}
      </nav>
    </header>
  );
}
