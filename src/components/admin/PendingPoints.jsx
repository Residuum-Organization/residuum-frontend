import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, X } from "lucide-react";
import Badge from "../ui/Badge";
import SectionCard from "../ui/SectionCard";
import {
  listPendingCollectionPoints,
  approveCollectionPoint,
  rejectCollectionPoint,
} from "../../services/admin";

export default function PendingPoints() {
  const queryClient = useQueryClient();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["pendingCollectionPoints"],
    queryFn: listPendingCollectionPoints,
  });

  const points = responseData?.itens || [];

  const approveMutation = useMutation({
    mutationFn: (id) => approveCollectionPoint(id, "Aprovado via dashboard"),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingCollectionPoints"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectCollectionPoint(id, "Rejeitado via dashboard"),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingCollectionPoints"]);
    },
  });

  return (
    <SectionCard
      className="mt-6"
      title="Pontos pendentes"
      description="Fila de análise e aprovação de novos pontos de coleta."
      action={<Badge variant="warning">{points.length} Pendente(s)</Badge>}
    >
      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)]">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-[var(--color-primary)]">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : points.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-sm text-[var(--color-text-muted)]">
            Nenhuma solicitação pendente no momento.
          </div>
        ) : (
          points.map((point) => (
            <div
              key={point.id}
              className="flex flex-col gap-3 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="truncate text-base font-extrabold text-[var(--color-primary)]">
                  {point.nome_ponto}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                  {point.tipos_residuos_aceitos?.join(", ")}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {point.responsavel_nome} • {point.endereco}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => rejectMutation.mutate(point.id)}
                  disabled={
                    rejectMutation.isPending || approveMutation.isPending
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200 disabled:opacity-50"
                  title="Rejeitar"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={() => approveMutation.mutate(point.id)}
                  disabled={
                    approveMutation.isPending || rejectMutation.isPending
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition hover:bg-emerald-200 disabled:opacity-50"
                  title="Aprovar"
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
