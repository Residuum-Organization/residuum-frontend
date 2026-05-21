import React from "react";
import Button from "../components/ui/Button";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8 md:h-[calc(100dvh-4.5rem)] md:overflow-hidden md:py-4">
      <section className="mx-auto flex w-full max-w-md flex-col rounded-3xl bg-[var(--color-welcome-surface)] px-5 py-8 sm:max-w-lg sm:px-8 md:h-full md:justify-between md:py-6">
        <h1 className="text-2xl font-extrabold leading-tight text-[var(--color-welcome-blue)]">
          Boas vindas ao XXXXXXX seu sistema inteligente de coleta!
        </h1>

        <p className="mt-5 text-base font-semibold leading-relaxed text-[var(--color-welcome-muted)] sm:text-lg">
          Agora e facil visualizar os pontos de coleta em sua regiao. Juntos,
          estamos construindo comunidades mais limpas e sustentaveis.
        </p>

        <img
          src="/2-people.png"
          alt="Pessoas colaborando com coleta seletiva"
          className="mx-auto mt-8 w-full max-w-xs object-contain sm:max-w-sm"
        />

        <div className="mt-9 space-y-4">
          <Button
            variant="welcomeBlue"
            className="h-14 w-full rounded-full text-lg font-semibold sm:h-16 sm:text-xl"
          >
            Entrar como morador
          </Button>

          <div className="flex w-full items-center gap-3 text-[var(--color-welcome-muted)]">
            <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
            <span className="shrink-0 text-lg font-semibold leading-none sm:text-xl">ou</span>
            <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
          </div>

          <Button
            variant="welcomeGray"
            className="h-14 w-full rounded-full border-2 text-lg font-semibold sm:h-16 sm:text-xl"
          >
            Entrar como funcionário
          </Button>

          <Button
            variant="welcomeGray"
            className="h-14 w-full rounded-full border-2 text-lg font-semibold sm:h-16 sm:text-xl"
          >
            Entrar como ponto de coleta
          </Button>
        </div>
      </section>
    </main>
  );
}
