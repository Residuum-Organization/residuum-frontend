import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { getRoleHome } from "../utils/roles";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [view, setView] = useState('initial'); // 'initial' | 'register'

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleHome(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-5 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.8fr)] lg:items-center lg:gap-10 relative">
        <button
          onClick={() => {
            if (view === 'register') setView('initial');
            else navigate("/");
          }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="mt-8 sm:mt-6 lg:mt-0">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            Residuum
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-[var(--color-primary)] sm:text-4xl lg:text-5xl">
            Boas vindas ao Residuum
          </h1>

          <p className="mt-4 text-base font-semibold leading-relaxed text-[var(--color-welcome-muted)] sm:text-lg">
            Seu sistema inteligente de coleta. Veja pontos de coleta na sua
            região e participe de uma cidade mais limpa e sustentável.
          </p>
        </div>

        <img
          src="/2-people.png"
          alt="Pessoas colaborando com coleta seletiva"
          className="mx-auto w-full max-w-[13rem] object-contain sm:max-w-xs lg:max-w-sm"
        />

        <div className="space-y-3 sm:space-y-4 lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-md">
          {view === 'initial' ? (
            <>
              <Button
                variant="brandPrimary"
                onClick={() => navigate("/login")}
                className="h-14 w-full rounded-full text-base font-semibold sm:h-16 sm:text-lg"
              >
                Entrar na minha conta
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
                onClick={() => setView('register')}
                className="h-14 w-full rounded-full border-2 text-base font-semibold sm:h-16 sm:text-lg"
              >
                Cadastrar-se
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-center font-bold text-[var(--color-primary)] mb-4 text-xl">Como deseja se cadastrar?</h3>
              <Button
                variant="brandPrimary"
                onClick={() => navigate("/cadastro")}
                className="h-14 w-full rounded-full text-base font-semibold sm:h-16 sm:text-lg"
              >
                Quero reciclar e pontuar
              </Button>

              <Button
                variant="brandOutline"
                onClick={() => navigate("/cadastro-ponto-coleta")}
                className="h-14 w-full rounded-full border-2 text-base font-semibold sm:h-16 sm:text-lg mt-3"
              >
                Quero ter um ponto de coleta
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
