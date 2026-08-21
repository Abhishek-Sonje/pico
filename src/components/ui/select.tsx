import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 rounded-md border border-border bg-input px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-ring/15",
        className,
      )}
      {...props}
    />
  );
}
