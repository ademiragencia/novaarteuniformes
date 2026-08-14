import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-md border border-line bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-forest/40 focus:ring-2 focus:ring-forest/20 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
