import { useEffect, useRef } from "react";
import { getGarment } from "@/lib/studio";
import { hitTest, loadImage, renderGarmentSide } from "@/lib/studio-render";
import { useStudio } from "@/lib/studio-store";

export function StudioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const garmentId = useStudio((s) => s.garmentId);
  const color = useStudio((s) => s.color);
  const side = useStudio((s) => s.side);
  const layers = useStudio((s) => s.layers);
  const selectedId = useStudio((s) => s.selectedId);
  const select = useStudio((s) => s.select);
  const updateLayer = useStudio((s) => s.updateLayer);
  const drag = useRef<{ id: string; ox: number; oy: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function paint() {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const garment = getGarment(garmentId);
      const src = side === "front" ? garment.front : garment.back;
      const img = await loadImage(src);
      if (cancelled) return;

      const maxW = wrap.clientWidth;
      const ratio = img.naturalHeight / img.naturalWidth;
      const w = Math.min(maxW, 720);
      const h = Math.round(w * ratio);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const painted = await renderGarmentSide({
        garmentId,
        color,
        side,
        layers,
        width: w,
        showGuides: true,
        selectedId,
      });
      if (cancelled) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(painted, 0, 0, w, h);
    }

    void paint();
    const ro = new ResizeObserver(() => void paint());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [garmentId, color, side, layers, selectedId]);

  function localPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, w: 1, h: 1 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { x, y, w, h } = localPoint(e);
    const visible = [...useStudio.getState().layers]
      .filter((l) => l.side === side)
      .reverse();
    const found = visible.find((l) => hitTest(l, x, y, w, h));
    if (found) {
      select(found.id);
      drag.current = { id: found.id, ox: x - found.x * w, oy: y - found.y * h };
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    } else {
      select(null);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag.current) return;
    const { x, y, w, h } = localPoint(e);
    updateLayer(drag.current.id, {
      x: Math.min(0.86, Math.max(0.14, (x - drag.current.ox) / w)),
      y: Math.min(0.86, Math.max(0.16, (y - drag.current.oy) / h)),
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (!selectedId) return;
    e.preventDefault();
    const layer = layers.find((l) => l.id === selectedId);
    if (!layer) return;
    const next = Math.min(2.8, Math.max(0.35, layer.scale + (e.deltaY > 0 ? -0.08 : 0.08)));
    updateLayer(selectedId, { scale: next });
  }

  return (
    <div ref={wrapRef} className="relative flex min-h-[320px] items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full touch-none rounded-lg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      />
    </div>
  );
}
