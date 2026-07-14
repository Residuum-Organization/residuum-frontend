import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import ApprovalCard from "../components/coleta-dados/ApprovalCard";
import Button from "../components/ui/Button";
import AdminShell from "../components/admin/AdminShell";
import PageHeader from "../components/ui/PageHeader";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import {
  listPendingCollectionPoints,
  approveCollectionPoint,
  rejectCollectionPoint,
} from "../services/admin";
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

export default function AdminAprovacaoPontosPage() {
  const [feedback, setFeedback] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: pendingPointsData = {},
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.pendingCollectionPoints,
    queryFn: listPendingCollectionPoints,
  });

  const pendingPoints = Array.isArray(pendingPointsData) ? pendingPointsData : (pendingPointsData.items || []);

  const cards = useMemo(
    () =>
      pendingPoints.map((item) => ({
        id: item.id,
        empresa: item.nome_ponto || item.responsavel_nome || "Ponto sem nome",
        cnpj: `Doc: ${item.documento || "Não informado"}`,
        endereco: item.endereco || "Endereço não informado",
        material: item.tipos_residuos_aceitos?.map(formatResidueType).join(", ") || "Não informado",
        quantidade: item.horario_funcionamento || "Horário não informado",
        funcionamento: `Capacidade: ${item.capacidade_maxima || "-"} kg`,
        frequencia: `Responsável: ${item.responsavel_nome} (${item.responsavel_telefone})`,
        confiabilidade: item.email || "Sem e-mail",
        observacoes: item.observacoes || "Sem observações",
        data: formatDate(item.data_criacao || item.criado_em),
      })),
    [pendingPoints],
  );

  const approveMutation = useMutation({
    mutationFn: (id) => approveCollectionPoint(id, "Aprovado via painel."),
    onMutate: () => setFeedback(null),
    onSuccess: () => {
      setFeedback({
        variant: "success",
        title: "Ponto de coleta aprovado com sucesso.",
        description: "O parceiro agora já pode acessar a plataforma.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingCollectionPoints });
    },
    onError: (mutationError) => {
      setFeedback({
        variant: "error",
        title: "Não foi possível aprovar o ponto de coleta.",
        description: getApiErrorMessage(mutationError, "Erro ao aprovar o ponto."),
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectCollectionPoint(id, "Rejeitado pela administração."),
    onMutate: () => setFeedback(null),
    onSuccess: () => {
      setFeedback({
        variant: "success",
        title: "Ponto de coleta rejeitado.",
        description: "A solicitação foi movida para rejeitados.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingCollectionPoints });
    },
    onError: (mutationError) => {
      setFeedback({
        variant: "error",
        title: "Não foi possível rejeitar o ponto de coleta.",
        description: getApiErrorMessage(mutationError, "Erro ao rejeitar o ponto."),
      });
    },
  });

  return (
    <AdminShell environmentVariant="admin" showBottomNav={true} contentClassName="px-4 py-5 sm:px-6">
      <div className="space-y-5 pb-4">
        <PageHeader
          eyebrow="Validação de Parceiros"
          title="Novos Pontos de Coleta"
          description="Aprove ou rejeite solicitações de novos pontos de coleta."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                {cards.length} pendente(s)
              </div>
            </div>
          }
        />

        {feedback && (
          <InlineAlert variant={feedback.variant} title={feedback.title} description={feedback.description} />
        )}

        {isLoading && <LoadingState title="Buscando solicitações..." size="md" />}

        {isError && (
          <ErrorState
            title="Não foi possível carregar as solicitações."
            description={getApiErrorMessage(error, "Verifique sua conexão ou tente novamente.")}
            actionLabel={isFetching ? "Atualizando..." : "Tentar novamente"}
            onAction={() => refetch()}
            actionDisabled={isFetching}
          />
        )}

        {!isLoading && !isError && cards.length === 0 && (
          <EmptyState
            title="Tudo limpo por aqui."
            description="Não há novas solicitações de pontos de coleta no momento."
            icon={Building2}
          />
        )}

        {!isLoading && !isError && cards.length > 0 && (
          <section className="grid gap-4 xl:grid-cols-2">
            {cards.map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onAprovar={() => approveMutation.mutate(item.id)}
                onRejeitar={() => rejectMutation.mutate(item.id)}
                isApproving={approveMutation.isLoading && approveMutation.variables === item.id}
                isRejecting={rejectMutation.isLoading && rejectMutation.variables === item.id}
                disabled={approveMutation.isLoading || rejectMutation.isLoading}
              />
            ))}
          </section>
        )}
      </div>
    </AdminShell>
  );
}
