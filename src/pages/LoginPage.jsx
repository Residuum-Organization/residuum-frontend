import React from "react";
import Card from "../components/ui/Card";
import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <div className="mx-auto w-full max-w-md lg:max-w-6xl">
        <Card className="border-0 p-6 text-slate-900 shadow-xl sm:p-8 lg:p-0">
          <div className="lg:flex lg:min-h-[620px] lg:items-stretch">
            <section className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:rounded-l-3xl lg:bg-[var(--color-welcome-blue)] lg:p-10 lg:text-white">
              <div>
                <img
                  src="/residuum-logo.png"
                  alt="Residuum"
                  className="h-16 w-16 object-contain"
                />
                <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
                  Residuum
                </h2>
                <p className="mt-4 max-w-sm text-base font-semibold leading-relaxed text-white/90">
                  Transforme descarte em impacto positivo. O Residuum conecta
                  voce aos pontos de coleta e simplifica a reciclagem no dia a
                  dia.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-white/95">
                  <li className="rounded-xl border-l-2 border-white/60 bg-white/10 px-4 py-3">
                    Encontre pontos de coleta proximos em segundos
                  </li>
                  <li className="rounded-xl border-l-2 border-white/60 bg-white/10 px-4 py-3">
                    Registre seus descartes com poucos cliques
                  </li>
                  <li className="rounded-xl border-l-2 border-white/60 bg-white/10 px-4 py-3">
                    Acompanhe seu impacto ambiental ao longo do tempo
                  </li>
                </ul>
              </div>

              <div className="mt-8 rounded-xl border border-white/25 bg-white/10 px-4 py-4">
                <p className="text-sm leading-relaxed text-white/90">
                  "Pequenas escolhas diarias geram grandes transformacoes para a
                  cidade e para o planeta."
                </p>
              </div>
            </section>

            <div className="hidden lg:block lg:w-px lg:bg-slate-200" />

            <section className="lg:w-1/2 lg:p-10">
              <div className="mx-auto mb-6 flex w-full max-w-xs flex-col items-center text-center sm:mb-7 lg:hidden">
                <img
                  src="/residuum-logo.png"
                  alt="Logo Residuum"
                  className="h-16 w-16 object-contain"
                />
                <h1 className="mt-3 text-3xl font-bold text-[var(--color-welcome-blue)]">
                  Residuum
                </h1>
              </div>

              <div className="mb-6 hidden lg:block">
                <h1 className="text-3xl font-bold text-[var(--color-welcome-blue)]">
                  Entrar
                </h1>
                <p className="mt-2 text-sm text-[var(--color-welcome-muted)]">
                  Acesse sua conta para continuar.
                </p>
              </div>

              <LoginForm />
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
