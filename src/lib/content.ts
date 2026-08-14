export const PROCESS = [
  {
    n: "01",
    title: "Escolha a peça",
    body: "Catálogo ou estúdio: camiseta, polo, moletom, dry fit, camisa de time, boné, avental. Cor e malha certas para o uso.",
  },
  {
    n: "02",
    title: "Manda a arte",
    body: "Sobe o logo no estúdio — o fundo sai sozinho se precisar — ou envia PNG, PDF ou AI no WhatsApp. Sem arte, desenhamos a aplicação.",
  },
  {
    n: "03",
    title: "Fecha a grade",
    body: "Tamanhos da equipe, mínimo de 10 peças. Confirmamos prazo, técnica e valor. 50% para iniciar, 50% na retirada ou envio.",
  },
  {
    n: "04",
    title: "Produz e entrega",
    body: "Silk, DTF, bordado ou sublimação. Retira em Betim ou mandamos para o Brasil e para fora.",
  },
];

export const LEAD_TIMES = [
  { kind: "Silk 1–2 cores", days: "7 a 10 dias úteis" },
  { kind: "DTF / foto", days: "8 a 12 dias úteis" },
  { kind: "Bordado", days: "10 a 15 dias úteis" },
  { kind: "Sublimação total", days: "12 a 18 dias úteis" },
  { kind: "Lote acima de 80 pç", days: "Combinado no orçamento" },
];

export const VOLUME_TIERS = [
  { qty: "10–19", note: "Preço de tabela" },
  { qty: "20–49", note: "Melhor custo por peça" },
  { qty: "50–99", note: "Desconto de volume" },
  { qty: "100+", note: "Condição de empresa" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Fecharam polo e avental da padaria no mesmo bordado. A reposição de dezembro veio igual à de março.",
    name: "Carla",
    role: "Padaria em Betim",
  },
  {
    quote:
      "Mandamos o escudo torto, em JPG. Eles limparam, posicionaram no peito e nas costas e mandaram a prévia antes de bordar.",
    name: "Rafael",
    role: "Time amador, Contagem",
  },
  {
    quote:
      "Obra em três cidades, mesma camisa operacional. Grade grande, prazo que cabia no cronograma.",
    name: "Helena",
    role: "Construtora, Grande BH",
  },
];

export const WORKS = [
  {
    src: "/images/team-polos.jpg",
    title: "Polos da equipe",
    tag: "Empresas",
  },
  {
    src: "/images/team-jersey.jpg",
    title: "Camisa de time",
    tag: "Esportivo",
  },
  {
    src: "/images/polos-stack.jpg",
    title: "Grade em várias cores",
    tag: "Catálogo",
  },
  {
    src: "/images/tech-embroidery.jpg",
    title: "Bordado no peito",
    tag: "Bordado",
  },
  {
    src: "/images/apron.jpg",
    title: "Avental de casa",
    tag: "Hospitalidade",
  },
  {
    src: "/images/hoodie-burgundy.jpg",
    title: "Moletom da temporada",
    tag: "Moletom",
  },
  {
    src: "/images/workshirt-olive.jpg",
    title: "Camisa operacional",
    tag: "Uniforme",
  },
  {
    src: "/images/work-still.jpg",
    title: "Lote na bancada",
    tag: "Produção",
  },
  {
    src: "/images/jersey.jpg",
    title: "Malha de jogo",
    tag: "Esportivo",
  },
];

export const SIZE_CHARTS = [
  {
    id: "camiseta",
    title: "Camiseta, polo e dry fit",
    hint: "Medida da peça estendida, em centímetros. Tolera ±2 cm.",
    cols: ["PP", "P", "M", "G", "GG", "XG"],
    rows: [
      { label: "Tórax", values: ["46", "50", "54", "58", "62", "66"] },
      { label: "Comprimento", values: ["64", "68", "72", "74", "76", "78"] },
      { label: "Manga", values: ["18", "19", "20", "21", "22", "23"] },
    ],
  },
  {
    id: "moletom",
    title: "Moletom e jaqueta",
    hint: "Cai um pouco mais folgado que a camiseta.",
    cols: ["P", "M", "G", "GG", "XG"],
    rows: [
      { label: "Tórax", values: ["54", "58", "62", "66", "70"] },
      { label: "Comprimento", values: ["68", "71", "74", "76", "78"] },
      { label: "Manga", values: ["60", "62", "64", "65", "66"] },
    ],
  },
  {
    id: "operacional",
    title: "Camisa operacional",
    hint: "Modelagem de trabalho. Se fica entre dois, peça o maior.",
    cols: ["P", "M", "G", "GG", "XG", "XXG"],
    rows: [
      { label: "Tórax", values: ["52", "56", "60", "64", "68", "72"] },
      { label: "Comprimento", values: ["72", "74", "76", "78", "80", "82"] },
    ],
  },
];
