import React from "react";
import Card from "../components/ui/Card";
import LoginForm from "../components/forms/LoginForm";
import CardResiduum from "../components/auth/CardResiduum";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <div className="mx-auto w-full max-w-md lg:max-w-6xl">
        <Card className="border-0 p-6 text-slate-900 shadow-xl sm:p-8 lg:p-0">
          <div className="lg:flex lg:min-h-[620px] lg:items-stretch">
            <CardResiduum
              description="Transforme descarte em impacto positivo. O Residuum conecta voce aos pontos de coleta e simplifica a reciclagem no dia a dia."
              highlights={[
                "Encontre pontos de coleta proximos em segundos",
                "Registre seus descartes com poucos cliques",
                "Acompanhe seu impacto ambiental ao longo do tempo",
              ]}
              footer='"Pequenas escolhas diarias geram grandes transformacoes para a cidade e para o planeta."'
            />

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
