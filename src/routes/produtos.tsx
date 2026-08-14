import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORIES,
  type CategoryId,
  PRODUCTS,
  productsByCategory,
} from "@/lib/products";
import { formatBRL } from "@/lib/utils";

type Search = { cat?: CategoryId | "todos" };

export const Route = createFileRoute("/produtos")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: (typeof s.cat === "string" ? s.cat : "todos") as Search["cat"],
  }),
  component: Catalog,
});

function Catalog() {
  const { cat } = Route.useSearch();
  const [active, setActive] = useState<CategoryId | "todos">(cat ?? "todos");
  const list = productsByCategory(active);

  return (
    <SiteShell>
      <div className="px-4 pt-12 pb-20 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Catálogo
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
          Peças prontas para a sua arte
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Preços a partir de 10 unidades. A cor e a aplicação se resolvem no estúdio
          ou no orçamento.
        </p>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          <FilterChip
            label="Tudo"
            on={active === "todos"}
            onClick={() => setActive("todos")}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              on={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.id}
              to="/produtos/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-xl border border-line bg-canvas"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {p.customizable && (
                  <Badge className="absolute top-3 left-3 bg-canvas/90 text-ink">
                    Personalizável
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-medium">{p.name}</h2>
                  <p className="text-sm text-ink-soft">{formatBRL(p.priceFrom)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{p.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-16 text-center text-muted">Nenhuma peça nesta linha.</p>
        )}
      </div>
    </SiteShell>
  );
}

function FilterChip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
        on ? "border-forest bg-forest text-cream" : "border-line bg-canvas text-ink-soft"
      }`}
    >
      {label}
    </button>
  );
}
