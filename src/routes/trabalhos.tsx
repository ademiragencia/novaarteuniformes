import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS, WORKS } from "@/lib/content";

export const Route = createFileRoute("/trabalhos")({ component: Trabalhos });

function Trabalhos() {
  return (
    <SiteShell>
      <div className="px-4 pt-12 pb-20 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Trabalhos
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
          O que sai da mesa de corte.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Equipe, time, padaria, obra. A mesma casa, a mesma aplicação — só muda
          a malha.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKS.map((w) => (
            <figure key={w.src} className="overflow-hidden rounded-xl border border-line bg-canvas">
              <img src={w.src} alt={w.title} className="aspect-[4/5] w-full object-cover" />
              <figcaption className="flex items-baseline justify-between gap-3 p-4">
                <span className="font-medium">{w.title}</span>
                <span className="text-xs tracking-wide text-muted uppercase">{w.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="font-display text-3xl tracking-tight">O que as casas falam</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="rounded-xl border border-line bg-canvas p-6">
                <p className="text-ink-soft">“{t.quote}”</p>
                <footer className="mt-5 text-sm">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-muted">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/estudio">Montar a minha peça</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/empresas">Orçamento para empresa</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
