import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "../styles.css?url";

const APP_NAME = "Nova Arte Uniformes";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://${host}/og.jpg`
  : "/og.jpg";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Nova Arte Uniformes — Camisetas e uniformes em Betim",
      },
      {
        name: "description",
        content:
          "Silk, DTF, bordado e sublimação. Personalize a camiseta da sua equipe e peça orçamento. Pedido mínimo de 10 peças, entrega para todo o Brasil.",
      },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: "#102551" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", href: "/brand/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Figtree:ital,wght@0,400..700;1,400..700&family=Montserrat:wght@500;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..600&family=Oswald:wght@400;600;700&family=Permanent+Marker&family=Playfair+Display:wght@600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#0c1733",
              border: "1px solid #d5dbe4",
            },
          }}
        />
        <Scripts />
      </body>
    </html>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center bg-paper px-6 text-center text-ink">
      <div>
        <p className="text-[0.72rem] tracking-[0.2em] text-moss uppercase">404</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Essa peça não está na grade</h1>
        <p className="mt-3 text-muted">O endereço não existe. Volte ao catálogo ou ao estúdio.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="rounded-md bg-forest px-5 py-2.5 text-sm text-cream">
            Início
          </Link>
          <Link to="/estudio" className="rounded-md border border-line px-5 py-2.5 text-sm">
            Estúdio
          </Link>
        </div>
      </div>
    </div>
  ),
});
