import { Download, FileDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GARMENT_COLORS, PLACEMENTS, SIZE_KEYS, TECHNIQUES, estimateTotal, getGarment, totalPieces } from "@/lib/studio";
import { sideToDataUrl } from "@/lib/studio-render";
import { useStudio } from "@/lib/studio-store";
import { buildQuotePdf, downloadBlob } from "@/lib/quote-pdf";
import { SITE, waLink } from "@/lib/site";
import { formatBRL } from "@/lib/utils";

export function StudioPreview() {
  const open = useStudio((s) => s.previewOpen);
  const garmentId = useStudio((s) => s.garmentId);
  const color = useStudio((s) => s.color);
  const layers = useStudio((s) => s.layers);
  const placements = useStudio((s) => s.placements);
  const technique = useStudio((s) => s.technique);
  const sizes = useStudio((s) => s.sizes);
  const company = useStudio((s) => s.company);
  const notes = useStudio((s) => s.notes);
  const artwork = useStudio((s) => s.artwork);
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const garment = getGarment(garmentId);
  const colorName = GARMENT_COLORS.find((c) => c.hex === color)?.name ?? color;
  const spots = placements
    .map((id) => PLACEMENTS.find((p) => p.id === id)?.label)
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    if (!open) return;
    let live = true;
    setFront(null);
    setBack(null);
    async function run() {
      const [f, b] = await Promise.all([
        sideToDataUrl({ garmentId, color, side: "front", layers, width: 1100 }),
        sideToDataUrl({ garmentId, color, side: "back", layers, width: 1100 }),
      ]);
      if (!live) return;
      setFront(f);
      setBack(b);
    }
    void run();
    return () => {
      live = false;
    };
  }, [open, garmentId, color, layers]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useStudio.getState().setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function save(src: string, name: string) {
    const a = document.createElement("a");
    a.href = src;
    a.download = name;
    a.click();
  }

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const tech = TECHNIQUES.find((t) => t.id === technique)?.label ?? technique;
      const qty = totalPieces(sizes);
      const grade = SIZE_KEYS.filter((k) => sizes[k] > 0)
        .map((k) => `${k}: ${sizes[k]}`)
        .join(", ");
      const pdf = await buildQuotePdf({
        garmentId,
        garmentName: garment.name,
        color,
        colorName,
        technique: tech,
        placements: spots,
        grade: `${grade} (total ${qty})`,
        qty,
        company,
        notes,
        estimate: formatBRL(estimateTotal(garment.priceFrom, Math.max(qty, SITE.minPieces), technique)),
        artworkName: artwork?.name,
        layers,
        front,
        back,
      });
      downloadBlob(pdf.blob, pdf.filename);
      toast.success("PDF baixado. Pode anexar no WhatsApp.");
    } catch {
      toast.error("Não foi possível gerar o PDF.");
    } finally {
      setPdfBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-labelledby="preview-title"
        className="flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-auto rounded-t-xl border border-line bg-paper sm:max-h-[92vh] sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.18em] text-moss uppercase">
              Visualização
            </p>
            <h2 id="preview-title" className="font-display text-3xl tracking-tight">
              A sua {garment.name.toLowerCase()}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {colorName}
              {spots ? ` · ${spots}` : ""} · arte aplicada no tecido
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-muted hover:bg-canvas hover:text-ink"
            onClick={() => useStudio.getState().setPreviewOpen(false)}
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          {[
            { src: front, label: "Frente", file: `nova-arte-${garment.id}-frente.png` },
            { src: back, label: "Costas", file: `nova-arte-${garment.id}-costas.png` },
          ].map((shot) => (
            <figure key={shot.label} className="overflow-hidden rounded-lg bg-[#d8d2c6]">
              {shot.src ? (
                <img src={shot.src} alt={`${garment.name} ${shot.label}`} className="w-full" />
              ) : (
                <div className="aspect-[3/4] animate-pulse bg-[#cfc8ba]" />
              )}
              <figcaption className="flex items-center justify-between bg-paper px-3 py-2 text-sm">
                <span>{shot.label}</span>
                {shot.src && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-muted hover:text-ink"
                    onClick={() => save(shot.src!, shot.file)}
                  >
                    <Download className="size-3.5" /> Baixar
                  </button>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4">
          <Button
            variant="secondary"
            disabled={!front || pdfBusy}
            onClick={() => void downloadPdf()}
          >
            <FileDown /> {pdfBusy ? "Gerando PDF…" : "Baixar PDF"}
          </Button>
          <Button
            disabled={!front || pdfBusy}
            onClick={() => {
              void downloadPdf().then(() => {
                window.open(
                  waLink("Olá, Nova Arte! Segue o PDF da visualização da peça para orçamento."),
                  "_blank",
                  "noopener,noreferrer",
                );
              });
            }}
          >
            Enviar no WhatsApp
          </Button>
          <Button
            variant="secondary"
            disabled={!front}
            onClick={() => front && save(front, `nova-arte-${garment.id}-frente.png`)}
          >
            <Download /> Frente
          </Button>
          <Button
            variant="secondary"
            disabled={!back}
            onClick={() => back && save(back, `nova-arte-${garment.id}-costas.png`)}
          >
            <Download /> Costas
          </Button>
          <Button variant="ghost" onClick={() => useStudio.getState().setPreviewOpen(false)}>
            Voltar ao estúdio
          </Button>
        </div>
      </div>
    </div>
  );
}
