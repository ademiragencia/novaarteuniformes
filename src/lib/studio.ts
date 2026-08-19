import type { TechniqueId } from "./products";

export type Side = "front" | "back";

export type TextLayer = {
  id: string;
  type: "text";
  side: Side;
  text: string;
  font: string;
  fill: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  placementId?: string;
};

export type ImageLayer = {
  id: string;
  type: "image";
  side: Side;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  placementId?: string;
  name?: string;
};

export type StudioLayer = TextLayer | ImageLayer;

export type SizeKey = "PP" | "P" | "M" | "G" | "GG" | "XG";

export const SIZE_KEYS: SizeKey[] = ["PP", "P", "M", "G", "GG", "XG"];

export type Garment = {
  id: string;
  name: string;
  priceFrom: number;
  front: string;
  back: string;
  print: { x: number; y: number; w: number; h: number };
  printBack: { x: number; y: number; w: number; h: number };
};

export const GARMENTS: Garment[] = [
  {
    id: "tshirt",
    name: "Camiseta",
    priceFrom: 32.9,
    front: "/mockups/tshirt-front.jpg",
    back: "/mockups/tshirt-back.jpg",
    print: { x: 0.3, y: 0.3, w: 0.4, h: 0.32 },
    printBack: { x: 0.28, y: 0.26, w: 0.44, h: 0.38 },
  },
  {
    id: "polo",
    name: "Polo",
    priceFrom: 54.9,
    front: "/mockups/polo-front.jpg",
    back: "/mockups/polo-back.jpg",
    print: { x: 0.32, y: 0.28, w: 0.36, h: 0.28 },
    printBack: { x: 0.28, y: 0.24, w: 0.44, h: 0.38 },
  },
  {
    id: "hoodie",
    name: "Moletom",
    priceFrom: 129.9,
    front: "/mockups/hoodie-front.jpg",
    back: "/mockups/hoodie-back.jpg",
    print: { x: 0.32, y: 0.26, w: 0.36, h: 0.22 },
    printBack: { x: 0.28, y: 0.22, w: 0.44, h: 0.36 },
  },
];

export type Placement = {
  id: string;
  label: string;
  hint: string;
  side: Side;
  x: number;
  y: number;
  scale: number;
  overrides?: Record<string, Partial<Pick<Placement, "x" | "y" | "scale">>>;
};

export const PLACEMENTS: Placement[] = [
  {
    id: "chest-left",
    label: "Peito esquerdo",
    hint: "Logo pequeno, o clássico da polo",
    side: "front",
    x: 0.62,
    y: 0.34,
    scale: 0.5,
    overrides: {
      polo: { x: 0.64, y: 0.36, scale: 0.42 },
      hoodie: { x: 0.62, y: 0.3, scale: 0.46 },
    },
  },
  {
    id: "chest-center",
    label: "Peito centro",
    hint: "Marca na altura do peito",
    side: "front",
    x: 0.5,
    y: 0.4,
    scale: 0.9,
    overrides: {
      polo: { y: 0.42, scale: 0.78 },
      hoodie: { y: 0.33, scale: 0.72 },
    },
  },
  {
    id: "front-full",
    label: "Frente grande",
    hint: "Estampa de camiseta",
    side: "front",
    x: 0.5,
    y: 0.46,
    scale: 1.4,
    overrides: {
      polo: { y: 0.46, scale: 1.15 },
      hoodie: { y: 0.36, scale: 1.05 },
    },
  },
  {
    id: "back-center",
    label: "Costas",
    hint: "Arte nas costas, tamanho cheio",
    side: "back",
    x: 0.5,
    y: 0.4,
    scale: 1.45,
    overrides: {
      hoodie: { y: 0.38, scale: 1.25 },
    },
  },
  {
    id: "back-neck",
    label: "Nuca",
    hint: "Marca pequena abaixo da gola",
    side: "back",
    x: 0.5,
    y: 0.27,
    scale: 0.42,
    overrides: {
      hoodie: { y: 0.24, scale: 0.4 },
    },
  },
];

export function resolvePlacement(id: string, garmentId: string) {
  const base = PLACEMENTS.find((p) => p.id === id);
  if (!base) return null;
  return { ...base, ...base.overrides?.[garmentId] };
}

export const GARMENT_COLORS = [
  { name: "Branco", hex: "#F4F1EA" },
  { name: "Preto", hex: "#1A1A1A" },
  { name: "Marinho", hex: "#1B2A4A" },
  { name: "Verde floresta", hex: "#0F613A" },
  { name: "Musgo", hex: "#4A5C3A" },
  { name: "Vinho", hex: "#6B2B32" },
  { name: "Cinza", hex: "#6E6A64" },
  { name: "Vermelho", hex: "#8B1E1E" },
  { name: "Royal", hex: "#1E3A8A" },
  { name: "Areia", hex: "#C4B49A" },
] as const;

export const STUDIO_FONTS = [
  { id: "Oswald", label: "Oswald" },
  { id: "Montserrat", label: "Montserrat" },
  { id: "Bebas Neue", label: "Bebas" },
  { id: "Anton", label: "Anton" },
  { id: "Playfair Display", label: "Playfair" },
  { id: "Permanent Marker", label: "Marcador" },
] as const;

