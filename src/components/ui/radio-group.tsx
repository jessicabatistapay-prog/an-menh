"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />;
}

/** Lựa chọn dạng "chip" có nhãn bên trong, dễ bấm trên điện thoại. */
function RadioChip({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "flex min-h-11 items-center justify-center rounded-lg border border-input bg-[#101a2e] px-3 py-2 text-sm text-foreground transition-colors",
        "hover:border-[#d9c38f80] data-[state=checked]:border-primary data-[state=checked]:bg-[#d9c38f1f] data-[state=checked]:text-[#f3e4bd]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioChip };
