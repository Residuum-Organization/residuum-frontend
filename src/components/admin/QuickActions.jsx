import React from "react";
import { MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SectionCard from "../ui/SectionCard";

const actions = [
  {
    title: "Gestao de pontos",
    description: "Acompanhar pontos e status de operação.",
    to: "/admin-pontos",
    Icon: MapPin,
    variant: "primary",
  },
  {
    title: "Usuários",
    description: "Gerenciar perfis e permissoes.",
    to: "/usuarios",
    Icon: Users,
    variant: "secondary",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <SectionCard
      className="mt-6"
      title="Ações rapidas"
      description="Atalhos para rotinas administrativas recorrentes."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map(({ title, description, to, Icon, variant }) => (
          <button
            key={to}
            type="button"
            className={`min-h-28 rounded-2xl border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
              variant === "primary"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] hover:border-[var(--color-primary)]/40"
            }`}
            onClick={() => navigate(to)}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            <h3 className="mt-4 text-base font-extrabold">{title}</h3>
            <p
              className={`mt-1 text-sm font-medium ${
                variant === "primary" ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
            >
              {description}
            </p>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
