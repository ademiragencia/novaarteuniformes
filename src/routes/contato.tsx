import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/contato")({ component: Contato });

function Contato() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      "Olá, Nova Arte!",
      `Nome: ${form.name}`,
      form.phone ? `Telefone: ${form.phone}` : "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <SiteShell>
      <div className="grid gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div>
          <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
            Contato
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            A produção responde no WhatsApp.
          </h1>
          <p className="mt-4 max-w-md text-ink-soft">
            Arte, prazo e grade se resolvem em conversa. Se já montou a peça no
            estúdio, manda o print junto.
          </p>
          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-muted">WhatsApp</dt>
              <dd className="mt-1 text-lg">{SITE.phoneDisplay}</dd>
            </div>
            <div>
              <dt className="text-muted">Onde</dt>
              <dd className="mt-1 text-lg">{SITE.city}</dd>
            </div>
            <div>
              <dt className="text-muted">Horário</dt>
              <dd className="mt-1 text-lg">{SITE.hours}</dd>
            </div>
            <div>
              <dt className="text-muted">Pagamento</dt>
              <dd className="mt-1 text-lg">{SITE.payment}</dd>
            </div>
            <div>
              <dt className="text-muted">Prazo</dt>
              <dd className="mt-1 text-lg">{SITE.lead}</dd>
            </div>
            <div>
              <dt className="text-muted">Instagram</dt>
              <dd className="mt-1">
                <a href={SITE.instagramUrl} className="text-lg hover:underline">
                  @{SITE.instagram}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-xl border border-line bg-canvas p-6"
        >
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              className="mt-1.5"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              className="mt-1.5"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              className="mt-1.5"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Quantidade, peça, prazo…"
            />
          </div>
          <Button type="submit" size="lg">
            Abrir conversa
          </Button>
        </form>
      </div>
    </SiteShell>
  );
}
