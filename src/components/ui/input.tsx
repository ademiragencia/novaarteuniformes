import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-forest/40 focus:ring-2 focus:ring-forest/20 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
