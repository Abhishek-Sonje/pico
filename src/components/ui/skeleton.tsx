import { cn } from "@/lib/utils/cn";
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton-shimmer overflow-hidden rounded-lg bg-surface-muted",
        className,
      )}
    />
  );
}
