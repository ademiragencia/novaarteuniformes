import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getGarment } from "@/lib/studio";
import { sideToDataUrl } from "@/lib/studio-render";
import { useStudio } from "@/lib/studio-store";

export function StudioPreview() {
  const garmentId = useStudio((s) => s.garmentId);
  const color = useStudio((s) => s.color);
  const layers = useStudio((s) => s.layers);
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const garment = getGarment(garmentId);

  useEffect(() => {
    let live = true;
    async function run() {
      const [f, b] = await Promise.all([
        sideToDataUrl({ garmentId, color, side: "front", layers, width: 900 }),
        sideToDataUrl({ garmentId, color, side: "back", layers, width: 900 }),
      ]);
      if (!live) return;
      setFront(f);
      setBack(b);
    }
    void run();
    return () => {
      live = false;
    };
  }, [garmentId, color, layers]);

  function save(src: string, name: string) {
    const a = document.createElement("a");
    a.href = src;
    a.download = name;
    a.click();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl tracking-tight">A sua {garment.name.toLowerCase()}</p>
          <p className="text-sm text-muted">Frente e costas com a arte aplicada.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { src: front, label: "Frente", file: `nova-arte-${garment.id}-frente.png` },
          { src: back, label: "Costas", file: `nova-arte-${garment.id}-costas.png` },
        ].map((shot) => (
          <figure key={shot.label} className="overflow-hidden rounded-lg border border-line bg-paper-deep">
            {shot.src ? (
              <img src={shot.src} alt={`${garment.name} ${shot.label}`} className="w-full" />
            ) : (
              <div className="aspect-[3/4] animate-pulse bg-paper-deep" />
            )}
            <figcaption className="flex items-center justify-between px-3 py-2 text-sm">
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
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={!front}
          onClick={() => front && save(front, `nova-arte-${garment.id}-frente.png`)}
        >
          <Download /> Baixar frente
        </Button>
        <Button
          variant="secondary"
          disabled={!back}
          onClick={() => back && save(back, `nova-arte-${garment.id}-costas.png`)}
        >
          <Download /> Baixar costas
        </Button>
      </div>
    </div>
  );
}
