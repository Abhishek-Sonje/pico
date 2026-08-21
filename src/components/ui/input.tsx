import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-input px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/15",
        className,
      )}
      {...props}
    />
  );
}
