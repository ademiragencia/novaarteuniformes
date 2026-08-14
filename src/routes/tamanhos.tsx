import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { SIZE_CHARTS } from "@/lib/content";

export const Route = createFileRoute("/tamanhos")({ component: Tamanhos });

function Tamanhos() {
  return (
    <SiteShell>
      <div className="px-4 pt-12 pb-20 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Guia de tamanhos
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
          Mede a peça que já veste bem e compara.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Números da peça estendida, em centímetros. Se a equipe fica no meio de
          dois tamanhos, oriente o maior — especialmente em uniforme de trabalho.
        </p>

        <div className="mt-14 space-y-14">
          {SIZE_CHARTS.map((chart) => (
            <section key={chart.id}>
              <h2 className="font-display text-2xl">{chart.title}</h2>
              <p className="mt-1 text-sm text-muted">{chart.hint}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left">
                      <th className="py-2 pr-3 font-medium">Medida</th>
                      {chart.cols.map((c) => (
                        <th key={c} className="py-2 px-2 font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row) => (
                      <tr key={row.label} className="border-b border-line">
                        <td className="py-3 pr-3 text-ink-soft">{row.label}</td>
                        {row.values.map((v, i) => (
                          <td key={chart.cols[i]} className="py-3 px-2">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 max-w-xl text-sm text-muted">
          Boné e avental saem em tamanho único. Dúvida na grade? Manda no
          WhatsApp as medidas de uma peça que a equipe já usa.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/contato">Tirar dúvida da grade</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
