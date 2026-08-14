import { ImagePlus, Trash2, Type, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { TextLayer } from "@/lib/studio";
import {
  GARMENTS,
  GARMENT_COLORS,
  PLACEMENTS,
  SIZE_KEYS,
  STUDIO_FONTS,
  TECHNIQUES,
  TEXT_COLORS,
  estimateTotal,
  getGarment,
  totalPieces,
} from "@/lib/studio";
import { useStudio } from "@/lib/studio-store";
import { SITE, waLink } from "@/lib/site";
import { formatBRL } from "@/lib/utils";

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Envie PNG, JPG ou SVG."));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("Arquivo acima de 8 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Não foi possível ler o arquivo."));
    };
    reader.onerror = () => reject(new Error("Falha na leitura."));
    reader.readAsDataURL(file);
  });
}

export function StudioPanel() {
  const garmentId = useStudio((s) => s.garmentId);
  const color = useStudio((s) => s.color);
  const technique = useStudio((s) => s.technique);
  const layers = useStudio((s) => s.layers);
  const selectedId = useStudio((s) => s.selectedId);
  const sizes = useStudio((s) => s.sizes);
  const company = useStudio((s) => s.company);
  const notes = useStudio((s) => s.notes);
  const artwork = useStudio((s) => s.artwork);
  const placements = useStudio((s) => s.placements);
  const step = useStudio((s) => s.step);
  const selected = layers.find((l) => l.id === selectedId);
  const garment = getGarment(garmentId);
  const qty = totalPieces(sizes);
  const estimate = estimateTotal(garment.priceFrom, Math.max(qty, SITE.minPieces), technique);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function applyFile(file: File | undefined) {
    if (!file) return;
    try {
      const src = await readFile(file);
      useStudio.getState().setArtwork({ src, name: file.name });
      toast.success("Arte carregada. Escolha os locais na peça.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível usar esse arquivo.");
    }
  }

  function sendQuote() {
    if (qty < SITE.minPieces) {
      toast.error(`Pedido mínimo de ${SITE.minPieces} peças.`);
      return;
    }
    const colorName = GARMENT_COLORS.find((c) => c.hex === color)?.name ?? color;
    const tech = TECHNIQUES.find((t) => t.id === technique)?.label;
    const grade = SIZE_KEYS.filter((k) => sizes[k] > 0)
      .map((k) => `${k}: ${sizes[k]}`)
      .join(", ");
    const spots = placements
      .map((id) => PLACEMENTS.find((p) => p.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const text = [
      `Olá, Nova Arte! Quero orçamento pelo estúdio.`,
      `Peça: ${garment.name}`,
      `Cor: ${colorName}`,
      `Técnica: ${tech}`,
      spots ? `Locais da arte: ${spots}` : "",
      artwork ? `Arquivo: ${artwork.name}` : "",
      `Grade: ${grade} (total ${qty})`,
      company ? `Empresa: ${company}` : "",
      notes ? `Obs: ${notes}` : "",
      `Estimativa no site: ${formatBRL(estimate)}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-7">
      <section>
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">Peça</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {GARMENTS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => useStudio.getState().setGarment(g.id)}
              className={`rounded-md border px-2 py-2.5 text-sm ${
                garmentId === g.id
                  ? "border-forest bg-forest text-cream"
                  : "border-line bg-canvas text-ink hover:border-line-strong"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">Cor</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GARMENT_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              title={c.name}
              aria-label={c.name}
              onClick={() => useStudio.getState().setColor(c.hex)}
              className={`size-8 rounded-full border ${
                color === c.hex ? "ring-2 ring-forest ring-offset-2 ring-offset-paper" : "border-line-strong"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </section>

      {step === 1 && (
        <section>
          <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">
            1 · Sua arte
          </p>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void applyFile(e.dataTransfer.files?.[0]);
            }}
            className={`mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center ${
              dragOver ? "border-forest bg-paper-deep" : "border-line-strong bg-canvas"
            }`}
          >
            <Upload className="size-6 text-moss" />
            <span className="mt-3 text-sm font-medium">Solte o logo ou a arte aqui</span>
            <span className="mt-1 text-xs text-muted">PNG com fundo transparente fica melhor. JPG e SVG também.</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="sr-only"
              onChange={(e) => {
                void applyFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              <ImagePlus /> Escolher arquivo
            </Button>
            <Button variant="ghost" onClick={() => useStudio.getState().addText()}>
              <Type /> Ou escrever um texto
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                useStudio.getState().setArtwork({
                  src: "/images/sample-marca.svg",
                  name: "marca-exemplo.svg",
                })
              }
            >
              Usar marca de exemplo
            </Button>
          </div>
        </section>
      )}

      {step >= 2 && (
        <section>
          <div className="flex items-center justify-between">
            <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">
              2 · Locais da arte
            </p>
            {artwork && (
              <button
                type="button"
                className="text-xs text-muted hover:text-ink"
                onClick={() => inputRef.current?.click()}
              >
                Trocar arquivo
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            onChange={(e) => {
              void applyFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {artwork && (
            <div className="mt-3 flex items-center gap-3 rounded-md border border-line bg-canvas p-2">
              <img src={artwork.src} alt="" className="size-12 rounded-sm object-contain bg-paper-deep" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{artwork.name}</p>
                <p className="text-xs text-muted">Clique nos pontos da peça ou nos locais abaixo</p>
              </div>
              <button
                type="button"
                className="text-muted hover:text-danger"
                onClick={() => useStudio.getState().clearArtwork()}
                aria-label="Remover arte"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
          <div className="mt-3 grid grid-cols-1 gap-2">
            {PLACEMENTS.map((p) => {
              const on = placements.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (!artwork) {
                      toast.error("Envie o logo primeiro.");
                      useStudio.getState().setStep(1);
                      return;
                    }
                    useStudio.getState().togglePlacement(p.id);
                  }}
                  className={`rounded-md border px-3 py-2.5 text-left ${
                    on ? "border-forest bg-forest text-cream" : "border-line bg-canvas hover:border-line-strong"
                  }`}
                >
                  <span className="block text-sm font-medium">{p.label}</span>
                  <span className={`block text-[0.7rem] ${on ? "text-cream/70" : "text-muted"}`}>
                    {p.side === "back" ? "Costas · " : "Frente · "}
                    {p.hint}
                  </span>
                </button>
              );
            })}
          </div>
          {step === 2 && (
            <Button
              className="mt-4 w-full"
              size="lg"
              disabled={!artwork || placements.length === 0}
              onClick={() => useStudio.getState().setStep(3)}
            >
              Gerar visualização da peça
            </Button>
          )}
        </section>
      )}

      {step === 3 && (
        <>
          <section>
            <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">
              Técnica
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {TECHNIQUES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => useStudio.getState().setTechnique(t.id)}
                  className={`rounded-md border px-3 py-2 text-left ${
                    technique === t.id
                      ? "border-forest bg-forest text-cream"
                      : "border-line bg-canvas hover:border-line-strong"
                  }`}
                >
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className={`block text-[0.7rem] ${technique === t.id ? "text-cream/70" : "text-muted"}`}>
                    {t.hint}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">
              Grade · mín. {SITE.minPieces}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SIZE_KEYS.map((k) => (
                <label key={k} className="flex flex-col gap-1">
                  <span className="text-xs text-muted">{k}</span>
                  <Input
                    type="number"
                    min={0}
                    value={sizes[k]}
                    onChange={(e) => useStudio.getState().setSize(k, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              Total {qty} peças
              {qty < SITE.minPieces ? ` · faltam ${SITE.minPieces - qty}` : ""}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <div>
              <Label htmlFor="company">Empresa ou evento</Label>
              <Input
                id="company"
                className="mt-1.5"
                value={company}
                onChange={(e) => useStudio.getState().setCompany(e.target.value)}
                placeholder="Ex.: Padaria Sagrado"
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                className="mt-1.5"
                value={notes}
                onChange={(e) => useStudio.getState().setNotes(e.target.value)}
                placeholder="Prazo, cores da arte, local de entrega…"
              />
            </div>
          </section>

          <div className="rounded-lg border border-line bg-canvas p-4">
            <p className="text-xs tracking-wide text-muted uppercase">Estimativa a partir de</p>
            <p className="font-display text-3xl tracking-tight">{formatBRL(estimate)}</p>
            <p className="mt-1 text-xs text-muted">
              Referência para {Math.max(qty, SITE.minPieces)} peças em {garment.name}.
            </p>
            <Button className="mt-4 w-full" size="lg" onClick={sendQuote}>
              Pedir orçamento no WhatsApp
            </Button>
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => useStudio.getState().setStep(2)}
            >
              Ajustar locais
            </Button>
          </div>
        </>
      )}

      {selected?.type === "text" && step !== 3 && (
        <section className="rounded-lg border border-line bg-canvas p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Texto</p>
            <button
              type="button"
              className="text-muted hover:text-danger"
              onClick={() => useStudio.getState().removeLayer(selected.id)}
              aria-label="Remover"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <Input
            className="mt-3"
            value={(selected as TextLayer).text}
            onChange={(e) => useStudio.getState().updateLayer(selected.id, { text: e.target.value })}
          />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {STUDIO_FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => useStudio.getState().updateLayer(selected.id, { font: f.id })}
                className={`rounded-md border px-2 py-1.5 text-xs ${
                  (selected as TextLayer).font === f.id ? "border-forest bg-paper-deep" : "border-line"
                }`}
                style={{ fontFamily: f.id }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEXT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => useStudio.getState().updateLayer(selected.id, { fill: c })}
                className="size-6 rounded-full border border-line-strong"
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </section>
      )}

      {selected?.type === "image" && step === 2 && (
        <section className="rounded-lg border border-line bg-canvas p-4">
          <p className="text-sm font-medium">Ajuste fino</p>
          <p className="mt-1 text-xs text-muted">Arraste na peça ou use os controles.</p>
          <Label className="mt-4 block">Tamanho</Label>
          <Slider
            className="mt-2"
            min={0.35}
            max={2.8}
            step={0.05}
            value={[selected.scale]}
            onValueChange={([v]) => useStudio.getState().updateLayer(selected.id, { scale: v ?? 1 })}
          />
          <Label className="mt-4 block">Rotação</Label>
          <Slider
            className="mt-2"
            min={-40}
            max={40}
            step={1}
            value={[selected.rotation]}
            onValueChange={([v]) =>
              useStudio.getState().updateLayer(selected.id, { rotation: v ?? 0 })
            }
          />
        </section>
      )}
    </div>
  );
}
