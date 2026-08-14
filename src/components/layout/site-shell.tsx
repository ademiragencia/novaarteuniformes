import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { WhatsappFab } from "./whatsapp-fab";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
    </div>
  );
}
