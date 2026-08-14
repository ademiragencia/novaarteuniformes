import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "border-transparent bg-forest text-cream",
        outline: "border-line-strong text-ink-soft",
        muted: "border-transparent bg-paper-deep text-ink-soft",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
