import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-5 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.8fr)] lg:items-center lg:gap-10">
        <div>
          <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            Residuum
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-[var(--color-primary)] sm:text-4xl lg:text-5xl">
            Boas vindas ao Residuum
          </h1>

          <p className="mt-4 text-base font-semibold leading-relaxed text-[var(--color-welcome-muted)] sm:text-lg">
            Seu sistema inteligente de coleta. Veja pontos de coleta na sua
            regiao e participe de uma cidade mais limpa e sustentavel.
          </p>
        </div>

        <img
          src="/2-people.png"
          alt="Pessoas colaborando com coleta seletiva"
          className="mx-auto w-full max-w-[13rem] object-contain sm:max-w-xs lg:max-w-sm"
        />

        <div className="space-y-3 sm:space-y-4 lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-md">
          <Button
            variant="brandPrimary"
            onClick={() => navigate("/login")}
            className="h-14 w-full rounded-full text-base font-semibold sm:h-16 sm:text-lg"
          >
            Entrar como morador
          </Button>

          <div className="flex w-full items-center gap-2.5 text-[var(--color-welcome-muted)] sm:gap-3">
            <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
            <span className="shrink-0 text-base font-semibold leading-none sm:text-lg">
              ou
            </span>
            <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
          </div>

          <Button
            variant="brandOutline"
            onClick={() => navigate("/admin")}
            className="h-14 w-full rounded-full border-2 text-base font-semibold sm:h-16 sm:text-lg"
          >
            Entrar como funcionario
          </Button>

          <Button
            variant="brandOutline"
            onClick={() => navigate("/cadastro-ponto-coleta")}
            className="h-14 w-full rounded-full border-2 text-base font-semibold sm:h-16 sm:text-lg"
          >
            Entrar como ponto de coleta
          </Button>
        </div>
      </section>
    </main>
  );
}
