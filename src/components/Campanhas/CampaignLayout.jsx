import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CircleCheck,
  LayoutGrid,
  MapPin,
  Megaphone,
  UsersRound,
} from "lucide-react";
import PageContainer from "../layout/PageContainer";

export default function CampaignLayout({ children }) {
  return (
    <PageContainer
      className="bg-[var(--color-surface-soft)]"
      innerClassName="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm"
    >
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </div>

      <MenuInferior />
    </PageContainer>
  );
}

export function LogoResiduum() {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[var(--color-border)] bg-white shadow-sm sm:h-14 sm:w-14">
      <img
        src="/logo.jpeg"
        alt="Residuum"
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
      />
    </div>
  );
}

export function BotaoVoltar({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-3 text-sm font-bold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Voltar
    </button>
  );
}

export function MenuInferior() {
  const itens = [
    { to: "/admin", label: "Admin", Icon: LayoutGrid },
    { to: "/campanhas", label: "Campanhas", Icon: CircleCheck, active: true },
    { to: "/mapa", label: "Mapa", Icon: MapPin },
    { to: "/usuarios", label: "Usuarios", Icon: UsersRound },
    { to: "/aprovacao", label: "Avisos", Icon: Megaphone },
  ];

  return (
    <footer className="grid min-h-[72px] w-full grid-cols-5 place-items-center border-t border-[var(--color-border)] bg-[var(--color-primary)] px-2 text-white sm:px-4">
      {itens.map(({ to, label, Icon, active }) => (
        <Link
          key={to}
          to={to}
          className={`grid min-h-12 min-w-12 place-items-center rounded-2xl px-2 text-white transition active:scale-95 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
            active ? "bg-white/20" : "hover:bg-white/10"
          }`}
          aria-label={label}
        >
          <Icon size={24} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      ))}
    </footer>
  );
}
