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
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 no-underline",
        invert ? "text-cream" : "text-ink",
        className,
      )}
    >
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r="18.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M12.5 25.2 V16.6 L20 11.4 L27.5 16.6 V25.2 H12.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M17.2 25.2 V20.3 H22.8 V25.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.2rem] tracking-tight">Nova Arte</span>
        <span
          className={cn(
            "mt-0.5 text-[0.62rem] font-medium tracking-[0.22em] uppercase",
            invert ? "text-cream/70" : "text-muted",
          )}
        >
          Uniformes
        </span>
      </span>
    </Link>
  );
}
