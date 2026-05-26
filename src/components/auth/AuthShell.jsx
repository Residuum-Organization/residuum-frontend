import React from "react";
import Card from "../ui/Card";
import CardResiduum from "./CardResiduum";

const defaultHighlights = [
  "Cadastre dados essenciais em poucos passos",
  "Mantenha o fluxo de coleta claro para moradores e parceiros",
  "Centralize informações importantes em um cadastro seguro",
];

export default function AuthShell({
  title,
  subtitle,
  children,
  description = "O Residuum conecta moradores, pontos de coleta e parceiros para transformar descarte em impacto positivo.",
  highlights = defaultHighlights,
  footer = '"Dados organizados tornam a coleta mais simples, rastreável e sustentável."',
  minHeight = "lg:min-h-[650px]",
}) {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <Card className="mx-auto w-full max-w-md border-0 p-6 shadow-xl sm:p-8 lg:max-w-6xl lg:p-0">
        <div className={`lg:flex ${minHeight} lg:items-stretch`}>
          <CardResiduum
            description={description}
            highlights={highlights}
            footer={footer}
          />

          <div className="hidden lg:block lg:w-px lg:bg-slate-200" />

          <section className="lg:w-1/2 lg:p-10">
            <div className="mb-6 text-center lg:hidden">
              <img
                src="/logo.jpeg"
                alt="Logo Residuum"
                className="mx-auto h-14 w-14 object-contain"
              />
              <h1 className="mt-2 text-3xl font-bold text-[var(--color-welcome-blue)]">
                Residuum
              </h1>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[var(--color-welcome-blue)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-[var(--color-welcome-muted)]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {children}
          </section>
        </div>
      </Card>
    </main>
  );
}
