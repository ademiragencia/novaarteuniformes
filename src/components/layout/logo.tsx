import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link to="/" className={cn("inline-flex items-center no-underline", className)}>
      <span
        className={cn(
          "inline-flex items-center",
          invert && "rounded-md bg-canvas px-2.5 py-1.5",
        )}
      >
        <img
          src="/brand/logo-header.png"
          alt="Nova Arte — Camiseteria e Uniformes"
          className={cn("w-auto", invert ? "h-12 sm:h-14" : "h-11 sm:h-14")}
        />
      </span>
    </Link>
  );
}
