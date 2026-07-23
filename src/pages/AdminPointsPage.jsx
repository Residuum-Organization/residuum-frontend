import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  AlertTriangle, MapPin, SlidersHorizontal, ArrowLeft, Loader2, PowerOff,
  Building2, User, Phone, Mail, Clock, Box, Recycle 
} from "lucide-react";

import AdminShell from "../components/admin/AdminShell";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import InlineAlert from "../components/ui/InlineAlert";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

import { 
  getAdminPoints, deactivateCollectionPoint,
  listPendingCollectionPoints, approveCollectionPoint, rejectCollectionPoint
} from "../services/admin";
import { listCollectionPoints } from "../services/collectionPoints";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

const formatResidueType = (type) =>
  String(type || "resíduo")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

export default function AdminPoints() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState("ativos"); // "ativos" | "pendentes"

  // 1. Queries for Active Points
  const { data: ocupacaoData, isLoading: ocupacaoLoading, isError: ocupacaoError, refetch: refetchOcupacao } = useQuery({
    queryKey: ["adminPointsOcupacao"],
    queryFn: getAdminPoints,
  });

  const { data: pointsData, isLoading: pointsLoading, isError: pointsError, refetch: refetchPoints } = useQuery({
    queryKey: ["adminPointsDetails"],
    queryFn: listCollectionPoints,
  });

  // 2. Query for Pending Points
  const { data: pendingPointsData = {}, isLoading: pendingLoading, isError: pendingIsError, error: pendingError, refetch: refetchPending, isFetching: pendingIsFetching } = useQuery({
    queryKey: queryKeys.pendingCollectionPoints,
    queryFn: listPendingCollectionPoints,
  });

  const pendingPointsList = Array.isArray(pendingPointsData) 
    ? pendingPointsData 
    : (pendingPointsData.itens || pendingPointsData.items || []);

  const pendingCards = useMemo(
    () =>
      pendingPointsList.map((item) => ({
        id: item.id,
        nomePonto: item.nome_ponto || item.responsavel_nome || "Ponto sem nome",
        documento: item.documento || "Não informado",
        endereco: item.endereco || "Endereço não informado",
        materiais: item.tipos_residuos_aceitos?.map(formatResidueType).join(", ") || "Não informado",
        horario: item.horario_funcionamento || "Não informado",
        capacidade: item.capacidade_maxima ? `${item.capacidade_maxima} kg` : "Não informada",
        responsavel: item.responsavel_nome || "Não informado",
        telefone: item.responsavel_telefone || "Não informado",
        email: item.email || "Não informado",
        data: formatDate(item.criado_em || item.data_criacao),
      })),
    [pendingPointsList]
  );

  const points = useMemo(() => {
    if (!ocupacaoData || !pointsData) return [];

    return ocupacaoData.map(ocup => {
      const p = pointsData.find(pt => pt.id === ocup.ponto_coleta_id);
      let status = "Normal";
      let tone = "success";
      const percent = ocup.percentual_ocupacao || 0;

      if (ocup.alerta || percent >= 100) {
        status = "Lotado";
        tone = "error";
      } else if (percent >= 70) {
        status = "Quase Lotado";
        tone = "warning";
      }

      return {
        id: ocup.ponto_coleta_id,
        name: ocup.nome,
        address: p?.endereco || "Endereço indisponível",
        percent: percent,
        status: status,
        tone: tone,
      };
    });
  }, [ocupacaoData, pointsData]);

  const filteredPoints = useMemo(() => {
    if (filter === "all") return points;
    return points.filter((point) => point.status === filter);
  }, [filter, points]);

  const activeCount = points.filter((point) => point.status === "Normal").length;
  const criticalCount = points.filter((point) => point.status === "Lotado").length;
  const attentionCount = points.filter((point) => point.status === "Quase Lotado").length;
  const average = points.length > 0 ? Math.round(
    points.reduce((sum, point) => sum + point.percent, 0) / points.length
  ) : 0;

  const isLoading = ocupacaoLoading || pointsLoading;
  const isError = ocupacaoError || pointsError;
  const refetchAll = () => {
    refetchOcupacao();
    refetchPoints();
    refetchPending();
  };

  const deactivateMutation = useMutation({
    mutationFn: (id) => deactivateCollectionPoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPointsOcupacao"] });
      queryClient.invalidateQueries({ queryKey: ["adminPointsDetails"] });
    },
    onError: (err) => {
      setFeedback({ tone: "error", message: "Não foi possível desativar o ponto: " + err.message });
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveCollectionPoint(id, "Aprovado via painel."),
    onMutate: () => setFeedback(null),
    onSuccess: () => {
      setFeedback({
        tone: "success",
        message: "Ponto de coleta aprovado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingCollectionPoints });
      queryClient.invalidateQueries({ queryKey: ["adminPointsOcupacao"] });
      queryClient.invalidateQueries({ queryKey: ["adminPointsDetails"] });
    },
    onError: (mutationError) => {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(mutationError, "Erro ao aprovar o ponto."),
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectCollectionPoint(id, "Rejeitado pela administração."),
    onMutate: () => setFeedback(null),
    onSuccess: () => {
      setFeedback({
        tone: "success",
        message: "Ponto de coleta rejeitado.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingCollectionPoints });
    },
    onError: (mutationError) => {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(mutationError, "Erro ao rejeitar o ponto."),
      });
    },
  });

  return (
    <AdminShell environmentVariant="admin" showBottomNav={true} contentClassName="px-4 py-5 sm:px-6">
      <PageHeader
        eyebrow="Gerenciamento"
        title="Pontos de coleta"
        description="Gerencie os pontos ativos e aprove novas solicitações em um só lugar."
        action={
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />

      {feedback && (
        <div className="mt-5">
          <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert>
        </div>
      )}

      {/* TABS */}
      <div className="mt-6 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("ativos")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold transition-colors ${
              activeTab === "ativos"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Pontos Ativos ({points.length})
          </button>
          <button
            onClick={() => setActiveTab("pendentes")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold transition-colors flex items-center ${
              activeTab === "pendentes"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Solicitações Pendentes
            {pendingCards.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                {pendingCards.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {activeTab === "ativos" && (
        <div className="mt-6 space-y-6">
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Média de preenchimento" value={`${average}%`} />
            <MetricCard label="Espaço disponível" value={`${activeCount} de ${points.length}`} />
            <MetricCard label="Lotados" value={criticalCount} variant="error" />
            <MetricCard label="Quase Lotados" value={attentionCount} variant="warning" />
          </section>

          <SectionCard
            title="Lista de pontos"
            description="Status, ocupacao e endereco em cards fluidos para mobile e desktop."
          >
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filtros
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
                      filter === item.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <LoadingState title="Carregando pontos de coleta..." size="md" />
            ) : isError ? (
              <ErrorState
                title="Não foi possível carregar os pontos."
                actionLabel="Tentar novamente"
                onAction={refetchAll}
              />
            ) : filteredPoints.length === 0 ? (
              <EmptyState
                title="Nenhum ponto encontrado."
                description="Altere o filtro para visualizar outros status."
                icon={MapPin}
              />
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredPoints.map((point) => (
                  <PointCard 
                    key={point.id} 
                    point={point} 
                    onDeactivate={(id) => {
                      if (window.confirm("Tem certeza que deseja desativar este ponto de coleta? Ele não receberá mais descartes.")) {
                        deactivateMutation.mutate(id);
                      }
                    }}
                    isDeactivating={deactivateMutation.isLoading && deactivateMutation.variables === point.id}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === "pendentes" && (
        <div className="mt-6 space-y-6">
          {pendingLoading && <LoadingState title="Buscando solicitações..." size="md" />}
          
          {pendingIsError && (
            <ErrorState
              title="Não foi possível carregar as solicitações."
              description={getApiErrorMessage(pendingError, "Verifique sua conexão ou tente novamente.")}
              actionLabel={pendingIsFetching ? "Atualizando..." : "Tentar novamente"}
              onAction={() => refetchPending()}
              actionDisabled={pendingIsFetching}
            />
          )}

          {!pendingLoading && !pendingIsError && pendingCards.length === 0 && (
            <EmptyState
              title="Tudo limpo por aqui."
              description="Não há novas solicitações de pontos de coleta no momento."
              icon={Building2}
            />
          )}

          {!pendingLoading && !pendingIsError && pendingCards.length > 0 && (
            <section className="grid gap-6">
              {pendingCards.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 lg:flex lg:items-start lg:gap-8">
                  {/* Visual Icon */}
                  <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 lg:flex">
                    <Building2 size={28} />
                  </div>
                  
                  {/* Details Grid */}
                  <div className="flex-1 space-y-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-extrabold text-[#1A2C71]">{item.nomePonto}</h2>
                        <p className="text-sm font-semibold text-slate-500">Solicitante: <span className="text-slate-700">{item.documento}</span></p>
                      </div>
                      <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        Pendente
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Responsável</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <User size={16} className="text-slate-400 shrink-0" />
                            <span className="font-semibold">{item.responsavel}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={16} className="text-slate-400 shrink-0" />
                            <span>{item.telefone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={16} className="text-slate-400 shrink-0" />
                            <span className="truncate" title={item.email}>{item.email}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Operação</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Box size={16} className="text-orange-500 shrink-0" />
                            <span className="font-semibold">Capacidade: {item.capacidade}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <Clock size={16} className="mt-0.5 text-blue-500 shrink-0" />
                            <span>{item.horario}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Materiais & Local</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start gap-2 text-sm text-emerald-700 font-semibold">
                            <Recycle size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                            <span>{item.materiais}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <MapPin size={16} className="mt-0.5 text-rose-500 shrink-0" />
                            <span>{item.endereco}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex shrink-0 flex-col gap-3 border-t pt-5 lg:mt-0 lg:w-40 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <Button
                      type="button"
                      variant="brandPrimary"
                      onClick={() => approveMutation.mutate(item.id)}
                      disabled={approveMutation.isLoading || rejectMutation.isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {approveMutation.isLoading && approveMutation.variables === item.id ? "Aprovando..." : "Aprovar"}
                    </Button>
                    <Button
                      type="button"
                      variant="brandOutline"
                      onClick={() => rejectMutation.mutate(item.id)}
                      disabled={approveMutation.isLoading || rejectMutation.isLoading}
                      className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      {rejectMutation.isLoading && rejectMutation.variables === item.id ? "Rejeitando..." : "Rejeitar"}
                    </Button>
                    <p className="mt-2 text-center text-xs text-slate-400">Recebido em: {item.data}</p>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      )}
    </AdminShell>
  );
}

const filters = [
  { label: "Todos", value: "all" },
  { label: "Normal", value: "Normal" },
  { label: "Quase Lotado", value: "Quase Lotado" },
  { label: "Lotado", value: "Lotado" },
];

const barClassByTone = {
  success: "bg-[var(--color-accent)]",
  warning: "bg-amber-500",
  error: "bg-[var(--color-error)]",
};

function MetricCard({ label, value, variant = "primary" }) {
  const iconClass =
    variant === "error"
      ? "text-[var(--color-error)] bg-red-50"
      : variant === "warning"
        ? "text-amber-700 bg-amber-50"
        : "text-[var(--color-primary)] bg-[var(--color-surface)]";

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold text-[var(--color-primary)]">
            {value}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--color-text-muted)]">
            {label}
          </p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
          {variant === "error" || variant === "warning" ? (
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MapPin className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
      </div>
    </div>
  );
}

function PointCard({ point, onDeactivate, isDeactivating }) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-[var(--color-primary)]">
              {point.name}
            </h3>
            <Badge variant={point.tone}>{point.status}</Badge>
          </div>
          <p className="mt-2 flex items-start gap-2 text-sm font-medium text-[var(--color-text-muted)]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{point.address}</span>
          </p>
        </div>

        <p className="text-3xl font-extrabold text-[var(--color-primary)]">
          {point.percent}%
        </p>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className={`h-full rounded-full ${barClassByTone[point.tone]}`}
            style={{ width: `${point.percent}%` }}
          />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
            Preenchimento atual
          </p>
          <button
            type="button"
            onClick={() => onDeactivate(point.id)}
            disabled={isDeactivating}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 text-sm font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:opacity-50"
          >
            {isDeactivating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PowerOff className="h-4 w-4" aria-hidden="true" />
            )}
            {isDeactivating ? "Desativando..." : "Desativar Ponto"}
          </button>
        </div>
      </div>
    </article>
  );
}
