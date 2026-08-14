import { useEffect, useRef } from "react";
import {
  type ImageLayer,
  type StudioLayer,
  type TextLayer,
  getGarment,
  tintWhiteGarment,
} from "@/lib/studio";
import { useStudio } from "@/lib/studio-store";

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string) {
  const hit = imageCache.get(src);
  if (hit && hit.complete) return Promise.resolve(hit);
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: StudioLayer,
  w: number,
  h: number,
  selected: boolean,
) {
  ctx.save();
  ctx.translate(layer.x * w, layer.y * h);
  ctx.rotate((layer.rotation * Math.PI) / 180);
  ctx.scale(layer.scale, layer.scale);

  if (layer.type === "text") {
    const t = layer as TextLayer;
    ctx.font = `700 ${Math.round(w * 0.055)}px "${t.font}", sans-serif`;
    ctx.fillStyle = t.fill;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.text, 0, 0);
    if (selected) {
      const m = ctx.measureText(t.text);
      const tw = m.width + 16;
      const th = w * 0.07;
      ctx.strokeStyle = "#1c3a2e";
      ctx.lineWidth = 1.5 / layer.scale;
      ctx.setLineDash([5 / layer.scale, 4 / layer.scale]);
      ctx.strokeRect(-tw / 2, -th / 2, tw, th);
    }
  } else {
    const im = imageCache.get((layer as ImageLayer).src);
    if (im) {
      const iw = w * 0.28;
      const ih = iw * (im.naturalHeight / im.naturalWidth || 1);
      ctx.drawImage(im, -iw / 2, -ih / 2, iw, ih);
      if (selected) {
        ctx.strokeStyle = "#1c3a2e";
        ctx.lineWidth = 1.5 / layer.scale;
        ctx.setLineDash([5 / layer.scale, 4 / layer.scale]);
        ctx.strokeRect(-iw / 2, -ih / 2, iw, ih);
      }
    }
  }
  ctx.restore();
}

function hitTest(
  layer: StudioLayer,
  mx: number,
  my: number,
  w: number,
  h: number,
) {
  const dx = mx - layer.x * w;
  const dy = my - layer.y * h;
  const rad = (-layer.rotation * Math.PI) / 180;
  const lx = (dx * Math.cos(rad) - dy * Math.sin(rad)) / layer.scale;
  const ly = (dx * Math.sin(rad) + dy * Math.cos(rad)) / layer.scale;
  if (layer.type === "text") {
    const tw = w * 0.22 * Math.max(0.4, layer.text.length / 8);
    const th = w * 0.07;
    return Math.abs(lx) < tw / 2 && Math.abs(ly) < th / 2;
  }
  const iw = w * 0.14;
  return Math.abs(lx) < iw && Math.abs(ly) < iw;
}

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
  const tinted = useRef<HTMLCanvasElement | null>(null);
  const tintKey = useRef("");

  useEffect(() => {
    let cancelled = false;
    const garment = getGarment(garmentId);
    const src = side === "front" ? garment.front : garment.back;

    async function paint() {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const img = await loadImage(src);
      if (cancelled) return;

      const maxW = wrap.clientWidth;
      const ratio = img.naturalHeight / img.naturalWidth;
      const w = Math.min(maxW, 720);
      const h = Math.round(w * ratio);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const key = `${src}|${color}|${w}x${h}`;
      if (tintKey.current !== key || !tinted.current) {
        tinted.current = tintWhiteGarment(img, w, h, color);
        tintKey.current = key;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(tinted.current, 0, 0, w, h);

      const print = side === "front" ? garment.print : garment.printBack;
      ctx.save();
      ctx.strokeStyle = "rgba(28,58,46,0.28)";
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(print.x * w, print.y * h, print.w * w, print.h * h);
      ctx.restore();

      const visible = layers.filter((l) => l.side === side);
      for (const layer of visible) {
        if (layer.type === "image") {
          try {
            await loadImage(layer.src);
          } catch {
            /* skip */
          }
        }
        if (cancelled) return;
        drawLayer(ctx, layer, w, h, layer.id === selectedId);
      }
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
    const hit = visible.find((l) => hitTest(l, x, y, w, h));
    if (hit) {
      select(hit.id);
      drag.current = { id: hit.id, ox: x - hit.x * w, oy: y - hit.y * h };
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
