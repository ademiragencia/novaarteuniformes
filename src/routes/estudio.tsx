import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { StudioApp } from "@/components/studio/studio-app";
import { useStudio } from "@/lib/studio-store";

type Search = { peca?: string; cor?: string };

export const Route = createFileRoute("/estudio")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    peca: typeof s.peca === "string" ? s.peca : undefined,
    cor: typeof s.cor === "string" ? s.cor : undefined,
  }),
  component: Estudio,
});

function Estudio() {
  const { peca, cor } = Route.useSearch();

  useEffect(() => {
    if (peca) useStudio.getState().loadFromProduct(peca, cor);
  }, [peca, cor]);

  return (
    <SiteShell>
      <div className="px-4 pt-10 pb-20 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Estúdio
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
          Monte a peça e veja como fica.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Cor, texto, logo e técnica na hora. Quando a arte estiver certa, o orçamento
          segue no WhatsApp com a grade pronta.
        </p>
        <div className="mt-10">
          <StudioApp />
        </div>
      </div>
    </SiteShell>
  );
}
