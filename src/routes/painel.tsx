import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureAdmin, listQuotes, type QuoteRow } from "@/lib/painel";

export const Route = createFileRoute("/painel")({ component: Painel });

function Painel() {
  const { user, isPending } = useCurrentUserState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureAdmin()
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  if (isPending || !ready) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper text-sm text-muted">
        Carregando o painel…
      </main>
    );
  }

  if (!user) return <PainelLogin />;
  return <PainelHome email={user.primaryEmail} />;
}

function PainelLogin() {
  const [email, setEmail] = useState("admin@novaarte.com.br");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe: true,
      });
      if (error) throw new Error(error.message ?? "Não foi possível entrar.");
      const token =
        data && typeof data === "object" && "token" in data && typeof data.token === "string"
          ? data.token
          : null;
      if (token) {
        try {
          sessionStorage.setItem("grok-auth.bearer-token", token);
        } catch {
          /* ignore */
        }
      }
      await authClient.getSession();
      window.location.assign("/painel");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login recusado.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-8 font-display text-3xl tracking-tight">Painel</h1>
        <p className="mt-2 text-sm text-muted">Acesso interno da produção. A loja não tem login.</p>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              className="mt-1.5"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              className="mt-1.5"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <Link to="/" className="mt-8 inline-block text-sm text-muted hover:text-ink">
          Voltar à loja
        </Link>
      </div>
    </main>
  );
}

function PainelHome({ email }: { email: string | null }) {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void listQuotes()
      .then(setQuotes)
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : "Erro ao ler orçamentos."));
  }, []);

  return (
    <main className="min-h-dvh bg-paper">
      <header className="flex items-center justify-between gap-4 border-b border-line bg-canvas px-4 py-3 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted sm:inline">{email}</span>
          <Button variant="outline" size="sm" onClick={() => void signOut("/painel")}>
            Sair
          </Button>
        </div>
      </header>
      <div className="px-4 py-10 sm:px-8 lg:px-12">
        <p className="text-[0.72rem] font-medium tracking-[0.2em] text-moss uppercase">
          Produção
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Painel Nova Arte</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Orçamentos que saem do estúdio e do WhatsApp ficam aqui.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-xs tracking-wide text-muted uppercase">Orçamentos</p>
            <p className="mt-2 font-display text-3xl">{quotes.length}</p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-xs tracking-wide text-muted uppercase">Mínimo</p>
            <p className="mt-2 font-display text-3xl">10 pç</p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-xs tracking-wide text-muted uppercase">Loja</p>
            <Link to="/" className="mt-3 inline-block text-sm text-forest hover:underline">
              Abrir o site
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Últimos orçamentos</h2>
          {err && <p className="mt-3 text-sm text-danger">{err}</p>}
          {!err && quotes.length === 0 && (
            <p className="mt-4 max-w-lg text-sm text-muted">
              Ainda não chegou nenhum. Quando o cliente pede orçamento no estúdio,
              o registro aparece nesta lista.
            </p>
          )}
          {quotes.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-canvas">
              <table className="w-full min-w-[48rem] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    <th className="px-4 py-3 font-medium">Quando</th>
                    <th className="px-4 py-3 font-medium">Quem</th>
                    <th className="px-4 py-3 font-medium">Peça</th>
                    <th className="px-4 py-3 font-medium">Qtd</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b border-line last:border-0 align-top">
                      <td className="px-4 py-3 text-muted">
                        {q.created_at
                          ? new Date(q.created_at).toLocaleString("pt-BR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {q.name || q.company || "—"}
                        {q.company && q.name && q.company !== q.name ? (
                          <span className="block text-xs text-muted">{q.company}</span>
                        ) : null}
                        {q.phone ? (
                          <span className="block text-xs text-muted">{q.phone}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {q.peca || "—"}
                        {q.color || q.technique ? (
                          <span className="block text-xs text-muted">
                            {[q.color, q.technique].filter(Boolean).join(" · ")}
                          </span>
                        ) : null}
                        {q.notes ? (
                          <span className="mt-1 block max-w-xs text-xs text-muted">{q.notes}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{q.qty || "—"}</td>
                      <td className="px-4 py-3">{q.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
