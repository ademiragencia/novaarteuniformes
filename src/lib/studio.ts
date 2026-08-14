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

export const GARMENT_COLORS = [
  { name: "Branco", hex: "#F4F1EA" },
  { name: "Preto", hex: "#1A1A1A" },
  { name: "Marinho", hex: "#1B2A4A" },
  { name: "Verde floresta", hex: "#1C3A2E" },
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

export function tintWhiteGarment(
  source: CanvasImageSource,
  width: number,
  height: number,
  hex: string,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.drawImage(source, 0, 0, width, height);

  const isNearWhite = (() => {
    const { r, g, b } = hexToRgb(hex);
    return r > 230 && g > 225 && b > 215;
  })();
  if (isNearWhite) return canvas;

  const image = ctx.getImageData(0, 0, width, height);
  const d = image.data;
  const sample = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return [d[i], d[i + 1], d[i + 2]] as const;
  };
  const corners = [
    sample(8, 8),
    sample(width - 9, 8),
    sample(8, height - 9),
    sample(width - 9, height - 9),
  ];
  const bg = [
    corners.reduce((s, c) => s + c[0], 0) / 4,
    corners.reduce((s, c) => s + c[1], 0) / 4,
    corners.reduce((s, c) => s + c[2], 0) / 4,
  ];
  const { r: tr, g: tg, b: tb } = hexToRgb(hex);

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const dist = Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
    if (dist < 22) continue;
    const mix = dist < 42 ? (dist - 22) / 20 : 1;
    d[i] = r * (1 - mix) + ((r * tr) / 255) * mix;
    d[i + 1] = g * (1 - mix) + ((g * tg) / 255) * mix;
    d[i + 2] = b * (1 - mix) + ((b * tb) / 255) * mix;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}
