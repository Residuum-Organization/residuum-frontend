import React from "react";

import Badge from "../ui/Badge";
import SectionCard from "../ui/SectionCard";

const points = [
  {
    name: "Eco Ponto Centro",
    materials: "Plastico, metal e papel",
    status: "Pendente",
    variant: "warning",
  },
  {
    name: "Coleta Norte",
    materials: "Vidro e aluminio",
    status: "Revisar",
    variant: "success",
  },
];

export default function PendingPoints() {
  return (
    <SectionCard
      className="mt-6"
      title="Pontos pendentes"
      description="Amostra visual para acompanhamento da fila de analise."
      action={<Badge variant="warning">Demonstrativo</Badge>}
    >
      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)]">
        {points.map((point) => (
          <div
            key={point.name}
            className="flex flex-col gap-3 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-[var(--color-primary)]">
                {point.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                {point.materials}
              </p>
            </div>
            <Badge variant={point.variant}>{point.status}</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
