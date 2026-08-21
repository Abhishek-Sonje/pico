"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Check, DatabaseZap } from "lucide-react";

const sources = ["Product Hunt", "YC Companies", "YC Jobs"];

export function IsometricSignalPipeline() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-pipeline-card]",
        { opacity: 0.7, y: 10 },
        {
          opacity: 1,
          y: -4,
          duration: 2.4,
          stagger: 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
      );
    },
    { scope: root },
  );
  return (
    <div
      ref={root}
      className="iso-stage relative min-h-[440px] overflow-hidden"
      aria-label="Public sources flow through validation into a scored opportunity"
    >
      <div className="iso-plane absolute inset-x-[8%] top-24 h-72 border border-border bg-surface-muted/70" />
      <div className="absolute left-[2%] top-20 z-10 grid gap-3 sm:left-[6%]">
        {sources.map((source) => (
          <div
            data-pipeline-card
            key={source}
            className="iso-card w-40 border border-border bg-card p-3 text-[11px] font-medium"
          >
            <span className="mb-2 block size-1.5 bg-primary" />
            {source}
          </div>
        ))}
      </div>
      <div className="signal-line absolute left-[29%] top-[48%] h-px w-[25%]" />
      <div
        data-pipeline-card
        className="iso-card absolute left-[37%] top-[34%] z-20 w-48 border border-accent bg-accent p-5 text-accent-foreground"
      >
        <DatabaseZap className="size-5" />
        <p className="mt-6 font-semibold">Bright Data Collector</p>
        <p className="mt-1 font-mono text-[10px] opacity-70">
          collector c_72f4
        </p>
        <div className="mt-5 h-1 bg-accent-foreground/20">
          <div className="h-full w-4/5 bg-primary" />
        </div>
      </div>
      <div className="signal-line absolute left-[57%] top-[48%] h-px w-[21%]" />
      <div
        data-pipeline-card
        className="iso-card absolute right-[3%] top-[23%] z-30 w-52 border border-border bg-card p-4 sm:right-[5%]"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">Orbit AI</span>
          <span className="bg-primary px-2 py-1 font-mono text-xs font-bold">
            91
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">Backend Engineer · Remote</p>
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-3 text-[10px] text-success">
          <Check className="size-3" /> Apply link verified{" "}
          <ArrowRight className="ml-auto size-3" />
        </div>
      </div>
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-muted">
        COLLECT → VALIDATE → NORMALIZE → SCORE
      </p>
    </div>
  );
}
