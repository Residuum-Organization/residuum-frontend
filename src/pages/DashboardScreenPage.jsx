import React from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import PieChart from "../components/dashboard/PieChart";
import { getCollectionPointDashboard } from "../services/collectionPointDashboard";
import { queryKeys } from "../services/queryKeys";

export default function DashboardScreen() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.collectionPointDashboard,
    queryFn: getCollectionPointDashboard,
  });

  const statCards = data?.statCards || [];
  const row1 = statCards.slice(0, 2);
  const row2 = statCards.slice(2, 4);
  const hasLoaded = !isLoading && !isError;
  const hasOperationalData = Boolean(data?.hasOperationalData);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-3 py-4 sm:px-5 lg:px-8">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-2xl bg-[var(--color-surface-soft)] shadow-sm sm:min-h-[760px] lg:min-h-[calc(100vh-2rem)]">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
          {isLoading ? (
            <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-500 shadow-sm">
              Carregando painel do ponto...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <p className="text-base font-extrabold text-slate-800">
                Não foi possível carregar os dados operacionais do dashboard.
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Verifique se o servidor está disponível e tente novamente.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                {isFetching ? "Tentando novamente..." : "Tentar novamente"}
              </button>
            </div>
          ) : null}

          {hasLoaded && !hasOperationalData ? (
            <div className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-500 shadow-sm">
              Nenhum dado operacional encontrado para este ponto.
            </div>
          ) : null}

          {hasLoaded && hasOperationalData ? (
            <>
              <div className="flex gap-3">
                {row1.map((card) => (
                  <StatCard key={card.id} {...card} />
                ))}
              </div>

              <div className="flex gap-3">
                {row2.map((card) => (
                  <StatCard key={card.id} {...card} />
                ))}
              </div>

              <LineChart data={data?.chartData} />
              <PieChart data={data?.materialData} />
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
