import { useEffect } from "react";
import { StudioCanvas } from "./studio-canvas";
import { StudioPanel } from "./studio-panel";
import { useStudio } from "@/lib/studio-store";
import { getGarment } from "@/lib/studio";

export function StudioApp() {
  const garmentId = useStudio((s) => s.garmentId);
  const garment = getGarment(garmentId);

  useEffect(() => {
    void useStudio.persist.rehydrate();
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:items-start">
      <div className="rounded-xl border border-line bg-canvas p-3 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <p className="font-display text-2xl tracking-tight">{garment.name}</p>
          <p className="text-xs tracking-wide text-muted uppercase">Prévia ao vivo</p>
        </div>
        <StudioCanvas />
      </div>
      <div className="lg:sticky lg:top-28">
        <StudioPanel />
      </div>
    </div>
  );
}
