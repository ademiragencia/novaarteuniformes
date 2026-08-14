import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { NAV, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./logo";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-paper-deep" />;
  }
  if (user) return <UserButton />;
  return (
    <Link
      to="/login"
      className="hidden text-sm text-ink-soft hover:text-ink md:inline"
    >
      Entrar
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 border-b border-line/60 px-4 py-1.5 text-[0.7rem] tracking-wide text-muted sm:px-6 lg:px-10">
        <p className="truncate">
          {SITE.city} · pedido mínimo {SITE.minPieces} peças · {SITE.ships}
        </p>
        <a
          href={`https://wa.me/${SITE.phoneE164}`}
          className="shrink-0 text-ink-soft hover:text-forest"
        >
          WhatsApp {SITE.phoneDisplay}
        </a>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-ink underline underline-offset-[6px]" }}
              className="text-[0.92rem] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <AuthSlot />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/estudio">Personalizar</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <nav className="mt-10 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-3 text-lg text-ink hover:bg-paper-deep"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Button asChild className="mt-6 w-full">
                <Link to="/estudio" onClick={() => setOpen(false)}>
                  Abrir o estúdio
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
