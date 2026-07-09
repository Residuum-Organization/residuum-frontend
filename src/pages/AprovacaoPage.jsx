import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, ArrowLeft } from "lucide-react";
import ApprovalCard from "../components/coleta-dados/ApprovalCard";
import Button from "../components/ui/Button";
import AdminShell from "../components/admin/AdminShell";
import PageHeader from "../components/ui/PageHeader";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import {
  confirmPendingDiscard,
  getPendingDiscards,
  rejectPendingDiscard,
} from "../services/discards";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { useAuth } from "../contexts/AuthContext";

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

export default function Aprovacao() {
  const [feedback, setFeedback] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    data: pendingDiscards = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.pendingDiscards,
    queryFn: getPendingDiscards,
  });

  const cards = useMemo(
    () =>
      pendingDiscards.map((item) => ({
        id: item.id_descarte,
        empresa: item.ponto_coleta_nome || `Ponto ${item.ponto_coleta_id || "-"}`,
        cnpj: item.usuario_nome || "Usuário pendente",
        endereco: item.ponto_coleta_endereco || "Endereço não informado",
        material: formatResidueType(item.tipo_residuo),
        quantidade: `${Number(item.quantidade || 0).toLocaleString("pt-BR", {
          maximumFractionDigits: 2,
        })} kg`,
        funcionamento: `Status ${String(item.status || "pendente").toUpperCase()}`,
        frequencia: item.usuario_email || "Sem e-mail informado",
        confiabilidade: item.quantidade_confirmada
          ? `${item.quantidade_confirmada} kg confirmados`
          : "Aguardando conferência",
        observacoes: item.observacao || item.inventario_item_descricao || "Sem observações",
        data: formatDate(item.data_desc),
      })),
    [pendingDiscards],
  );

  const confirmMutation = useMutation({
    mutationFn: ({ discardId, quantity }) =>
      confirmPendingDiscard(discardId, { quantidade_confirmada: quantity }),
    onMutate: () => {
      setFeedback(null);
    },
    onSuccess: () => {
      setFeedback({
        variant: "success",
        title: "Descarte confirmado com sucesso.",
        description: "A fila será atualizada com os dados retornados pela API.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (mutationError) => {
      setFeedback({
        variant: "error",
        title: "Não foi possível confirmar este descarte.",
        description: getApiErrorMessage(
          mutationError,
          "Não foi possível confirmar este descarte.",
        ),
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (discardId) =>
      rejectPendingDiscard(discardId, {
        motivo: "Solicitação rejeitada pela operação.",
      }),
    onMutate: () => {
      setFeedback(null);
    },
    onSuccess: () => {
      setFeedback({
        variant: "success",
        title: "Solicitação removida da fila de pendências.",
        description: "A rejeição foi concluída pela resposta real da API.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (mutationError) => {
      setFeedback({
        variant: "error",
        title: "Não foi possível rejeitar este descarte.",
        description: getApiErrorMessage(
          mutationError,
          "Não foi possível rejeitar este descarte.",
        ),
      });
    },
  });

  const activeConfirmId = confirmMutation.variables?.discardId;
  const activeRejectId = rejectMutation.variables;
  const hasPendingAction = confirmMutation.isLoading || rejectMutation.isLoading;

  return (
    <AdminShell
      environmentVariant={isAdmin ? "admin" : "operacional"}
      showBottomNav={isAdmin}
      contentClassName="px-4 py-5 sm:px-6"
    >
      <div className="space-y-5 pb-4">
        <PageHeader
          eyebrow="Area operacional compartilhada"
          title="Descartes em confirmação"
          description="Cooperativa ou empresa de coleta realiza a analise e validacao operacional; o administrador pode acompanhar por auditoria."
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

        <InlineAlert
          variant="info"
          title="Fluxo compartilhado"
          description="Esta area mantem o fluxo existente: cooperativa valida operacoes de descarte e admin acompanha sem alterar endpoint, payload ou regra de aprovacao."
        />

        {feedback ? (
          <InlineAlert
            variant={feedback.variant}
            title={feedback.title}
            description={feedback.description}
          />
        ) : null}

        {isLoading ? (
          <LoadingState title="Carregando pendências..." size="md" />
        ) : null}

        {isError ? (
          <ErrorState
            title="Não foi possível carregar os descartes pendentes."
            description={getApiErrorMessage(
              error,
              "Não foi possível carregar os descartes pendentes.",
            )}
            actionLabel={isFetching ? "Tentando novamente..." : "Tentar novamente"}
            onAction={() => refetch()}
            actionDisabled={isFetching}
          />
        ) : null}

        {!isLoading && !isError && cards.length === 0 ? (
          <EmptyState
            title="Nenhum descarte pendente no momento."
            description="Quando houver solicitações aguardando conferência, elas aparecerão nesta fila."
            icon={ClipboardCheck}
          />
        ) : null}

        {!isLoading && !isError && cards.length > 0 ? (
          <section className="grid gap-4 xl:grid-cols-2">
            {cards.map((item) => {
              const discard = pendingDiscards.find(
                (entry) => entry.id_descarte === item.id,
              );

              return (
                <ApprovalCard
                  key={item.id}
                  item={item}
                  isApproving={confirmMutation.isLoading && activeConfirmId === item.id}
                  isRejecting={rejectMutation.isLoading && activeRejectId === item.id}
                  disabled={hasPendingAction}
                  onAprovar={() => {
                    confirmMutation.mutate({
                      discardId: item.id,
                      quantity: Number(discard?.quantidade || 0),
                    });
                  }}
                  onRejeitar={() => rejectMutation.mutate(item.id)}
                />
              );
            })}
          </section>
        ) : null}

        {!isLoading && !isError && cards.length > 0 ? (
          <InlineAlert variant="info">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Aprovação e rejeição usam as mutations existentes. O feedback de sucesso só aparece depois da resposta da API.
            </span>
          </InlineAlert>
        ) : null}
      </div>
    </AdminShell>
  );
}
