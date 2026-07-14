import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";

import Badge from "../ui/Badge";
import SectionCard from "../ui/SectionCard";
import { getAdminPoints } from "../../services/admin";

export default function ActivePoints() {
  const { data: ocupacaoData = [], isLoading } = useQuery({
    queryKey: ["adminPointsOcupacao"],
    queryFn: getAdminPoints,
  });

  const activePoints = useMemo(() => {
    if (!ocupacaoData.length) return [];

    // Sort by total inventory (highest first) and take top 2
    return [...ocupacaoData]
      .sort((a, b) => (b.total_inventario || 0) - (a.total_inventario || 0))
      .slice(0, 2)
      .map((ponto, index) => ({
        id: ponto.ponto_coleta_id,
        name: ponto.nome,
        deliveries: `${ponto.total_inventario} kg arrecadados`,
        rank: `#${index + 1}`,
      }));
  }, [ocupacaoData]);

  if (isLoading) {
    return (
      <SectionCard
        className="mt-6"
        title="Top Pontos de Coleta"
        description="Os pontos com maior volume de resíduos arrecadados."
      >
        <div className="p-4 text-center text-sm text-slate-500">
          Carregando...
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      className="mt-6"
      title="Top Pontos de Coleta"
      description="Os pontos com maior volume de resíduos arrecadados."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {activePoints.length === 0 ? (
          <div className="col-span-2 p-6 text-center rounded-2xl border border-dashed border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">Ainda não há arrecadações suficientes para gerar o ranking.</p>
          </div>
        ) : (
          activePoints.map((point) => (
            <div
              key={point.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-accent)] shadow-sm">
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                </span>
                <Badge variant="success">{point.rank}</Badge>
              </div>

              <h3 className="mt-4 text-base font-extrabold text-[var(--color-primary)]">
                {point.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                {point.deliveries}
              </p>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
