import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={cn("h-11 rounded-xl border border-border bg-input px-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30", className)} {...props} />; }
