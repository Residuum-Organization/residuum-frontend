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
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#fbfbff] shadow-2xl">
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
    <footer className="grid h-[68px] w-full grid-cols-5 place-items-center rounded-b-[28px] bg-[#255b86] px-4 text-white">
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