import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, User, Phone, Mail, Clock, Box, MapPin, Recycle } from "lucide-react";
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

  const pendingPoints = Array.isArray(pendingPointsData) 
    ? pendingPointsData 
    : (pendingPointsData.itens || pendingPointsData.items || []);

  const cards = useMemo(
    () =>
      pendingPoints.map((item) => ({
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
          <section className="grid gap-6">
            {cards.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 lg:flex lg:items-start lg:gap-8">
                {/* Visual Icon */}
                <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 lg:flex">
                  <Building2 size={28} />
                </div>
                
                {/* Details Grid */}
                <div className="flex-1 space-y-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#1F4E79]">{item.nomePonto}</h2>
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
    </AdminShell>
  );
}
