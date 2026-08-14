import { useEffect } from "react";
import { StudioCanvas } from "./studio-canvas";
import { StudioPanel } from "./studio-panel";
import { StudioPreview } from "./studio-preview";
import { useStudio } from "@/lib/studio-store";
import { getGarment } from "@/lib/studio";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Arte" },
  { n: 2, label: "Locais" },
  { n: 3, label: "Visualizar" },
] as const;

export function StudioApp() {
  const garmentId = useStudio((s) => s.garmentId);
  const step = useStudio((s) => s.step);
  const side = useStudio((s) => s.side);
  const artwork = useStudio((s) => s.artwork);
  const placements = useStudio((s) => s.placements);
  const garment = getGarment(garmentId);

  useEffect(() => {
    void useStudio.persist.rehydrate();
  }, []);

  return (
    <div>
      <ol className="mb-8 grid grid-cols-3 gap-2">
        {STEPS.map((s) => {
          const done = step > s.n;
          const current = step === s.n;
          return (
            <li key={s.n}>
              <button
                type="button"
                onClick={() => {
                  if (s.n === 1) useStudio.getState().setStep(1);
                  if (s.n === 2 && artwork) useStudio.getState().setStep(2);
                  if (s.n === 3 && artwork && placements.length) useStudio.getState().setStep(3);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm",
                  current && "border-forest bg-forest text-cream",
                  done && !current && "border-line bg-canvas text-ink",
                  !done && !current && "border-line bg-canvas text-muted",
                )}
              >
                <span className="font-display text-lg leading-none">{s.n}</span>
                <span>{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:items-start">
        <div className="rounded-xl border border-line bg-canvas p-3 sm:p-5">
          {step === 3 ? (
            <StudioPreview />
          ) : (
            <>
              <div className="mb-3 flex items-baseline justify-between px-1">
                <p className="font-display text-2xl tracking-tight">{garment.name}</p>
                <p className="text-xs tracking-wide text-muted uppercase">
                  {step === 2 ? "Clique nos pontos" : "Prévia"}
                </p>
              </div>
              <StudioCanvas placeMode={step === 2} />
              <div className="mt-3 flex gap-2">
                {(["front", "back"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => useStudio.getState().setSide(s)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm",
                      side === s ? "border-forest bg-forest text-cream" : "border-line bg-canvas",
                    )}
                  >
                    {s === "front" ? "Frente" : "Costas"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="lg:sticky lg:top-28">
          <StudioPanel />
        </div>
      </div>
    </div>
  );
}
