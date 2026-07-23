import React from "react";
import { Gift, MapPin, Recycle, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../../services/admin";
import Badge from "../ui/Badge";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

export default function AdminStats() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return <LoadingState title="Carregando indicadores..." size="sm" />;
  }

  if (isError) {
    return <ErrorState title="Falha ao carregar indicadores" actionLabel="Tentar novamente" onAction={() => refetch()} />;
  }

  const stats = [
    { label: "Usuários", value: data?.usuarios?.total ?? "N/A", Icon: Users },
    { label: "Pontos", value: data?.pontos_coleta?.total ?? "N/A", Icon: MapPin },
    { label: "Volume (kg)", value: data?.descartes?.kg_confirmados ?? "N/A", Icon: Recycle },
    { label: "Pontos Distribuídos", value: data?.gamificacao?.pontos_distribuidos ?? "N/A", Icon: Gift },
  ];

  return (
    <section className="mt-6" aria-labelledby="admin-stats-title">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="admin-stats-title"
          className="text-base font-extrabold text-[var(--color-primary)]"
        >
          Indicadores principais
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6 rounded-2xl min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#1A2C71]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-slate-600 text-sm font-semibold">{label}</span>
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#1A2C71] break-words">
              {value}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
}
