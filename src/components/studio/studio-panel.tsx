import { ImagePlus, Images, Trash2, Type, Upload } from "lucide-react";
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
import { prepareArtwork, readImageFile } from "@/lib/remove-bg";
import { useStudio } from "@/lib/studio-store";
import { SITE, waLink } from "@/lib/site";
import { formatBRL } from "@/lib/utils";
import { saveQuote } from "@/lib/painel";

export function StudioPanel() {
  const garmentId = useStudio((s) => s.garmentId);
  const color = useStudio((s) => s.color);
  const side = useStudio((s) => s.side);
  const technique = useStudio((s) => s.technique);
  const layers = useStudio((s) => s.layers);
  const selectedId = useStudio((s) => s.selectedId);
  const sizes = useStudio((s) => s.sizes);
  const company = useStudio((s) => s.company);
  const notes = useStudio((s) => s.notes);
  const artwork = useStudio((s) => s.artwork);
  const placements = useStudio((s) => s.placements);
  const selected = layers.find((l) => l.id === selectedId);
  const garment = getGarment(garmentId);
  const qty = totalPieces(sizes);
  const estimate = estimateTotal(garment.priceFrom, Math.max(qty, SITE.minPieces), technique);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [keepBg, setKeepBg] = useState(false);

  async function applyFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const raw = await readImageFile(file);
      const prepared = await prepareArtwork(raw, keepBg);
      useStudio.getState().setArtwork({
        src: prepared.src,
        name: file.name,
        removedBg: prepared.removedBg,
        alreadyTransparent: prepared.alreadyTransparent,
      });
      if (prepared.removedBg) toast.success("Fundo removido. A arte ficou só com a marca.");
      else if (prepared.alreadyTransparent) toast.success("Arte com fundo transparente, pronta na peça.");
      else toast.success("Arte aplicada na peça.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível usar esse arquivo.");
    } finally {
      setBusy(false);
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
    void saveQuote({
      data: {
        name: company || "Estúdio",
        company,
        peca: garment.name,
        color: colorName,
        technique: tech,
        qty,
        notes: [spots, notes].filter(Boolean).join(" · "),
      },
    }).catch(() => undefined);
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

      <section>
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">Lado</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => useStudio.getState().setSide(s)}
              className={`rounded-md border px-3 py-2 text-sm ${
                side === s
                  ? "border-forest bg-forest text-cream"
                  : "border-line bg-canvas hover:border-line-strong"
              }`}
            >
              {s === "front" ? "Frente" : "Costas"}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">Técnica</p>
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

      <section className="flex flex-col gap-2">
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">Arte</p>
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
          className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-3 py-5 text-center ${
            dragOver ? "border-forest bg-paper-deep" : "border-line-strong bg-canvas"
          }`}
        >
          <Upload className="size-5 text-moss" />
          <span className="mt-2 text-sm font-medium">
            {busy ? "Removendo o fundo…" : "Solte o logo ou a arte"}
          </span>
          <span className="mt-1 text-xs text-muted">
            O sistema tira o fundo branco sozinho, se precisar.
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              void applyFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={keepBg}
            onChange={(e) => setKeepBg(e.target.checked)}
          />
          Manter fundo original
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => useStudio.getState().addText()}>
            <Type /> Texto
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => inputRef.current?.click()}>
            <ImagePlus /> Imagem
          </Button>
        </div>
        {artwork && (
          <div className="flex items-center gap-3 rounded-md border border-line bg-canvas p-2">
            <img
              src={artwork.src}
              alt=""
              className="size-12 rounded-sm object-contain"
              style={{ background: "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 8px 8px" }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{artwork.name}</p>
              <p className="text-xs text-moss">
                {artwork.removedBg
                  ? "Fundo removido"
                  : artwork.alreadyTransparent
                    ? "Já vinha sem fundo"
                    : "Aplicada na peça"}
              </p>
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
        <p className="text-xs text-muted">
          Arraste no tecido, role o mouse para escalar. A área pontilhada é o campo de impressão.
        </p>
      </section>

      <section>
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted uppercase">
          Locais da arte
        </p>
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
      </section>

      {selected?.type === "text" && (
        <section className="rounded-lg border border-line bg-canvas p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Texto selecionado</p>
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
          <Label className="mt-4 block">Tamanho</Label>
          <Slider
            className="mt-2"
            min={0.4}
            max={2.6}
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

      {selected?.type === "image" && (
        <section className="rounded-lg border border-line bg-canvas p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Imagem selecionada</p>
            <button
              type="button"
              className="text-muted hover:text-danger"
              onClick={() => useStudio.getState().removeLayer(selected.id)}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
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
          Valor de referência para {Math.max(qty, SITE.minPieces)} peças em {garment.name}. O
          orçamento final confirma arte e tecido.
        </p>
        <Button
          className="mt-4 w-full"
          size="lg"
          variant="secondary"
          disabled={!layers.length}
          onClick={() => useStudio.getState().setPreviewOpen(true)}
        >
          <Images /> Gerar visualização da peça
        </Button>
        <Button className="mt-2 w-full" size="lg" onClick={sendQuote}>
          Pedir orçamento no WhatsApp
        </Button>
      </div>
    </div>
  );
}
