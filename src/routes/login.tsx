import { Link, createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-10 font-display text-3xl tracking-tight">Entrar</h1>
        <p className="mt-2 text-sm text-muted">
          Guarde seus orçamentos e volte ao estúdio de onde parou.
        </p>
        <div className="mt-8 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continuar com {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">O acesso está desligado neste ambiente.</p>
          )}
        </div>
        <Link to="/" className="mt-8 inline-block text-sm text-muted hover:text-ink">
          Voltar à loja
        </Link>
      </div>
    </main>
  );
}
