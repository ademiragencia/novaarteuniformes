import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/sobre")({ component: Sobre });

function Sobre() {
  return (
    <SiteShell>
      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-16 sm:px-10 lg:py-24">
          <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
            A casa
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Uma camiseteria de Betim que veste o Brasil — e um pouco além.
          </h1>
          <p className="mt-6 max-w-md text-ink-soft">
            A Nova Arte nasceu da mesa de corte. Silk, bordado, DTF e sublimação
            no mesmo pátio. Fazemos a polo da loja da esquina e o lote que embarca
            para os Estados Unidos, Canadá, Portugal e França.
          </p>
        </div>
        <img
          src="/images/hero-atelier.jpg"
          alt="Ateliê da Nova Arte"
          className="h-80 w-full object-cover lg:h-full"
        />
      </section>

      <section className="grid gap-px bg-line sm:grid-cols-3">
        {[
          [SITE.city, "Produção e atendimento no mesmo endereço."],
          [`${SITE.minPieces} peças`, "O mínimo que faz o setup valer a pena."],
          ["4 técnicas", "A arte escolhe o caminho, não o contrário."],
        ].map(([t, d]) => (
          <div key={t} className="bg-paper px-6 py-10">
            <p className="font-display text-2xl">{t}</p>
            <p className="mt-2 text-sm text-muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="grid items-center gap-10 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
        <img
          src="/images/tech-embroidery.jpg"
          alt="Agulha de bordado na malha"
          className="rounded-xl object-cover"
        />
        <div>
          <h2 className="font-display text-3xl tracking-tight">Oficina, não vitrine.</h2>
          <p className="mt-4 text-ink-soft">
            Cada pedido passa por arte, tecido e prova. Não empurramos técnica
            errada: silk não é DTF, bordado não é sublimação. O cliente vê a peça
            no estúdio, a produção confirma, a máquina trabalha.
          </p>
          <p className="mt-4 text-ink-soft">
            Se você já nos segue no Instagram como{" "}
            <a href={SITE.instagramUrl} className="underline underline-offset-4">
              @{SITE.instagram}
            </a>
            , este site é a mesma casa — com um lugar para montar a camiseta
            antes de chamar no WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/estudio">Abrir o estúdio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contato">Falar com a gente</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
