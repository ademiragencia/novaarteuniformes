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
    front: "/mockups/tshirt-front.jpg?v=4",
    back: "/mockups/tshirt-back.jpg?v=4",
    print: { x: 0.3, y: 0.3, w: 0.4, h: 0.32 },
    printBack: { x: 0.28, y: 0.26, w: 0.44, h: 0.38 },
  },
  {
    id: "polo",
    name: "Polo",
    priceFrom: 54.9,
    front: "/mockups/polo-front.jpg?v=4",
    back: "/mockups/polo-back.jpg?v=4",
    print: { x: 0.32, y: 0.28, w: 0.36, h: 0.28 },
    printBack: { x: 0.28, y: 0.24, w: 0.44, h: 0.38 },
  },
  {
    id: "hoodie",
    name: "Moletom",
    priceFrom: 129.9,
    front: "/mockups/hoodie-front.jpg?v=4",
    back: "/mockups/hoodie-back.jpg?v=4",
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

export const STUDIO_BACKDROP = "#E5EAF0";

const tintCache = new Map<string, HTMLCanvasElement>();

/** Recolor fabric by growing from the bright shirt, never punching holes. */
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
  let bR = 0;
  let bG = 0;
  let bB = 0;
  let bN = 0;
  const edge = 6;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const i = p * 4;
      luma[p] = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2] + 0.5) | 0;
      if (x < edge || y < edge || x >= width - edge || y >= height - edge) {
        bR += d[i];
        bG += d[i + 1];
        bB += d[i + 2];
        bN++;
      }
    }
  }
  const bgR = bR / bN;
  const bgG = bG / bN;
  const bgB = bB / bN;
  const bgL = 0.2126 * bgR + 0.7152 * bgG + 0.0722 * bgB;

  const shirt = new Uint8Array(n);
  const qx = new Int32Array(n);
  const qy = new Int32Array(n);
  let head = 0;
  let tail = 0;
  const padX = Math.round(width * 0.05);
  const padY = Math.round(height * 0.05);
  const enqueue = (x: number, y: number) => {
    const p = y * width + x;
    if (shirt[p]) return;
    shirt[p] = 1;
    qx[tail] = x;
    qy[tail] = y;
    tail++;
  };

  for (let y = padY; y < height - padY; y++) {
    for (let x = padX; x < width - padX; x++) {
      const p = y * width + x;
      const i = p * 4;
      const dist = Math.hypot(d[i] - bgR, d[i + 1] - bgG, d[i + 2] - bgB);
      if (luma[p] >= bgL + 12 && dist > 14) enqueue(x, y);
    }
  }

  while (head < tail) {
    const x = qx[head];
    const y = qy[head];
    head++;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ] as const) {
      if (nx < 1 || ny < 1 || nx >= width - 1 || ny >= height - 1) continue;
      const p = ny * width + nx;
      if (shirt[p]) continue;
      const i = p * 4;
      const dist = Math.hypot(d[i] - bgR, d[i + 1] - bgG, d[i + 2] - bgB);
      if (luma[p] >= bgL + 6 || dist > 11) enqueue(nx, ny);
    }
  }

  for (let p = 0, i = 0; p < n; p++, i += 4) {
    if (!shirt[p]) continue;
    const nrm = Math.min(1, luma[p] / 246);
    const shade = 0.12 + 0.88 * nrm;
    d[i] = tr * shade;
    d[i + 1] = tg * shade;
    d[i + 2] = tb * shade;
  }
  ctx.putImageData(image, 0, 0);
  if (tintCache.size > 40) tintCache.clear();
  tintCache.set(key, canvas);
  return canvas;
}
