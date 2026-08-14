import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/empresas")({ component: Empresas });

function Empresas() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    qty: "30",
    need: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      "Olá, Nova Arte — orçamento para empresa.",
      `Nome: ${form.name}`,
      `Empresa: ${form.company}`,
      `Volume: ${form.qty} peças`,
      form.need ? `Preciso: ${form.need}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <SiteShell>
      <section className="grid lg:grid-cols-2">
        <img
          src="/images/team-polos.jpg"
          alt="Equipe com polos iguais"
          className="h-72 w-full object-cover lg:h-full"
        />
        <div className="flex flex-col justify-center px-4 py-16 sm:px-10">
          <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
            Empresas
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Uma arte, todas as funções.
          </h1>
          <p className="mt-5 max-w-md text-ink-soft">
            Padronizamos a identidade da casa: recepção de polo, operação de brim,
            entrega de dry fit, cozinha de avental. A marca fica no mesmo lugar,
            no mesmo tamanho, o ano inteiro.
          </p>
        </div>
      </section>

      <section className="grid gap-px bg-line sm:grid-cols-3">
        {[
          ["Frota e loja", "Polo e camisa operacional com bordado no peito."],
          ["Evento e time", "Dry fit, camiseta e moletom com a arte da temporada."],
          ["Reposição", "Guardamos a tela e o arquivo. A grade volta sem redesenhar."],
        ].map(([t, d]) => (
          <div key={t} className="bg-paper px-6 py-10 sm:px-10">
            <h2 className="font-display text-2xl">{t}</h2>
            <p className="mt-2 text-sm text-muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="px-4 py-16 sm:px-8 lg:px-12">
        <h2 className="font-display text-3xl tracking-tight">Volume</h2>
        <p className="mt-2 max-w-lg text-ink-soft">
          Quanto maior a grade, melhor o custo por peça. Guardamos tela e arquivo
          para a reposição.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            ["10–19", "Tabela"],
            ["20–49", "Melhor custo"],
            ["50–99", "Desconto"],
            ["100+", "Condição de empresa"],
          ].map(([q, n]) => (
            <div key={q} className="rounded-xl border border-line bg-canvas p-5">
              <p className="font-display text-2xl">{q}</p>
              <p className="mt-1 text-sm text-muted">{n}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Fale com o comercial</h2>
          <p className="mt-3 max-w-md text-ink-soft">
            Conta o volume e o uso. Respondemos no WhatsApp {SITE.phoneDisplay} com
            prazo e tecido.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/estudio">Ou monte uma peça no estúdio</Link>
          </Button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-line bg-canvas p-6">
          <div>
            <Label htmlFor="name">Seu nome</Label>
            <Input
              id="name"
              className="mt-1.5"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              className="mt-1.5"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="qty">Volume estimado</Label>
            <Input
              id="qty"
              className="mt-1.5"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="need">O que precisa vestir</Label>
            <Textarea
              id="need"
              className="mt-1.5"
              value={form.need}
              onChange={(e) => setForm({ ...form, need: e.target.value })}
              placeholder="Polos da loja, camisa da obra, moletom de inverno…"
            />
          </div>
          <Button type="submit" size="lg">
            Enviar no WhatsApp
          </Button>
        </form>
      </section>
    </SiteShell>
  );
}
