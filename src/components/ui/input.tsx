import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("h-11 w-full rounded-xl border border-border bg-input px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30", className)} {...props} />; }
