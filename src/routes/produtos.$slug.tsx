import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/products";
import { TECHNIQUES } from "@/lib/studio";
import { useStudio } from "@/lib/studio-store";
import { formatBRL } from "@/lib/utils";

export const Route = createFileRoute("/produtos/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  if (!product) throw notFound();
  const [photo, setPhoto] = useState(product.image);
  const [color, setColor] = useState(product.colors[0]?.hex);

  return (
    <SiteShell>
      <div className="grid gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-16">
        <div>
          <div className="overflow-hidden rounded-xl border border-line bg-canvas">
            <img src={photo} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setPhoto(src)}
                  className={`overflow-hidden rounded-md border ${
                    photo === src ? "border-forest" : "border-line"
                  }`}
                >
                  <img src={src} alt="" className="size-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
            {product.fabric}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">{product.name}</h1>
          <p className="mt-3 text-lg text-ink-soft">
            A partir de {formatBRL(product.priceFrom)} · 10 peças
          </p>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8">
            <p className="text-sm font-medium">Cor</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => setColor(c.hex)}
                  className={`size-8 rounded-full border ${
                    color === c.hex ? "ring-2 ring-forest ring-offset-2 ring-offset-paper" : "border-line-strong"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">Tamanhos</p>
            <p className="mt-1 text-sm text-muted">{product.sizes.join(" · ")}</p>
            <Link to="/tamanhos" className="mt-2 inline-block text-sm text-forest hover:underline">
              Ver guia de medidas
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.techniques.map((id) => (
              <Badge key={id}>{TECHNIQUES.find((t) => t.id === id)?.label ?? id}</Badge>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {product.customizable && product.garmentId ? (
              <Button asChild size="lg">
                <Link
                  to="/estudio"
                  search={{ peca: product.garmentId, cor: color }}
                  onClick={() =>
                    useStudio.getState().loadFromProduct(product.garmentId!, color)
                  }
                >
                  Personalizar no estúdio
                </Link>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline">
              <Link to="/contato">Pedir orçamento</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
