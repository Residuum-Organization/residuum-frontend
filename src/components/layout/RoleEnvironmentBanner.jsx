import React from "react";
import { CalendarDays, Home, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { getRoleHome, getRoleLabel } from "../../utils/roles";

const environmentCopy = {
  admin: {
    title: "Ambiente administrativo",
    description: "Gerencie usuarios, pontos, campanhas e regras da plataforma.",
    actions: [{ label: "Painel admin", to: "/admin", Icon: ShieldCheck }],
  },
  operacional: {
    title: "Ambiente operacional de coleta",
    description: "Acompanhe pontos, agenda, coletas e confirmacoes operacionais.",
    actions: [
      { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard },
      { label: "Agenda", to: "/schedule", Icon: CalendarDays },
    ],
  },
  morador: {
    title: "Ambiente do morador",
    description: "Cadastre residuos, valide entregas e acompanhe seu extrato.",
    actions: [{ label: "Inicio", to: "/inicio", Icon: Home }],
  },
};

export default function RoleEnvironmentBanner({ variant = "morador", className = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const copy = environmentCopy[variant] || environmentCopy.morador;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <section
      className={`flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
      aria-label={copy.title}
    >
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--color-accent)]">
          {copy.title}
        </p>
        <h2 className="mt-1 text-base font-extrabold text-[var(--color-primary)]">
          Perfil atual: {getRoleLabel(user?.role)}
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
          {copy.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        {copy.actions.map(({ label, to, Icon }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to || getRoleHome(user?.role))}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] px-3 text-sm font-bold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-700 transition hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-200"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </button>
      </div>
    </section>
  );
}
