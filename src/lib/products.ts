export type CategoryId =
  | "camisetas"
  | "polos"
  | "moletons"
  | "esportivo"
  | "uniformes"
  | "hospitalidade"
  | "acessorios";

export type TechniqueId = "silk" | "dtf" | "bordado" | "sublimacao";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  priceFrom: number;
  blurb: string;
  description: string;
  image: string;
  gallery: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  techniques: TechniqueId[];
  fabric: string;
  customizable: boolean;
  garmentId?: string;
};

export const CATEGORIES: { id: CategoryId; label: string; hint: string }[] = [
  { id: "camisetas", label: "Camisetas", hint: "Cotton e premium" },
  { id: "polos", label: "Polos", hint: "Piquet e raglan" },
  { id: "moletons", label: "Moletons", hint: "Flanelado" },
  { id: "esportivo", label: "Esportivo", hint: "Dry fit e UV" },
  { id: "uniformes", label: "Uniformes", hint: "Operacional e social" },
  { id: "hospitalidade", label: "Hospitalidade", hint: "Aventais e cozinha" },
  { id: "acessorios", label: "Acessórios", hint: "Bonés" },
];

export const PRODUCTS: Product[] = [
  {
    id: "camiseta-cotton",
    slug: "camiseta-cotton",
    name: "Camiseta Cotton 30.1",
    category: "camisetas",
    priceFrom: 32.9,
    blurb: "A peça de trabalho do dia a dia. Malha firme, caimento reto.",
    description:
      "Camiseta 100% algodão 30.1, gola careca reforçada e costura ombro a ombro. A base mais pedida para silk e DTF. Indicada para equipes, eventos e merchandising. Pedido mínimo de 10 peças.",
    image: "/mockups/tshirt-front.jpg",
    gallery: ["/mockups/tshirt-front.jpg", "/mockups/tshirt-back.jpg", "/images/tshirt-navy.jpg"],
    colors: [
      { name: "Branco", hex: "#F4F1EA" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Marinho", hex: "#1B2A4A" },
      { name: "Cinza", hex: "#6E6A64" },
    ],
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    techniques: ["silk", "dtf", "bordado"],
    fabric: "Algodão 30.1",
    customizable: true,
    garmentId: "tshirt",
  },
  {
    id: "camiseta-navy",
    slug: "camiseta-marinho",
    name: "Camiseta Marinho Lisa",
    category: "camisetas",
    priceFrom: 34.9,
    blurb: "Azul-marinho profundo, o coringa de qualquer equipe.",
    description:
      "Mesma construção da Cotton 30.1, tingida em marinho fechado. Recebe bordado no peito e DTF nas costas com excelente contraste.",
    image: "/images/tshirt-navy.jpg",
    gallery: ["/images/tshirt-navy.jpg", "/mockups/tshirt-front.jpg"],
    colors: [
      { name: "Marinho", hex: "#1B2A4A" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Branco", hex: "#F4F1EA" },
    ],
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    techniques: ["silk", "dtf", "bordado"],
    fabric: "Algodão 30.1",
    customizable: true,
    garmentId: "tshirt",
  },
  {
    id: "polo-piquet",
    slug: "polo-piquet",
    name: "Polo Piquet",
    category: "polos",
    priceFrom: 54.9,
    blurb: "Gola e punho em ribana. A polo que veste a recepção e o chão de fábrica.",
    description:
      "Polo em piquet penteado, botões em tom, gola estruturada. Aceita bordado no peito com acabamento de casa de uniformes. A peça mais pedida para identidade corporativa.",
    image: "/mockups/polo-front.jpg",
    gallery: ["/mockups/polo-front.jpg", "/mockups/polo-back.jpg", "/images/polos-stack.jpg"],
    colors: [
      { name: "Branco", hex: "#F4F1EA" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Marinho", hex: "#1B2A4A" },
      { name: "Verde floresta", hex: "#1C3A2E" },
      { name: "Vinho", hex: "#6B2B32" },
    ],
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    techniques: ["bordado", "silk", "dtf"],
    fabric: "Piquet penteado",
    customizable: true,
    garmentId: "polo",
  },
  {
    id: "polo-raglan",
    slug: "polo-raglan",
    name: "Polo Raglan",
    category: "polos",
    priceFrom: 59.9,
    blurb: "Corpo mescla, manga contrastada. Presença sem esforço.",
    description:
      "Modelagem raglan com manga e gola em cor contrastante. Ideal para times comerciais que querem um uniforme menos óbvio. Silk ou bordado no peito.",
    image: "/images/polo-raglan.jpg",
    gallery: ["/images/polo-raglan.jpg", "/mockups/polo-front.jpg"],
    colors: [
      { name: "Mescla / marinho", hex: "#8A8F96" },
      { name: "Branco / preto", hex: "#F4F1EA" },
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["bordado", "silk", "dtf"],
    fabric: "Malha piquet bicolor",
    customizable: true,
    garmentId: "polo",
  },
  {
    id: "moletom-canguru",
    slug: "moletom-canguru",
    name: "Moletom Canguru",
    category: "moletons",
    priceFrom: 129.9,
    blurb: "Flanelado interno, capuz e bolso. O moletom da equipe no inverno.",
    description:
      "Moletom 50/50 com felpa interna, capuz forrado e cordão. Recebe silk, DTF e bordado no peito acima do bolso. Pedido mínimo de 10 peças, cores sob consulta.",
    image: "/mockups/hoodie-front.jpg",
    gallery: ["/mockups/hoodie-front.jpg", "/mockups/hoodie-back.jpg", "/images/hoodie-burgundy.jpg"],
    colors: [
      { name: "Branco", hex: "#F4F1EA" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Vinho", hex: "#6B2B32" },
      { name: "Verde floresta", hex: "#1C3A2E" },
      { name: "Cinza", hex: "#6E6A64" },
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["silk", "dtf", "bordado"],
    fabric: "Moletom flanelado",
    customizable: true,
    garmentId: "hoodie",
  },
  {
    id: "moletom-vinho",
    slug: "moletom-vinho",
    name: "Moletom Vinho",
    category: "moletons",
    priceFrom: 134.9,
    blurb: "Vinho fechado, o tom que mais pedem no inverno.",
    description:
      "Mesma construção do canguru, no vinho que aparece em toda a nossa produção. Combina com bordado tom sobre tom ou DTF claro.",
    image: "/images/hoodie-burgundy.jpg",
    gallery: ["/images/hoodie-burgundy.jpg", "/mockups/hoodie-front.jpg"],
    colors: [
      { name: "Vinho", hex: "#6B2B32" },
      { name: "Preto", hex: "#1A1A1A" },
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["silk", "dtf", "bordado"],
    fabric: "Moletom flanelado",
    customizable: true,
    garmentId: "hoodie",
  },
  {
    id: "dry-fit",
    slug: "dry-fit-sport",
    name: "Dry Fit Sport",
    category: "esportivo",
    priceFrom: 49.9,
    blurb: "Poliamida com proteção UV. Para corrida, obra e campo.",
    description:
      "Camisa manga longa em dry fit, toque seco e proteção UV. A base certa para sublimação total ou DTF localizado. Usada em eventos, construtoras e times amadores.",
    image: "/images/dryfit-olive.jpg",
    gallery: ["/images/dryfit-olive.jpg", "/images/tech-sublimation.jpg"],
    colors: [
      { name: "Oliva", hex: "#4A5C3A" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Royal", hex: "#1E3A8A" },
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["sublimacao", "dtf"],
    fabric: "Poliamida dry fit UV",
    customizable: true,
    garmentId: "tshirt",
  },
  {
    id: "camisa-operacional",
    slug: "camisa-operacional",
    name: "Camisa Operacional",
    category: "uniformes",
    priceFrom: 79.9,
    blurb: "Dois bolsos, vivo contrastado. O uniforme que trabalha.",
    description:
      "Camisa manga longa em brim leve, dois bolsos com porta-caneta e vivo em cor da marca. Bordado no peito e nas costas. Feita para chão de fábrica, campo e frota.",
    image: "/images/workshirt-olive.jpg",
    gallery: ["/images/workshirt-olive.jpg", "/images/team-polos.jpg"],
    colors: [
      { name: "Verde oliva", hex: "#3D4F32" },
      { name: "Caqui", hex: "#8A7A55" },
      { name: "Marinho", hex: "#1B2A4A" },
    ],
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    techniques: ["bordado", "silk"],
    fabric: "Brim leve",
    customizable: true,
    garmentId: "polo",
  },
  {
    id: "jaqueta-college",
    slug: "jaqueta-college",
    name: "Jaqueta College",
    category: "moletons",
    priceFrom: 159.9,
    blurb: "Corpo creme, manga preta, punho listrado. O brinde que ninguém deixa no armário.",
    description:
      "Jaqueta estilo college em moletom, botões de pressão e punhos listrados. Bordado no peito e nas costas. Pedido mínimo de 10 peças.",
    image: "/images/varsity.jpg",
    gallery: ["/images/varsity.jpg", "/mockups/hoodie-front.jpg"],
    colors: [{ name: "Creme / preto", hex: "#E7DFD0" }],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["bordado", "dtf"],
    fabric: "Moletom college",
    customizable: true,
    garmentId: "hoodie",
  },
  {
    id: "avental",
    slug: "avental-gourmet",
    name: "Avental Gourmet",
    category: "hospitalidade",
    priceFrom: 44.9,
    blurb: "Peito alto, alça em couro. Para cozinha, padaria e café.",
    description:
      "Avental em brim pesado, alças reguláveis e opção de detalhe em couro. Bordado central ou silk da casa. Produzido para restaurantes e padarias da região e de fora.",
    image: "/images/apron.jpg",
    gallery: ["/images/apron.jpg", "/images/tech-embroidery.jpg"],
    colors: [
      { name: "Grafite", hex: "#3A3A38" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Oliva", hex: "#4A5C3A" },
    ],
    sizes: ["Único"],
    techniques: ["bordado", "silk"],
    fabric: "Brim pesado",
    customizable: false,
  },
  {
    id: "camiseta-time",
    slug: "camiseta-time",
    name: "Camisa de Time",
    category: "esportivo",
    priceFrom: 69.9,
    blurb: "Malha de jogo, gola contrastada. O uniforme do campeonato.",
    description:
      "Camisa esportiva em dry fit, gola e punho em ribana. Recebe sublimação total ou DTF de escudo e número. Pedido mínimo de 10, com opção de nome nas costas.",
    image: "/images/jersey.jpg",
    gallery: ["/images/jersey.jpg", "/images/team-jersey.jpg", "/images/dryfit-olive.jpg"],
    colors: [
      { name: "Verde floresta", hex: "#1C3A2E" },
      { name: "Royal", hex: "#1E3A8A" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Branco", hex: "#F4F1EA" },
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["sublimacao", "dtf"],
    fabric: "Dry fit de jogo",
    customizable: true,
    garmentId: "tshirt",
  },
  {
    id: "regata-cotton",
    slug: "regata-cotton",
    name: "Regata Cotton",
    category: "camisetas",
    priceFrom: 29.9,
    blurb: "Algodão leve, cava ampla. Evento, academia, verão.",
    description:
      "Regata 100% algodão, cava confortável e gola reforçada. Boa base para silk e DTF. Pedido mínimo de 10 peças.",
    image: "/images/tank.jpg",
    gallery: ["/images/tank.jpg", "/mockups/tshirt-front.jpg"],
    colors: [
      { name: "Creme", hex: "#F4F1EA" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Marinho", hex: "#1B2A4A" },
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    techniques: ["silk", "dtf"],
    fabric: "Algodão 30.1",
    customizable: true,
    garmentId: "tshirt",
  },
  {
    id: "bone-logo",
    slug: "bone-logo",
    name: "Boné Logo",
    category: "acessorios",
    priceFrom: 32.9,
    blurb: "Aba curva, fivela. O lugar certo para o bordado pequeno.",
    description:
      "Boné estruturado com aba curva e ajuste em fivela. Bordado frontal da marca. Fecha bem com polo ou camisa operacional. Pedido mínimo de 10.",
    image: "/images/cap.jpg",
    gallery: ["/images/cap.jpg", "/images/work-still.jpg", "/images/tech-embroidery.jpg"],
    colors: [
      { name: "Marinho", hex: "#1B2A4A" },
      { name: "Preto", hex: "#1A1A1A" },
      { name: "Verde floresta", hex: "#1C3A2E" },
      { name: "Khaki", hex: "#C4B49A" },
    ],
    sizes: ["Único"],
    techniques: ["bordado", "dtf"],
    fabric: "Sarja / lã mista",
    customizable: false,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function productsByCategory(id?: CategoryId | "todos") {
  if (!id || id === "todos") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === id);
}
