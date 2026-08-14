import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacidade")({ component: Privacidade });

function Privacidade() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-8">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Privacidade
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">
          O que fazemos com o que você nos manda.
        </h1>
        <div className="mt-8 space-y-5 text-ink-soft">
          <p>
            A Nova Arte Uniformes, em {SITE.city}, usa nome, telefone, empresa e
            arquivos de arte só para orçar, produzir e entregar o pedido.
          </p>
          <p>
            Não vendemos lista. O logo fica guardado para reposição da mesma
            equipe, se você pedir. WhatsApp e Instagram seguem as regras dessas
            plataformas.
          </p>
          <p>
            Para apagar um arquivo ou um dado, escreva para {SITE.phoneDisplay}.
          </p>
        </div>
      </article>
    </SiteShell>
  );
}
