import React from "react";
import {
  CircleCheck,
  LayoutGrid,
  MapPin,
  Megaphone,
  UsersRound,
} from "lucide-react";

export default function CampaignLayout({ children }) {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-3 py-4 sm:px-5 lg:px-8">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-2xl bg-[#fbfbff] shadow-sm sm:min-h-[760px] lg:min-h-[calc(100vh-2rem)]">
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
          {children}
        </div>

        <MenuInferior />
      </section>
    </main>
  );
}

export function LogoResiduum() {
  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white shadow-md shadow-slate-300/70">
      <img
        src="/logo.jpeg"
        alt="Residuum"
        className="h-10 w-10 object-contain"
      />
    </div>
  );
}

export function BotaoVoltar({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 text-[13px] font-black text-[#241aa3] transition hover:text-[#3020a0]"
    >
      ← Voltar
    </button>
  );
}

export function MenuInferior() {
  return (
    <footer className="grid min-h-[68px] w-full grid-cols-5 place-items-center rounded-b-2xl bg-[var(--color-primary)] px-3 text-white sm:px-4">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-white/90 transition active:scale-95"
        aria-label="Menu"
      >
        <LayoutGrid size={26} strokeWidth={2.4} />
      </button>

      <button
        type="button"
        className="grid h-10 w-[74px] place-items-center rounded-full bg-white/20 text-white transition active:scale-95"
        aria-label="Campanhas"
      >
        <CircleCheck size={27} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-white/90 transition active:scale-95"
        aria-label="Mapa"
      >
        <MapPin size={27} strokeWidth={2.4} />
      </button>

      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-white/90 transition active:scale-95"
        aria-label="Usuários"
      >
        <UsersRound size={28} strokeWidth={2.4} />
      </button>

      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-white/90 transition active:scale-95"
        aria-label="Avisos"
      >
        <Megaphone size={27} strokeWidth={2.4} />
      </button>
    </footer>
  );
}
