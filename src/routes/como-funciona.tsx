import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { LEAD_TIMES, PROCESS, VOLUME_TIERS } from "@/lib/content";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/como-funciona")({
  component: ComoFunciona,
});

function ComoFunciona() {
  return (
    <SiteShell>
      <div className="px-4 pt-12 pb-20 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Como funciona
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
          Do logo à peça na mão da equipe.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Sem carrinho, sem surpresa. Você monta, a gente confirma, a produção
          costura. Pagamento em duas partes, prazo contado depois da arte
          aprovada.
        </p>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2">
          {PROCESS.map((s) => (
            <li key={s.n} className="rounded-xl border border-line bg-canvas p-6">
              <p className="font-display text-3xl text-moss">{s.n}</p>
              <h2 className="mt-4 font-display text-2xl">{s.title}</h2>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>

        <section className="mt-20 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight">Prazos</h2>
            <p className="mt-2 text-sm text-muted">
              Contados em dias úteis depois da arte e do sinal confirmados. {SITE.lead}.
            </p>
            <table className="mt-6 w-full text-sm">
              <tbody>
                {LEAD_TIMES.map((row) => (
                  <tr key={row.kind} className="border-b border-line">
                    <td className="py-3 pr-4">{row.kind}</td>
                    <td className="py-3 text-right text-ink-soft">{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight">Volume e pagamento</h2>
            <p className="mt-2 text-sm text-muted">{SITE.payment}.</p>
            <table className="mt-6 w-full text-sm">
              <tbody>
                {VOLUME_TIERS.map((row) => (
                  <tr key={row.qty} className="border-b border-line">
                    <td className="py-3 pr-4">{row.qty} peças</td>
                    <td className="py-3 text-right text-ink-soft">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 text-sm text-ink-soft">
              Envio para todo o Brasil. Retirada em Betim sem frete. Clientes no
              exterior fecham o lote aqui e combinam o despacho.
            </p>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/estudio">Abrir o estúdio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contato">Falar no WhatsApp</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
