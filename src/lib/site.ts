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
  payment: "Pix ou transferência · 50% para iniciar",
  lead: "7 a 12 dias úteis após a arte aprovada",
} as const;

export const NAV = [
  { to: "/produtos", label: "Catálogo" },
  { to: "/estudio", label: "Estúdio" },
  { to: "/empresas", label: "Empresas" },
  { to: "/trabalhos", label: "Trabalhos" },
  { to: "/sobre", label: "A casa" },
  { to: "/contato", label: "Contato" },
] as const;

export const FOOTER_MORE = [
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/tamanhos", label: "Guia de tamanhos" },
  { to: "/tecnicas", label: "Técnicas" },
  { to: "/privacidade", label: "Privacidade" },
] as const;

export function waLink(text?: string) {
  const base = `https://wa.me/${SITE.phoneE164}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
