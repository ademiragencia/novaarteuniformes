export const SITE = {
  name: "Nova Arte Uniformes",
  shortName: "Nova Arte",
  tagline: "Camiseteria e uniformes sob medida",
  city: "Betim/MG",
  phoneDisplay: "(31) 97565-1420",
  phoneE164: "5531975651420",
  instagram: "novaarteuniformesbetim",
  instagramUrl: "https://instagram.com/novaarteuniformesbetim",
  whatsappUrl: "https://wa.me/5531975651420",
  minPieces: 10,
  hours: "Seg a sex, 8h às 18h",
  ships: "Todo o Brasil e clientes no exterior",
} as const;

export const NAV = [
  { to: "/produtos", label: "Catálogo" },
  { to: "/estudio", label: "Estúdio" },
  { to: "/empresas", label: "Empresas" },
  { to: "/tecnicas", label: "Técnicas" },
  { to: "/sobre", label: "A casa" },
  { to: "/contato", label: "Contato" },
] as const;

export function waLink(text?: string) {
  const base = `https://wa.me/${SITE.phoneE164}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
