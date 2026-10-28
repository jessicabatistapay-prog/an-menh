import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border border-input bg-[#101a2e] px-3.5 py-2 text-base text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30 [color-scheme:dark]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
