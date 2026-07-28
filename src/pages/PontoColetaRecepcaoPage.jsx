import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  MapPin, 
  ClipboardCheck, 
  CheckCircle2, 
  Package, 
  User, 
  Calendar,
  Send,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { toast } from "sonner";

import { getPendingDiscards, confirmPendingDiscard, rejectPendingDiscard } from "../services/discards";
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
        hour: "2-digit",
        minute: "2-digit"
      })
    : "-";

const getResidueColor = (type) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("plastico") || t.includes("plástico")) {
    return { bg: "bg-red-50/70", border: "border-red-200", badge: "bg-red-600 text-white" };
  }
  if (t.includes("papel")) {
    return { bg: "bg-blue-50/70", border: "border-blue-200", badge: "bg-blue-600 text-white" };
  }
  if (t.includes("vidro")) {
    return { bg: "bg-emerald-50/70", border: "border-emerald-200", badge: "bg-emerald-600 text-white" };
  }
  if (t.includes("metal")) {
    return { bg: "bg-amber-50/70", border: "border-amber-200", badge: "bg-amber-500 text-white" };
  }
  if (t.includes("organico") || t.includes("orgânico")) {
    return { bg: "bg-stone-100/70", border: "border-stone-200", badge: "bg-amber-900 text-white" };
  }
  if (t.includes("eletronico") || t.includes("eletrônico")) {
    return { bg: "bg-orange-50/70", border: "border-orange-200", badge: "bg-orange-500 text-white" };
  }
  return { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-[#1A2C71] text-white" };
};

export default function PontoColetaRecepcaoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const discardsQuery = useQuery({
    queryKey: queryKeys.pendingDiscards,
    queryFn: getPendingDiscards,
  });

  const pendingDiscards = (discardsQuery.data || []).filter((d) => d.status === "pendente");

  const confirmReceiptMutation = useMutation({
    mutationFn: async (discardId) => {
      toast.success("Recebimento do cidadão verificado! Encaminhado para conferência da cooperativa.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Não foi possível validar o recebimento."));
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (discardId) =>
      rejectPendingDiscard(discardId, { motivo: "Entrega recusada no ponto de coleta." }, false),
    onSuccess: () => {
      toast.success("Descarte rejeitado.");
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Não foi possível rejeitar o descarte."));
    }
  });

  return (
    <RoleShell variant="ponto_coleta" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Sessão do Ponto de Coleta"
          title="Recepção de Resíduos"
          description="Verifique a entrega física dos materiais trazidos pelos cidadãos e encaminhe para conferência de peso da cooperativa."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />

        <SectionCard
          title="Entregas de Cidadãos Pendentes de Recepção"
          description="Confirme a chegada do cidadão no local para acionar a conferência e pesagem da cooperativa."
        >
          {discardsQuery.isLoading ? <LoadingState title="Buscando descartes recebidos..." size="sm" /> : null}

          {!discardsQuery.isLoading && pendingDiscards.length === 0 ? (
            <EmptyState
              icon={ClipboardCheck}
              title="Nenhuma entrega pendente!"
              description="Quando os cidadãos comparecerem ao ponto para entregar recicláveis, as solicitações aparecerão aqui."
            />
          ) : null}

          {!discardsQuery.isLoading && pendingDiscards.length > 0 ? (
            <div className="grid gap-4">
              {pendingDiscards.map((discard) => {
                const colorCfg = getResidueColor(discard.tipo_residuo);
                return (
                  <div
                    key={discard.id_descarte}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-md"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorCfg.badge.split(' ')[0]}`} />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pl-1.5">
                      <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="warning">Aguardando Recepção</Badge>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${colorCfg.badge}`}>
                            <Package size={12} />
                            {formatResidueType(discard.tipo_residuo)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                            <Calendar size={12} className="text-slate-400" />
                            {formatDate(discard.data_desc)}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-[#1A2C71] leading-snug">
                            {discard.inventario_item_descricao || formatResidueType(discard.tipo_residuo)}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-slate-600 font-medium">
                            <User size={13} className="text-sky-600 shrink-0" />
                            Cidadão: <strong className="text-[#1A2C71]">{discard.usuario_nome || discard.usuario_email || "Anônimo"}</strong>
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-slate-600 font-medium">
                            <Package size={13} className="text-[#0B6B53] shrink-0" />
                            Declarado: <strong className="text-[#1A2C71]">{discard.quantidade} un.</strong>
                          </span>
                        </div>

                        {discard.observacao && (
                          <p className="text-xs font-medium text-slate-600 bg-amber-50/80 p-2 rounded-lg border border-amber-100 italic">
                            "{discard.observacao}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 min-w-[210px]">
                        <Button
                          variant="primary"
                          className="flex-1 lg:flex-none justify-center bg-[#1A2C71] hover:bg-[#121F50] text-white font-bold py-2.5 px-3 text-xs"
                          disabled={confirmReceiptMutation.isPending || rejectMutation.isPending}
                          onClick={() => confirmReceiptMutation.mutate(discard.id_descarte)}
                        >
                          <Send className="mr-1.5 h-3.5 w-3.5" /> Confirmar Entrega do Cidadão
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex-1 lg:flex-none justify-center text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 font-bold py-2 px-3 text-xs"
                          disabled={confirmReceiptMutation.isPending || rejectMutation.isPending}
                          onClick={() => rejectMutation.mutate(discard.id_descarte)}
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Rejeitar Entrega
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </RoleShell>
  );
}
