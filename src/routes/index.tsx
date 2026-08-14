import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Scissors, Shirt, Stamp } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROCESS, TESTIMONIALS, WORKS } from "@/lib/content";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";
import { formatBRL } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

const FAQS = [
  {
    q: "Qual o pedido mínimo?",
    a: "Dez peças. Vale para uma cor e um modelo. Grades maiores e mix de cores entram no orçamento.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Pedidos simples de silk ou DTF saem em cerca de 7 a 12 dias úteis depois da arte aprovada. Bordado e sublimação total dependem da fila — confirmamos no WhatsApp.",
  },
  {
    q: "Posso mandar minha arte?",
    a: "Sim. Suba o arquivo no estúdio ou envie em PDF, PNG ou AI. O fundo branco a gente tira. Se ainda não tem marca, desenhamos a aplicação com você.",
  },
  {
    q: "Qual técnica escolher?",
    a: "Silk para volume e 1–4 cores. DTF para foto e degradê. Bordado para polo e uniforme de presença. Sublimação para dry fit e peça inteira.",
  },
  {
    q: "Como pago e como chega?",
    a: "Pix ou transferência: 50% para iniciar, 50% na retirada ou no envio. Retira em Betim ou mandamos para o Brasil. Exterior combina o despacho no orçamento.",
  },
  {
    q: "Dá para personalizar uma peça só?",
    a: "O mínimo é 10. Abaixo disso o setup de tela, filme e máquina não fecha. Se for amostra, conversamos.",
  },
];

function Home() {
  const featured = PRODUCTS.filter((p) =>
    ["camiseta-cotton", "polo-piquet", "moletom-canguru", "dry-fit", "camiseta-time", "bone-logo"].includes(
      p.id,
    ),
  );

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="grid min-h-[78vh] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
            <p className="text-[0.72rem] font-medium tracking-[0.22em] text-moss uppercase">
              Betim · desde o ateliê
            </p>
            <h1 className="mt-4 max-w-xl font-display text-[2.6rem] leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              A marca da sua equipe, costurada com precisão.
            </h1>
            <p className="mt-6 max-w-md text-base text-ink-soft sm:text-lg">
              Uniformes e camisetas com silk, DTF, bordado e sublimação. Você monta a peça
              no estúdio, vê como fica, e a gente produz a partir de {SITE.minPieces} unidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/estudio">
                  Abrir o estúdio <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/produtos">Ver o catálogo</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">Mínimo</dt>
                <dd className="mt-1 font-display text-2xl">{SITE.minPieces} pç</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">Prazo</dt>
                <dd className="mt-1 font-display text-2xl">7–12 d</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">Pagamento</dt>
                <dd className="mt-1 font-display text-2xl">Pix</dd>
              </div>
            </dl>
          </div>
          <div className="relative min-h-[42vh] lg:min-h-full">
            <img
              src="/images/hero-atelier.jpg"
              alt="Ateliê da Nova Arte com máquina de costura e malhas"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-canvas">
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {[
            ["Silk", "Telas e tinta que aguentam lavação"],
            ["DTF", "Foto, degradê, cor cheia"],
            ["Bordado", "Relevo no peito da polo"],
            ["Sublimação", "Dry fit de ponta a ponta"],
          ].map(([t, d]) => (
            <div key={t} className="bg-canvas px-5 py-6 sm:px-8">
              <p className="font-display text-xl">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
              Catálogo
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Peças que vestem marca</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/produtos">
              Ver todas <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/produtos/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-xl border border-line bg-canvas"
            >
              <div className="aspect-[4/5] overflow-hidden bg-paper-deep">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{p.blurb}</p>
                </div>
                <p className="shrink-0 text-sm text-ink-soft">{formatBRL(p.priceFrom)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ cat: c.id }}
              className="rounded-full border border-line bg-canvas px-4 py-2 text-sm text-ink-soft hover:border-line-strong hover:text-ink"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-forest-deep px-4 py-20 text-cream sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[0.72rem] font-medium tracking-[0.2em] text-cream/55 uppercase">
              Estúdio
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Veja a arte na peça antes de produzir.
            </h2>
            <p className="mt-5 max-w-md text-cream/75">
              Escolha o modelo, pinte a malha, escreva o nome da casa ou suba o logo.
              O fundo sai sozinho. Quando estiver certo, o orçamento vai pronto no WhatsApp.
            </p>
            <Button asChild size="lg" variant="cream" className="mt-8">
              <Link to="/estudio">
                Personalizar agora <Shirt />
              </Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl">
            <img
              src="/images/polos-stack.jpg"
              alt="Pilha de polos em várias cores"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
              Como trabalhamos
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Quatro passos, sem surpresa</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/como-funciona">
              Prazos e pagamento <ArrowRight />
            </Link>
          </Button>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s) => (
            <li key={s.n} className="rounded-xl border border-line bg-canvas p-5">
              <p className="font-display text-3xl text-moss">{s.n}</p>
              <p className="mt-4 font-medium">{s.title}</p>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid lg:grid-cols-2">
        <img
          src="/images/workbench.jpg"
          alt="Bancada de corte com linhas e tesoura"
          className="h-72 w-full object-cover lg:h-full"
        />
        <div className="flex flex-col justify-center bg-paper-deep px-6 py-16 sm:px-12">
          <Badge variant="muted">Empresas</Badge>
          <h2 className="mt-4 font-display text-4xl tracking-tight">
            Uniforme que trabalha pela sua marca.
          </h2>
          <p className="mt-4 max-w-md text-ink-soft">
            Frota, loja, obra, cozinha, clube. Fechamos a identidade da equipe —
            polo, operacional, avental, moletom — com a mesma arte em todas as peças.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Stamp className="size-4 text-forest" /> Aplicação padrão da marca
            </li>
            <li className="flex items-center gap-2">
              <Scissors className="size-4 text-forest" /> Reposição de grade o ano inteiro
            </li>
            <li className="flex items-center gap-2">
              <Shirt className="size-4 text-forest" /> Amostra antes do lote
            </li>
          </ul>
          <Button asChild className="mt-8 w-fit">
            <Link to="/empresas">Falar com o comercial</Link>
          </Button>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
              Trabalhos
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Saiu da casa</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/trabalhos">
              Ver todos <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKS.slice(0, 4).map((w) => (
            <Link
              key={w.src}
              to="/trabalhos"
              className="group overflow-hidden rounded-xl border border-line"
            >
              <img
                src={w.src}
                alt={w.title}
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-canvas px-4 py-20 sm:px-8 lg:px-12">
        <h2 className="font-display text-4xl tracking-tight">Quem veste, volta.</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rounded-xl border border-line bg-paper p-6">
              <p className="text-ink-soft">“{t.quote}”</p>
              <footer className="mt-5 text-sm">
                <p className="font-medium">{t.name}</p>
                <p className="text-muted">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
              Dúvidas
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Perguntas da produção</h2>
          </div>
          <Accordion type="single" collapsible>
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteShell>
  );
}
