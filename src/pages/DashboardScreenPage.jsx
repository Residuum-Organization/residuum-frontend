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

import { useAuth } from "../contexts/AuthContext";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.collectionPointDashboard,
    queryFn: getCollectionPointDashboard,
  });

  const metrics = data?.metrics || {};
  const points = data?.points || [];
  const hasLoaded = !isLoading && !isError;
  const hasOperationalData = Boolean(data?.hasOperationalData);
  const isPontoColeta = user?.role === "ponto_coleta";
  const myPoint = points[0] || {};

  const formatKg = (value) =>
    `${Number(value || 0).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })} kg`;

  const statCards = [
    {
      id: "total",
      title: "Total Coletado",
      value: formatKg(metrics.totalCollected),
      trend: isPontoColeta ? "Volume estocado no ponto" : `${metrics.totalPoints || 0} ponto(s) monitorado(s)`,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      icon: "Recycle",
    },
    {
      id: "users",
      title: "Cidadãos Atendidos",
      value: String(metrics.uniqueUsers || 0),
      trend: "Total de cidadãos atendidos neste ponto",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-400",
      icon: "User",
    },
    {
      id: "pending",
      title: "Descartes Pendentes",
      value: String(metrics.pendingDiscards || 0),
      trend: "Aguardando conferência e pesagem",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      icon: "Clock",
    },
    isPontoColeta
      ? {
          id: "ponto_info",
          title: "Capacidade & Ocupação",
          value: `${myPoint.percentual_ocupacao || 0}%`,
          trend: `${myPoint.nome || "Ponto de Coleta"} (Máx ${myPoint.capacidade_maxima || 1000}kg)`,
          iconBg: "bg-[#1A2C71]",
          iconColor: "text-white",
          icon: "Package",
        }
      : {
          id: "coletas",
          title: "Pontos Vinculados",
          value: String(metrics.totalPoints || 0),
          trend: `${metrics.pointsActive || 0} ativo(s) agora`,
          iconBg: "bg-slate-800",
          iconColor: "text-white",
          icon: "Truck",
        },
  ];

  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]">
      <div className="space-y-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 shadow-sm sm:p-6 lg:min-h-[calc(100vh-4rem)]">
        <PageHeader
          eyebrow={isPontoColeta ? "Ponto de Coleta" : "Cooperativa"}
          title={isPontoColeta ? `Painel - ${myPoint.nome || "Ponto de Coleta"}` : "Dashboard operacional"}
          description={
            isPontoColeta
              ? "Acompanhe em tempo real os descartes, volume estocado e capacidade do seu ponto."
              : "Acompanhe pontos vinculados, descartes pendentes e volume operacional."
          }
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
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

            <section className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SectionCard
                  title="Evolução de Coleta"
                  description="Acompanhe o volume de resíduos recebidos nos últimos meses."
                >
                  <LineChart
                    embedded
                    data={data?.volumeHistoryChartData || []}
                  />
                </SectionCard>
              </div>
              <div className="lg:col-span-1">
                <SectionCard
                  title="Inventário Atual"
                  description="Composição de materiais estocados."
                >
                  <PieChart
                    embedded
                    data={data?.inventoryChartData || []}
                  />
                </SectionCard>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </RoleShell>
  );
}
