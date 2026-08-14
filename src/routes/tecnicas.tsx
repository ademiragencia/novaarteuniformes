import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tecnicas")({ component: Tecnicas });

const ITEMS = [
  {
    id: "silk",
    title: "Silk",
    image: "/images/tech-silk.jpg",
    lead: "Tinta que entra na malha. O caminho mais honesto para volume.",
    body: "Tela, fotolito e tinta. Cada cor é uma passagem. Em pedidos grandes, o silk ainda é o melhor custo e a lavagem mais estável. Indicado para 1 a 4 cores chapadas em camiseta e polo.",
  },
  {
    id: "dtf",
    title: "DTF",
    image: "/images/tech-dtf.jpg",
    lead: "Filme que carrega foto, degradê e cor cheia.",
    body: "A arte sai em filme, recebe pó e vai à prensa. Não precisa de tela por cor. Ideal para marcas com muitos detalhes, fotos de time e lotes médios. Funciona em algodão e misturas.",
  },
  {
    id: "bordado",
    title: "Bordado",
    image: "/images/tech-embroidery.jpg",
    lead: "Linha, relevo, presença. O acabamento da polo séria.",
    body: "O logo vira ponto. No peito, na manga, na gola. É o que mais pedem para uniforme corporativo — aguenta lavação industrial e envelhece com dignidade. Arte vetorial fecha melhor.",
  },
  {
    id: "sublimacao",
    title: "Sublimação",
    image: "/images/tech-sublimation.jpg",
    lead: "A peça inteira vira a arte. Dry fit e poliéster.",
    body: "A tinta vira gás e entra na fibra. Não craquela, não descasca. É a técnica dos times, das caminhadas e das camisas de evento com fundo cheio. Só funciona em tecido claro de poliéster.",
  },
];

function Tecnicas() {
  return (
    <SiteShell>
      <div className="px-4 pt-12 pb-8 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Oficinas
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
          Quatro jeitos de colocar a marca no tecido.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          A técnica certa depende da malha, do volume e de quanto a arte precisa
          viver. A gente indica no orçamento — você também pode escolher no estúdio.
        </p>
      </div>
      <div className="flex flex-col">
        {ITEMS.map((item, i) => (
          <article
            key={item.id}
            className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>img]:order-2" : ""}`}
          >
            <img src={item.image} alt={item.title} className="h-72 w-full object-cover lg:h-[28rem]" />
            <div className="flex flex-col justify-center px-4 py-12 sm:px-10">
              <p className="font-display text-4xl tracking-tight">{item.title}</p>
              <p className="mt-3 text-lg text-ink-soft">{item.lead}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="px-4 py-16 text-center sm:px-8">
        <Button asChild size="lg">
          <Link to="/estudio">Provar no estúdio</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
