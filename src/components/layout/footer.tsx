import { Link } from "@tanstack/react-router";
import { FOOTER_MORE, NAV, SITE } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-forest-deep text-cream">
      <div className="grid gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <Logo invert />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
            Uniformes e camisetas personalizadas em Betim. Silk, DTF, bordado e
            sublimação — da peça da equipe ao pedido que cruza fronteira.
          </p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-[0.68rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
            Casa
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-cream/80 hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[0.68rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
            Pedido
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_MORE.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-cream/80 hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[0.68rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
            Fale com a produção
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>{SITE.phoneDisplay}</li>
            <li>{SITE.city}</li>
            <li>{SITE.hours}</li>
            <li>{SITE.payment}</li>
            <li>
              <a
                href={SITE.instagramUrl}
                className="hover:text-cream"
                target="_blank"
                rel="noreferrer"
              >
                @{SITE.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-cream/10 px-4 py-5 text-xs text-cream/45 sm:flex-row sm:justify-between sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} Nova Arte Uniformes & Camiseteria</p>
        <p>Pedido mínimo de {SITE.minPieces} peças · {SITE.lead}</p>
      </div>
    </footer>
  );
}
