import {
  type ImageLayer,
  type Side,
  type StudioLayer,
  type TextLayer,
  PLACEMENTS,
  colorSlug,
  garmentSrc,
  getGarment,
  resolvePlacement,
  tintWhiteGarment,
} from "./studio";

const imageCache = new Map<string, HTMLImageElement>();

export function loadImage(src: string) {
  const hit = imageCache.get(src);
  if (hit && hit.complete && hit.naturalWidth > 0) return Promise.resolve(hit);
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

export function layerBox(layer: StudioLayer, w: number) {
  if (layer.type === "text") {
    const tw = w * 0.22 * Math.max(0.4, layer.text.length / 8);
    const th = w * 0.07;
    return { w: tw, h: th };
  }
  const im = imageCache.get((layer as ImageLayer).src);
  const iw = w * 0.28;
  const ih = iw * ((im?.naturalHeight || 1) / (im?.naturalWidth || 1));
  return { w: iw, h: ih };
}

function printImageOnFabric(
  ctx: CanvasRenderingContext2D,
  im: HTMLImageElement,
  layer: ImageLayer,
  canvasW: number,
  canvasH: number,
) {
  const base = canvasW * 0.28 * layer.scale;
  const iw = base;
  const ih = iw * (im.naturalHeight / im.naturalWidth || 1);
  const cx = layer.x * canvasW;
  const cy = layer.y * canvasH;
  const rad = (layer.rotation * Math.PI) / 180;
  const pad = Math.ceil(Math.hypot(iw, ih) / 2) + 3;
  const sx = Math.max(0, Math.floor(cx - pad));
  const sy = Math.max(0, Math.floor(cy - pad));
  const sw = Math.min(canvasW - sx, pad * 2);
  const sh = Math.min(canvasH - sy, pad * 2);
  if (sw < 2 || sh < 2) return;

  const dest = ctx.getImageData(sx, sy, sw, sh);
  const off = document.createElement("canvas");
  off.width = sw;
  off.height = sh;
  const octx = off.getContext("2d");
  if (!octx) return;
  octx.translate(cx - sx, cy - sy);
  octx.rotate(rad);
  octx.drawImage(im, -iw / 2, -ih / 2, iw, ih);
  const src = octx.getImageData(0, 0, sw, sh);
  const dd = dest.data;
  const sd = src.data;

  for (let i = 0; i < sd.length; i += 4) {
    const a = sd[i + 3] / 255;
    if (a < 0.012) continue;
    const lum = (0.2126 * dd[i] + 0.7152 * dd[i + 1] + 0.0722 * dd[i + 2]) / 255;
    const shade = 0.56 + lum * 0.44;
    dd[i] = dd[i] * (1 - a) + sd[i] * shade * a;
    dd[i + 1] = dd[i + 1] * (1 - a) + sd[i + 1] * shade * a;
    dd[i + 2] = dd[i + 2] * (1 - a) + sd[i + 2] * shade * a;
  }
  ctx.putImageData(dest, sx, sy);
}

export function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: StudioLayer,
  w: number,
  h: number,
  selected: boolean,
) {
  if (layer.type === "image") {
    const im = imageCache.get(layer.src);
    if (im) {
      printImageOnFabric(ctx, im, layer, w, h);
      if (selected) {
        ctx.save();
        ctx.translate(layer.x * w, layer.y * h);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        const iw = w * 0.28 * layer.scale;
        const ih = iw * (im.naturalHeight / im.naturalWidth || 1);
        ctx.strokeStyle = "#1c3a2e";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(-iw / 2, -ih / 2, iw, ih);
        ctx.restore();
      }
    }
    return;
  }

  ctx.save();
  ctx.translate(layer.x * w, layer.y * h);
  ctx.rotate((layer.rotation * Math.PI) / 180);
  ctx.scale(layer.scale, layer.scale);
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
  ctx.restore();
}

export function hitTest(
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
  const box = layerBox(layer, w);
  return Math.abs(lx) < box.w / 2 && Math.abs(ly) < box.h / 2;
}

export async function renderGarmentSide(opts: {
  garmentId: string;
  color: string;
  side: Side;
  layers: StudioLayer[];
  width?: number;
  showGuides?: boolean;
  selectedId?: string | null;
  showHotspots?: boolean;
  activePlacements?: string[];
}): Promise<HTMLCanvasElement> {
  const garment = getGarment(opts.garmentId);
  const preferred = garmentSrc(opts.garmentId, opts.side, opts.color);
  const fallback = opts.side === "front" ? garment.front : garment.back;
  let img: HTMLImageElement;
  let needsTint = false;
  try {
    img = await loadImage(preferred);
    needsTint = colorSlug(opts.color) !== "white" && preferred === fallback;
  } catch {
    img = await loadImage(fallback);
    needsTint = colorSlug(opts.color) !== "white";
  }
  const w = opts.width ?? 720;
  const h = Math.round(w * (img.naturalHeight / img.naturalWidth));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  if (needsTint) {
    ctx.drawImage(tintWhiteGarment(img, w, h, opts.color, fallback), 0, 0, w, h);
  } else {
    ctx.drawImage(img, 0, 0, w, h);
  }

  if (opts.showGuides) {
    const print = opts.side === "front" ? garment.print : garment.printBack;
    ctx.save();
    ctx.strokeStyle = "rgba(28,58,46,0.28)";
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1;
    ctx.strokeRect(print.x * w, print.y * h, print.w * w, print.h * h);
    ctx.restore();
  }

  const visible = opts.layers.filter((l) => l.side === opts.side);
  for (const layer of visible) {
    if (layer.type === "image") {
      try {
        await loadImage(layer.src);
      } catch {
        /* skip */
      }
    }
    drawLayer(ctx, layer, w, h, layer.id === opts.selectedId);
  }

  if (opts.showHotspots) {
    for (const p of PLACEMENTS.filter((pl) => pl.side === opts.side)) {
      const r = resolvePlacement(p.id, opts.garmentId);
      if (!r) continue;
      const on = opts.activePlacements?.includes(p.id);
      ctx.beginPath();
      ctx.arc(r.x * w, r.y * h, on ? 11 : 9, 0, Math.PI * 2);
      ctx.fillStyle = on ? "#1c3a2e" : "rgba(255,252,247,0.92)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#1c3a2e";
      ctx.stroke();
    }
  }

  return canvas;
}

export async function sideToDataUrl(
  opts: Parameters<typeof renderGarmentSide>[0],
  type: "image/png" | "image/jpeg" = "image/png",
) {
  const canvas = await renderGarmentSide(opts);
  return canvas.toDataURL(type, 0.9);
}