export const TECHNIQUES: {
  id: TechniqueId;
  label: string;
  hint: string;
  multiplier: number;
}[] = [
  { id: "silk", label: "Silk", hint: "Melhor custo em volume", multiplier: 1 },
  { id: "dtf", label: "DTF", hint: "Foto e cor cheia", multiplier: 1.15 },
  { id: "bordado", label: "Bordado", hint: "Relevo e durabilidade", multiplier: 1.4 },
  { id: "sublimacao", label: "Sublimação", hint: "Peça inteira, dry fit", multiplier: 1.2 },
];

export const TEXT_COLORS = [
  "#171411",
  "#F4F1EA",
  "#1C3A2E",
  "#1B2A4A",
  "#6B2B32",
  "#8B1E1E",
  "#C4B49A",
  "#4A5C3A",
];

export function getGarment(id: string) {
  return GARMENTS.find((g) => g.id === id) ?? GARMENTS[0];
}

export function emptySizes(): Record<SizeKey, number> {
  return { PP: 0, P: 2, M: 4, G: 3, GG: 1, XG: 0 };
}

export function totalPieces(sizes: Record<SizeKey, number>) {
  return SIZE_KEYS.reduce((sum, k) => sum + (sizes[k] || 0), 0);
}

export function estimateTotal(
  priceFrom: number,
  qty: number,
  technique: TechniqueId,
) {
  const tech = TECHNIQUES.find((t) => t.id === technique)?.multiplier ?? 1;
  return priceFrom * qty * tech;
}

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const tintCache = new Map<string, HTMLCanvasElement>();

function otsuThreshold(luma: Uint8Array) {
  const hist = new Uint32Array(256);
  for (let i = 0; i < luma.length; i++) hist[luma[i]]++;
  const n = luma.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let maxVar = 0;
  let thresh = 200;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = n - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > maxVar) {
      maxVar = v;
      thresh = t;
    }
  }
  return thresh;
}

function blurMask(src: Float32Array, w: number, h: number, radius: number) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const span = radius * 2 + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let acc = 0;
    for (let k = -radius; k <= radius; k++) {
      const x = k < 0 ? 0 : k >= w ? w - 1 : k;
      acc += src[row + x];
    }
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc / span;
      const add = x + radius + 1 < w ? x + radius + 1 : w - 1;
      const rem = x - radius < 0 ? 0 : x - radius;
      acc += src[row + add] - src[row + rem];
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let k = -radius; k <= radius; k++) {
      const y = k < 0 ? 0 : k >= h ? h - 1 : k;
      acc += tmp[y * w + x];
    }
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / span;
      const add = y + radius + 1 < h ? y + radius + 1 : h - 1;
      const rem = y - radius < 0 ? 0 : y - radius;
      acc += tmp[add * w + x] - tmp[rem * w + x];
    }
  }
  return out;
}

/** Isolate the garment from the studio backdrop, then dye only the fabric. */
export function tintWhiteGarment(
  source: CanvasImageSource,
  width: number,
  height: number,
  hex: string,
  cacheKey = "",
) {
  const key = `${cacheKey}|${width}x${height}|${hex}`;
  const hit = tintCache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.drawImage(source, 0, 0, width, height);

  const { r: tr, g: tg, b: tb } = hexToRgb(hex);
  if (tr > 230 && tg > 225 && tb > 215) {
    tintCache.set(key, canvas);
    return canvas;
  }

  const image = ctx.getImageData(0, 0, width, height);
  const d = image.data;
  const n = width * height;
  const luma = new Uint8Array(n);
  for (let p = 0, i = 0; p < n; p++, i += 4) {
    luma[p] = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2] + 0.5) | 0;
  }

  const cut = Math.min(220, otsuThreshold(luma) + 8);
  const bg = new Uint8Array(n);
  const qx = new Int32Array(n);
  const qy = new Int32Array(n);
  let head = 0;
  let tail = 0;
  const enqueue = (x: number, y: number) => {
    const p = y * width + x;
    if (bg[p] || luma[p] >= cut) return;
    bg[p] = 1;
    qx[tail] = x;
    qy[tail] = y;
    tail++;
  };
  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }
  while (head < tail) {
    const x = qx[head];
    const y = qy[head];
    head++;
    if (x > 0) enqueue(x - 1, y);
    if (x + 1 < width) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y + 1 < height) enqueue(x, y + 1);
  }

  const hard = new Float32Array(n);
  const dilated = new Uint8Array(n);
  for (let p = 0; p < n; p++) {
    if (bg[p]) continue;
    dilated[p] = 1;
    const x = p % width;
    const y = (p / width) | 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        dilated[ny * width + nx] = 1;
      }
    }
  }
  for (let p = 0; p < n; p++) hard[p] = dilated[p] ? 1 : 0;
  const mask = blurMask(hard, width, height, 1);

  for (let p = 0, i = 0; p < n; p++, i += 4) {
    const a = mask[p];
    if (a < 0.02) continue;
    const shade = 0.14 + 0.86 * Math.min(1, luma[p] / 235);
    d[i] = d[i] * (1 - a) + tr * shade * a;
    d[i + 1] = d[i + 1] * (1 - a) + tg * shade * a;
    d[i + 2] = d[i + 2] * (1 - a) + tb * shade * a;
  }
  ctx.putImageData(image, 0, 0);
  if (tintCache.size > 40) tintCache.clear();
  tintCache.set(key, canvas);
  return canvas;
}
