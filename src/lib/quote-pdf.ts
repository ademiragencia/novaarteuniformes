import { jsPDF } from "jspdf";
import { SITE } from "@/lib/site";
import { sideToDataUrl } from "@/lib/studio-render";
import type { Side, StudioLayer } from "@/lib/studio";

export type QuotePdfInput = {
  garmentId: string;
  garmentName: string;
  color: string;
  colorName: string;
  technique: string;
  placements: string;
  grade: string;
  qty: number;
  company: string;
  notes: string;
  estimate: string;
  artworkName?: string;
  layers: StudioLayer[];
  front?: string | null;
  back?: string | null;
};

const NAVY: [number, number, number] = [16, 37, 81];
const GREEN: [number, number, number] = [15, 97, 58];
const RED: [number, number, number] = [182, 32, 44];
const INK: [number, number, number] = [12, 23, 51];
const MUTED: [number, number, number] = [92, 101, 120];

async function asDataUrl(src: string) {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function loadFontB64(path: string) {
  const buf = await fetch(path).then((r) => r.arrayBuffer());
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

function filenameOf(input: QuotePdfInput) {
  const slug = (input.company || input.garmentName)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  const day = new Date().toISOString().slice(0, 10);
  return `nova-arte-${slug || "pedido"}-${day}.pdf`;
}

export async function buildQuotePdf(input: QuotePdfInput) {
  const [front, back, logo, regular, bold] = await Promise.all([
    input.front ||
      sideToDataUrl(
        {
          garmentId: input.garmentId,
          color: input.color,
          side: "front" as Side,
          layers: input.layers,
          width: 900,
        },
        "image/jpeg",
      ),
    input.back ||
      sideToDataUrl(
        {
          garmentId: input.garmentId,
          color: input.color,
          side: "back" as Side,
          layers: input.layers,
          width: 900,
        },
        "image/jpeg",
      ),
    asDataUrl("/brand/logo-header.png"),
    loadFontB64("/fonts/sans.ttf"),
    loadFontB64("/fonts/sans-bold.ttf"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.addFileToVFS("sans.ttf", regular);
  doc.addFileToVFS("sans-bold.ttf", bold);
  doc.addFont("sans.ttf", "Nova", "normal");
  doc.addFont("sans-bold.ttf", "Nova", "bold");
  doc.setFont("Nova", "normal");

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 26, "F");
  doc.setFillColor(...NAVY);
  doc.rect(0, 26, 70, 1.8, "F");
  doc.setFillColor(...GREEN);
  doc.rect(70, 26, 70, 1.8, "F");
  doc.setFillColor(...RED);
  doc.rect(140, 26, 70, 1.8, "F");

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 5, 42, 16, 2, 2, "F");
  try {
    doc.addImage(logo, "PNG", 12, 6.2, 38, 13.5);
  } catch {
    /* logo optional */
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("Nova", "bold");
  doc.setFontSize(12);
  doc.text("Pedido de orçamento", 198, 11, { align: "right" });
  doc.setFont("Nova", "normal");
  doc.setFontSize(8.5);
  doc.text(`${SITE.city}  ·  ${SITE.phoneDisplay}`, 198, 17, { align: "right" });
  doc.text(new Date().toLocaleDateString("pt-BR"), 198, 21.5, { align: "right" });

  doc.setTextColor(...INK);
  doc.setFont("Nova", "bold");
  doc.setFontSize(16);
  doc.text(`Visualização · ${input.garmentName}`, 12, 38);
  doc.setFont("Nova", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  const subtitle = [input.colorName, input.technique, input.placements]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(subtitle || "Peça personalizada no estúdio", 12, 44);

  const imgY = 50;
  const imgW = 90;
  const imgH = 120;
  doc.setFillColor(229, 234, 240);
  doc.roundedRect(12, imgY, imgW, imgH, 2, 2, "F");
  doc.roundedRect(108, imgY, imgW, imgH, 2, 2, "F");
  doc.addImage(front, "JPEG", 12, imgY, imgW, imgH);
  doc.addImage(back, "JPEG", 108, imgY, imgW, imgH);
  doc.setFont("Nova", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("FRENTE", 12, imgY + imgH + 5);
  doc.text("COSTAS", 108, imgY + imgH + 5);

  const rows: [string, string][] = [
    ["Peça", input.garmentName],
    ["Cor", input.colorName],
    ["Técnica", input.technique],
    ["Locais da arte", input.placements || "A definir"],
    ["Arquivo", input.artworkName || "—"],
    ["Grade", input.grade],
    ["Quantidade", `${input.qty} peças`],
    ["Empresa / evento", input.company || "—"],
    ["Observações", input.notes || "—"],
    ["Estimativa no site", input.estimate],
  ];

  let y = imgY + imgH + 14;
  doc.setDrawColor(213, 219, 228);
  for (const [label, value] of rows) {
    if (y > 272) break;
    doc.setFont("Nova", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), 12, y);
    doc.setFont("Nova", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    const wrapped = doc.splitTextToSize(value, 132);
    doc.text(wrapped, 64, y);
    const block = Math.max(7, wrapped.length * 4.4);
    y += block;
    doc.setDrawColor(229, 234, 240);
    doc.line(12, y - 3.2, 198, y - 3.2);
  }

  doc.setFillColor(...NAVY);
  doc.rect(0, 281, 210, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("Nova", "normal");
  doc.setFontSize(8);
  doc.text(
    `${SITE.name}  ·  ${SITE.whatsappUrl.replace("https://", "")}  ·  Pedido mínimo ${SITE.minPieces} peças  ·  ${SITE.lead}`,
    12,
    290,
  );

  const filename = filenameOf(input);
  const blob = doc.output("blob");
  return { blob, filename, doc };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function shareQuotePdf(blob: Blob, filename: string, text: string) {
  const file = new File([blob], filename, { type: "application/pdf" });
  downloadBlob(blob, filename);
  if (typeof navigator.canShare === "function") {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Orçamento Nova Arte", text });
        return "shared" as const;
      }
    } catch {
      return "downloaded" as const;
    }
  }
  return "downloaded" as const;
}
