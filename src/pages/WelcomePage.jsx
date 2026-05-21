import React from "react";
import Button from "../components/ui/Button";

export default function WelcomePage() {
  return (
    <main className="h-dvh overflow-hidden bg-[var(--color-welcome-surface)] px-4 py-4 sm:px-6 sm:py-5">
      <section className="mx-auto flex h-full w-full max-w-md flex-col justify-between rounded-3xl bg-[var(--color-welcome-surface)] px-5 py-5 sm:max-w-lg sm:px-8 sm:py-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold leading-tight text-[var(--color-welcome-blue)] sm:text-[1.65rem]">
            Boas vindas ao Residuum seu sistema inteligente de coleta!
          </h1>

          <p className="text-base font-semibold leading-relaxed text-[var(--color-welcome-muted)] sm:text-lg">
            Agora e facil visualizar os pontos de coleta em sua regiao. Juntos,
            estamos construindo comunidades mais limpas e sustentaveis.
          </p>
        </div>

        <img
          src="/2-people.png"
          alt="Pessoas colaborando com coleta seletiva"
          className="mx-auto mt-5 w-full max-w-[14rem] object-contain sm:mt-6 sm:max-w-xs md:max-w-[17rem]"
        />

        <div className="mt-6 space-y-3 sm:mt-7 sm:space-y-4">
          <Button
            variant="brandPrimary"
            className="h-14 w-full rounded-full text-lg font-semibold sm:h-16 sm:text-xl"
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
            className="h-14 w-full rounded-full border-2 text-lg font-semibold sm:h-16 sm:text-xl"
          >
            Entrar como funcionário
          </Button>

          <Button
            variant="brandOutline"
            className="h-14 w-full rounded-full border-2 text-lg font-semibold sm:h-16 sm:text-xl"
          >
            Entrar como ponto de coleta
          </Button>
        </div>
      </section>
    </main>
  );
}
