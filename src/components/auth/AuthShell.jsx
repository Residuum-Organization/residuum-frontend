import React from "react";
import Card from "../ui/Card";

const defaultHighlights = [
  "Cadastre dados essenciais em poucos passos",
  "Mantenha o fluxo de coleta claro para moradores e parceiros",
  "Centralize informacoes importantes em um cadastro seguro",
];

export default function AuthShell({
  title,
  subtitle,
  children,
  description = "O Residuum conecta moradores, pontos de coleta e parceiros para transformar descarte em impacto positivo.",
  highlights = defaultHighlights,
  footer = '"Dados organizados tornam a coleta mais simples, rastreavel e sustentavel."',
  showHighlights = true,
}) {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-5 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(26rem,1fr)] lg:items-stretch">
        {showHighlights ? (
          <aside className="hidden rounded-2xl border border-[var(--color-border)] bg-white p-7 shadow-sm shadow-slate-200/70 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                Residuum
              </div>

              <h2 className="mt-6 text-3xl font-bold leading-tight text-[var(--color-primary)]">
                Reciclagem mais simples para todos.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
                {description}
              </p>

              <ul className="mt-6 space-y-3">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm font-semibold leading-relaxed text-[var(--color-text)]"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">
              {footer}
            </p>
          </aside>
        ) : null}

        <Card className="mx-auto w-full max-w-md border-0 p-5 shadow-sm sm:p-8 lg:max-w-none">
          <section>
            <div className="mb-5 text-center sm:mb-6">
              <img
                src="/logo.jpeg"
                alt="Logo Residuum"
                className="mx-auto h-14 w-14 object-contain sm:h-16 sm:w-16"
              />
              <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]">
                Residuum
              </p>
            </div>

            <div className="mb-5 rounded-2xl bg-[var(--color-primary)]/5 p-4 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)] lg:hidden">
              {description}
            </div>

            <div className="mb-5 sm:mb-6">
              <h1 className="text-2xl font-bold leading-tight text-[var(--color-primary)] sm:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-welcome-muted)]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {children}
          </section>
        </Card>
      </div>
    </main>
  );
}
