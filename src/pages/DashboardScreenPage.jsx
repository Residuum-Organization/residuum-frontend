import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, RefreshCw, ArrowLeft } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import PieChart from "../components/dashboard/PieChart";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { getCollectionPointDashboard } from "../services/collectionPointDashboard";
import { queryKeys } from "../services/queryKeys";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.collectionPointDashboard,
    queryFn: getCollectionPointDashboard,
  });

  const metrics = data?.metrics || {};
  const points = data?.points || [];
  const hasLoaded = !isLoading && !isError;
  const hasOperationalData = Boolean(data?.hasOperationalData);

  const formatKg = (value) =>
    `${Number(value || 0).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })} kg`;

  const statCards = [
    {
      id: "total",
      title: "Total Coletado",
      value: formatKg(metrics.totalCollected),
      trend: `${metrics.totalPoints || 0} ponto(s) monitorado(s)`,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      icon: "Recycle",
    },
    {
      id: "users",
      title: "Usuários Atendidos",
      value: String(metrics.uniqueUsers || 0),
      trend: `${metrics.pendingDiscards || 0} coleta(s) pendente(s)`,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-400",
      icon: "User",
    },
    {
      id: "coletas",
      title: "Pontos Vinculados",
      value: String(metrics.totalPoints || 0),
      trend: `${metrics.pointsActive || 0} ativo(s) agora`,
      iconBg: "bg-slate-800",
      iconColor: "text-white",
      icon: "Truck",
    },
    {
      id: "status",
      title: "Status do Sistema",
      value: (metrics.criticalPoints || 0) > 0 ? "Atenção" : "Ativo",
      trend:
        (metrics.criticalPoints || 0) > 0
          ? `${metrics.criticalPoints} ponto(s) crítico(s)`
          : "Operação estável",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
      icon: "Activity",
      valueClass: (metrics.criticalPoints || 0) > 0 ? "text-amber-500" : "text-green-500",
    },
  ];

  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]">
      <div className="space-y-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 shadow-sm sm:p-6 lg:min-h-[calc(100vh-4rem)]">
        <PageHeader
          eyebrow="Cooperativa / Empresa de coleta"
          title="Dashboard operacional"
          description="Acompanhe pontos vinculados, descartes pendentes e volume operacional disponível pela API."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => refetch()}
                disabled={isFetching}
                className="w-full gap-2 sm:w-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Atualizar
              </Button>
            </div>
          }
        />

        {isLoading ? (
          <LoadingState title="Carregando painel do ponto..." size="md" />
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
          <EmptyState
            title="Nenhum dado operacional encontrado para este ponto."
            description="Quando houver pontos vinculados ou descartes pendentes, os indicadores serão exibidos aqui."
            icon={BarChart3}
          />
        ) : null}

        {hasLoaded && hasOperationalData ? (
          <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.id} {...card} />
              ))}
            </section>

          </>
        ) : null}
      </div>
    </RoleShell>
  );
}
