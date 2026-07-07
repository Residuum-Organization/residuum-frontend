import React from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import PieChart from "../components/dashboard/PieChart";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
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
            <LoadingState title="Carregando painel do ponto..." size="sm" />
          ) : null}

          {isError ? (
            <ErrorState
              title="Não foi possível carregar os dados operacionais do dashboard."
              description="Verifique se o servidor está disponível e tente novamente."
              actionLabel={isFetching ? "Tentando novamente..." : "Tentar novamente"}
              onAction={() => refetch()}
              actionDisabled={isFetching}
            />
          ) : null}

          {hasLoaded && !hasOperationalData ? (
            <EmptyState title="Nenhum dado operacional encontrado para este ponto." />
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
