import { SITE } from "@/lib/site";

export function WhatsappFab() {
  return (
    <a
      href={`https://wa.me/${SITE.phoneE164}?text=${encodeURIComponent("Olá, quero um orçamento de uniformes.")}`}
      className="fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-forest px-4 text-sm font-medium text-cream shadow-lg shadow-ink/15 hover:bg-forest-soft sm:right-6 sm:bottom-6"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.08 6.45 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.49 0 9.96-4.45 9.96-9.94 0-2.65-1.03-5.14-2.96-7zM12.05 20.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.26-4.3c0-4.53 3.7-8.21 8.25-8.21 2.2 0 4.27.86 5.82 2.42a8.15 8.15 0 0 1 2.42 5.8c0 4.53-3.7 8.15-8.25 8.15m4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29" />
      </svg>
      <span className="hidden sm:inline">Orçamento</span>
    </a>
  );
}
