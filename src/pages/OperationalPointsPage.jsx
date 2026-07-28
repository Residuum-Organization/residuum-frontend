import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  ClipboardCheck, 
  Weight, 
  X, 
  XCircle,
  AlertTriangle,
  ArrowRight,
  PackageCheck,
  Clock,
  Scale,
  Package,
  User,
  Calendar,
  CheckCheck
} from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

import { listOperationalCollectionPoints } from "../services/collectionPoints";
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

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const formatHorariosList = (horarios) => {
  if (!horarios || horarios.length === 0) return null;

  const grouped = {};
  horarios.forEach((h) => {
    const abertura = String(h.hora_abertura || "").substring(0, 5);
    const fechamento = String(h.hora_fechamento || "").substring(0, 5);
    const range = `${abertura} às ${fechamento}`;

    if (!grouped[range]) grouped[range] = [];
    if (!grouped[range].includes(h.dia_semana)) {
      grouped[range].push(h.dia_semana);
    }
  });

  return Object.entries(grouped).map(([range, dias]) => {
    const diasSorted = [...dias].sort((a, b) => a - b);
    const diasStr = diasSorted.map((d) => DAY_NAMES[d]).join(", ");
    return { diasStr, range };
  });
};

const getResidueColor = (type) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("plastico") || t.includes("plástico")) {
    return { 
      bg: "bg-red-50/70", 
      border: "border-red-200", 
      badge: "bg-red-600 text-white",
      pillBg: "bg-red-100 text-red-800 border-red-200",
      accent: "text-red-700" 
    };
  }
  if (t.includes("papel")) {
    return { 
      bg: "bg-blue-50/70", 
      border: "border-blue-200", 
      badge: "bg-blue-600 text-white",
      pillBg: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "text-blue-700" 
    };
  }
  if (t.includes("vidro")) {
    return { 
      bg: "bg-emerald-50/70", 
      border: "border-emerald-200", 
      badge: "bg-emerald-600 text-white",
      pillBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "text-emerald-700" 
    };
  }
  if (t.includes("metal")) {
    return { 
      bg: "bg-amber-50/70", 
      border: "border-amber-200", 
      badge: "bg-amber-500 text-white",
      pillBg: "bg-amber-100 text-amber-900 border-amber-200",
      accent: "text-amber-800" 
    };
  }
  if (t.includes("organico") || t.includes("orgânico")) {
    return { 
      bg: "bg-stone-100/70", 
      border: "border-stone-200", 
      badge: "bg-amber-900 text-white",
      pillBg: "bg-stone-200 text-stone-900 border-stone-300",
      accent: "text-stone-800" 
    };
  }
  if (t.includes("eletronico") || t.includes("eletrônico")) {
    return { 
      bg: "bg-orange-50/70", 
      border: "border-orange-200", 
      badge: "bg-orange-500 text-white",
      pillBg: "bg-orange-100 text-orange-800 border-orange-200",
      accent: "text-orange-700" 
    };
  }
  return { 
    bg: "bg-slate-50", 
    border: "border-slate-200", 
    badge: "bg-[#1A2C71] text-white",
    pillBg: "bg-slate-100 text-slate-800 border-slate-200",
    accent: "text-[#1A2C71]" 
  };
};

export default function OperationalPointsPage() {
  const { pontoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [approvingDiscard, setApprovingDiscard] = useState(null);
  const [pesoEntrada, setPesoEntrada] = useState("");
  const [isBatchCollecting, setIsBatchCollecting] = useState(false);
  const [pesosPorTipo, setPesosPorTipo] = useState({});
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  const pointsQuery = useQuery({ 
    queryKey: ["operational-points"], 
    queryFn: listOperationalCollectionPoints 
  });
  
  const discardsQuery = useQuery({
    queryKey: queryKeys.pendingDiscards,
    queryFn: getPendingDiscards,
  });

  const points = pointsQuery.data || [];
  const pendingDiscards = discardsQuery.data || [];

  // Selected point if pontoId is present in URL
  const selectedPoint = useMemo(() => {
    if (!pontoId) return null;
    return points.find((point) => String(point.id) === String(pontoId));
  }, [points, pontoId]);

  // Pending discards for the selected point
  const discardsForSelectedPoint = useMemo(() => {
    if (!pontoId) return [];
    return pendingDiscards.filter(
      (d) => String(d.ponto_coleta_id) === String(pontoId) && d.status === "pendente"
    );
  }, [pendingDiscards, pontoId]);

  // Resumo agrupado dos tipos de resíduos presentes nas solicitações pendentes
  const tiposPresentesSummary = useMemo(() => {
    const summary = {};
    discardsForSelectedPoint.forEach((d) => {
      const tipo = d.tipo_residuo || "outros";
      if (!summary[tipo]) {
        summary[tipo] = {
          tipo,
          count: 0,
          totalUnits: 0,
          discards: [],
        };
      }
      summary[tipo].count += 1;
      summary[tipo].totalUnits += Number(d.quantidade || 1);
      summary[tipo].discards.push(d);
    });
    return summary;
  }, [discardsForSelectedPoint]);

  const confirmMutation = useMutation({
    mutationFn: ({ discardId, payload }) => confirmPendingDiscard(discardId, payload),
    onSuccess: () => {
      toast.success("Pesagem registrada e descarte validado com sucesso!");
      setApprovingDiscard(null);
      setPesoEntrada("");
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
      queryClient.invalidateQueries({ queryKey: ["operational-points"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Não foi possível registrar a pesagem."));
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (discardId) =>
      rejectPendingDiscard(discardId, { motivo: "Solicitação rejeitada pela operação." }, false),
    onSuccess: () => {
      toast.success("Descarte rejeitado.");
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Não foi possível rejeitar este descarte."));
    }
  });

  const handleApproveSubmit = (e) => {
    e.preventDefault();
    if (!pesoEntrada || Number(pesoEntrada) <= 0) {
      toast.error("Informe o peso real aferido na balança.");
      return;
    }
    confirmMutation.mutate({
      discardId: approvingDiscard.id_descarte,
      payload: {
        quantidade_confirmada: Number(pesoEntrada),
      }
    });
  };

  const handleBatchCollectSubmit = async (e) => {
    e.preventDefault();
    const tiposKeys = Object.keys(tiposPresentesSummary);
    if (tiposKeys.length === 0) {
      toast.error("Não há descartes pendentes para coletar.");
      return;
    }

    const missingType = tiposKeys.find(
      (t) => !pesosPorTipo[t] || Number(pesosPorTipo[t]) <= 0
    );
    if (missingType) {
      toast.error(`Informe o peso em kg para o tipo: ${formatResidueType(missingType)}.`);
      return;
    }

    setIsProcessingBatch(true);
    try {
      let totalGeralKg = 0;

      for (const tipoId of tiposKeys) {
        const pesoTipoNum = Number(pesosPorTipo[tipoId]);
        totalGeralKg += pesoTipoNum;
        const summary = tiposPresentesSummary[tipoId];
        const totalUnitsInTipo = summary.totalUnits || 1;

        for (const discard of summary.discards) {
          const itemUnits = Number(discard.quantidade || 1);
          const itemWeight = totalUnitsInTipo > 0 ? (pesoTipoNum * (itemUnits / totalUnitsInTipo)) : pesoTipoNum;
          await confirmPendingDiscard(discard.id_descarte, {
            quantidade_confirmada: Number(itemWeight.toFixed(2)) || itemUnits
          });
        }
      }

      toast.success(`Coleta em lote concluída com sucesso! ${totalGeralKg.toFixed(1)} kg registrados em ${discardsForSelectedPoint.length} descartes.`);
      setIsBatchCollecting(false);
      setPesosPorTipo({});
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
      queryClient.invalidateQueries({ queryKey: ["operational-points"] });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível concluir a coleta dos resíduos."));
    } finally {
      setIsProcessingBatch(false);
    }
  };

  // ROTA 1: Lista de Pontos de Coleta com os Status dos Descartes Pendentes
  if (!pontoId) {
    return (
      <RoleShell variant="operacional" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Operação"
            title="Meus Pontos de Coleta"
            description="Consulte as informações operacionais dos seus locais e verifique o status das solicitações de descarte."
          />

          {pointsQuery.isLoading ? <LoadingState title="Carregando seus locais de coleta..." /> : null}
          
          {!pointsQuery.isLoading && !points.length ? (
            <EmptyState title="Nenhum local vinculado à sua conta." icon={MapPin} />
          ) : null}

          {!pointsQuery.isLoading && points.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {points.map((point) => {
                const pendingCount = pendingDiscards.filter(
                  (d) => String(d.ponto_coleta_id) === String(point.id)
                ).length;
                const horariosFormatados = formatHorariosList(point.horarios);

                return (
                  <div
                    key={point.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#0B6B53]">
                            <MapPin size={22} />
                          </span>
                          <div>
                            <h3 className="text-lg font-black text-[#1A2C71]">{point.nome}</h3>
                          </div>
                        </div>
                        <Badge variant={point.status === "ativo" ? "success" : "neutral"} className="uppercase">
                          {point.status || "ativo"}
                        </Badge>
                      </div>

                      <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                        <div>
                          <span className="block text-xs font-bold uppercase text-slate-400 mb-0.5">Endereço</span>
                          <p className="font-medium text-slate-700">{point.endereco || "Endereço não informado"}</p>
                        </div>

                        <div>
                          <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Horário de Funcionamento</span>
                          {horariosFormatados && horariosFormatados.length > 0 ? (
                            <div className="space-y-1">
                              {horariosFormatados.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                  <Clock size={13} className="text-[#0B6B53] shrink-0" />
                                  <span>{item.diasStr}: <strong className="text-[#1A2C71]">{item.range}</strong></span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Horários não configurados</p>
                          )}
                        </div>

                        <div>
                          <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Materiais Aceitos</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(point.tipos_residuos_aceitos || []).map((tipo) => {
                              const colorCfg = getResidueColor(tipo);
                              return (
                                <span
                                  key={tipo}
                                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${colorCfg.pillBg}`}
                                >
                                  {formatResidueType(tipo)}
                                </span>
                              );
                            })}
                            {(!point.tipos_residuos_aceitos || point.tipos_residuos_aceitos.length === 0) && (
                              <span className="text-xs text-slate-400">Nenhum material configurado</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      {pendingCount > 0 ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-amber-800">
                            <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                            <span className="text-xs font-black uppercase tracking-wider">Atenção</span>
                          </div>
                          <p className="text-sm font-bold text-amber-900">
                            {pendingCount} solicitação(ões) de descarte pendente(s) aguardando conferência.
                          </p>
                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => navigate(`/meus-pontos-operacionais/${point.id}`)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
                          >
                            Ver solicitações ({pendingCount}) <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-emerald-800">
                            <PackageCheck size={18} className="shrink-0 text-emerald-600" />
                            <span className="text-xs font-black uppercase tracking-wider">Tudo em Dia</span>
                          </div>
                          <p className="text-sm font-semibold text-emerald-900">
                            Nenhum descarte pendente para este ponto no momento.
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(`/meus-pontos-operacionais/${point.id}`)}
                            className="w-full text-slate-700 border-slate-200 hover:bg-slate-100 font-bold"
                          >
                            Ver solicitações / histórico <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </RoleShell>
    );
  }

  // ROTA 2 (SUB-ROTA): Detalhes do Ponto de Coleta Selecionado & Lista de Descartes Pendentes
  const selectedHorarios = formatHorariosList(selectedPoint?.horarios);

  return (
    <RoleShell variant="operacional" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Validação de descartes"
          title={selectedPoint ? selectedPoint.nome : "Carregando Ponto..."}
          description="Afira o peso real na balança para validar o descarte e creditar a pontuação."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate("/meus-pontos-operacionais")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Meus Locais
            </Button>
          }
        />

        {selectedPoint ? (
          <SectionCard title="Informações do Local de Coleta">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Nome</span>
                <strong className="text-base font-black text-[#1A2C71]">{selectedPoint.nome}</strong>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Status</span>
                <Badge variant={selectedPoint.status === "ativo" ? "success" : "neutral"} className="uppercase">
                  {selectedPoint.status || "ativo"}
                </Badge>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Endereço</span>
                <p className="text-sm font-medium text-slate-700">{selectedPoint.endereco || "Não informado"}</p>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Horário de Funcionamento</span>
                {selectedHorarios && selectedHorarios.length > 0 ? (
                  <div className="space-y-1">
                    {selectedHorarios.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Clock size={13} className="text-[#0B6B53] shrink-0" />
                        <span>{item.diasStr}: <strong className="text-[#1A2C71]">{item.range}</strong></span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Horários não configurados</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Materiais Aceitos</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(selectedPoint.tipos_residuos_aceitos || []).map((tipo) => {
                    const colorCfg = getResidueColor(tipo);
                    return (
                      <span
                        key={tipo}
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${colorCfg.pillBg}`}
                      >
                        {formatResidueType(tipo)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>
        ) : null}

        <SectionCard
          title="Solicitações de Descarte Aguardando Conferência"
          description="Afira o peso na balança e clique em 'Validar e Lançar Peso' para concluir o atendimento."
          action={
            discardsForSelectedPoint.length > 0 ? (
              <Button
                type="button"
                variant="primary"
                className="bg-[#0B6B53] hover:bg-[#085240] text-white font-extrabold py-2 px-3.5 text-xs shadow-xs"
                onClick={() => setIsBatchCollecting(true)}
              >
                <CheckCheck className="mr-1.5 h-4 w-4" /> Coletar tudo
              </Button>
            ) : null
          }
        >
          {discardsQuery.isLoading ? <LoadingState title="Buscando descartes deste ponto..." size="sm" /> : null}

          {!discardsQuery.isLoading && discardsForSelectedPoint.length === 0 ? (
            <EmptyState
              icon={ClipboardCheck}
              title="Tudo em dia!"
              description="Não há novos descartes pendentes de conferência para este ponto de coleta."
            />
          ) : null}

          {!discardsQuery.isLoading && discardsForSelectedPoint.length > 0 ? (
            <div className="grid gap-4">
              {discardsForSelectedPoint.map((discard) => {
                const colorCfg = getResidueColor(discard.tipo_residuo);
                return (
                  <div
                    key={discard.id_descarte}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300"
                  >
                    {/* Barra de destaque lateral sutil com a cor do tipo de resíduo */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorCfg.badge.split(' ')[0]}`} />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pl-1.5">
                      {/* Coluna Esquerda: Informações do Descarte */}
                      <div className="min-w-0 flex-1 space-y-2.5">
                        {/* Linha de Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="warning" className="px-2.5 py-0.5 text-[11px] font-bold">Pendente</Badge>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${colorCfg.badge}`}>
                            <Package size={12} />
                            {formatResidueType(discard.tipo_residuo)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                            <Calendar size={12} className="text-slate-400" />
                            {formatDate(discard.data_desc)}
                          </span>
                        </div>

                        {/* Nome do Material */}
                        <div>
                          <h4 className="text-base font-extrabold text-[#1A2C71] leading-snug">
                            {discard.inventario_item_descricao || formatResidueType(discard.tipo_residuo)}
                          </h4>
                        </div>

                        {/* Chips de Informações: Morador & Quantidade */}
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

                        {/* Observação */}
                        {discard.observacao && (
                          <p className="text-xs font-medium text-slate-600 bg-amber-50/80 p-2 rounded-lg border border-amber-100 italic">
                            "{discard.observacao}"
                          </p>
                        )}
                      </div>

                      {/* Coluna Direita: Botões de Ação Comportados */}
                      {/* <div className="flex flex-row lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 min-w-[190px]">
                        <Button
                          variant="primary"
                          className="flex-1 lg:flex-none justify-center bg-[#0B6B53] hover:bg-[#085240] text-white font-bold py-2 px-3 text-xs"
                          disabled={confirmMutation.isPending || rejectMutation.isPending}
                          onClick={() => setApprovingDiscard(discard)}
                        >
                          <Weight className="mr-1.5 h-3.5 w-3.5" /> Validar e Lançar Peso
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex-1 lg:flex-none justify-center text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 font-bold py-2 px-3 text-xs"
                          disabled={confirmMutation.isPending || rejectMutation.isPending}
                          onClick={() => rejectMutation.mutate(discard.id_descarte)}
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Rejeitar
                        </Button>
                      </div> */}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </SectionCard>
      </div>

      {/* Modal de Validação / Lançamento de Peso */}
      <Dialog.Root open={!!approvingDiscard} onOpenChange={(open) => !open && setApprovingDiscard(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm transition-opacity" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform p-4 sm:p-6 outline-none">
            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5">
                <Dialog.Title className="text-lg font-black text-[#1A2C71]">Registrar Peso Aferido</Dialog.Title>
                <Dialog.Close className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </Dialog.Close>
              </div>

              <div className="p-6 sm:p-8">
                <Dialog.Description className="mb-5 text-sm font-medium text-slate-500">
                  Valide este descarte informando o peso real (kg) do material que chegou à cooperativa. Isso atualizará o estoque e creditará os pontos do usuário.
                </Dialog.Description>

                {approvingDiscard ? (
                  (() => {
                    const colorCfg = getResidueColor(approvingDiscard.tipo_residuo);
                    return (
                      <div className={`mb-6 overflow-hidden rounded-2xl border ${colorCfg.border} ${colorCfg.bg} p-5 shadow-sm space-y-4`}>
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider ${colorCfg.badge}`}>
                            <Package size={14} />
                            {formatResidueType(approvingDiscard.tipo_residuo)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-2xs">
                            <Calendar size={13} className="text-slate-400" />
                            {formatDate(approvingDiscard.data_desc)}
                          </span>
                        </div>

                        <div className="px-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Material Solicitado</span>
                          <h4 className="text-base font-extrabold text-[#1A2C71] leading-snug mt-0.5">
                            {approvingDiscard.inventario_item_descricao || formatResidueType(approvingDiscard.tipo_residuo)}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                              <Package size={14} className="text-[#0B6B53]" />
                              <span className="text-[10px] font-black uppercase tracking-wider">Declarado</span>
                            </div>
                            <p className="text-sm font-extrabold text-[#1A2C71]">
                              {approvingDiscard.quantidade} un.
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                              <User size={14} className="text-sky-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider">Cidadão</span>
                            </div>
                            <p className="text-sm font-extrabold text-[#1A2C71] truncate" title={approvingDiscard.usuario_nome || approvingDiscard.usuario_email || "Anônimo"}>
                              {approvingDiscard.usuario_nome || approvingDiscard.usuario_email || "Anônimo"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : null}

                <form onSubmit={handleApproveSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1A2C71]">
                      Peso Aferido na Balança (kg)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <Weight size={20} />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.1"
                        autoFocus
                        value={pesoEntrada}
                        onChange={(e) => setPesoEntrada(e.target.value)}
                        className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 pl-12 text-base font-extrabold text-[#1A2C71] transition focus:border-[#1A2C71] focus:outline-none focus:ring-2 focus:ring-[#1A2C71]/20"
                        placeholder="Ex: 15.5"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-slate-500 font-bold">kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full h-13 bg-[#0B6B53] hover:bg-[#085240] text-white font-bold text-base shadow-md"
                      disabled={confirmMutation.isPending}
                    >
                      <Scale className="mr-2 h-5 w-5" />
                      {confirmMutation.isPending ? "Registrando..." : "Confirmar e Lançar Peso"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal de Coleta em Lote por Tipo de Resíduo */}
      <Dialog.Root 
        open={isBatchCollecting} 
        onOpenChange={(open) => {
          if (!open) {
            setIsBatchCollecting(false);
            setPesosPorTipo({});
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm transition-opacity" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform p-4 sm:p-6 outline-none max-h-[90vh] overflow-y-auto">
            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5">
                <Dialog.Title className="text-lg font-black text-[#1A2C71]">Coletar Tudo — Pesagem por Tipo de Resíduo</Dialog.Title>
                <Dialog.Close className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </Dialog.Close>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <Dialog.Description className="text-sm font-medium text-slate-500">
                  Informe o peso aferido na balança (em kg) para **cada tipo de resíduo** presente nesta coleta.
                </Dialog.Description>

                <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                      <PackageCheck size={16} /> Resumo do Lote
                    </span>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-black text-white">
                      {discardsForSelectedPoint.length} descartes • {Object.keys(tiposPresentesSummary).length} tipo(s)
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBatchCollectSubmit} className="space-y-4">
                  <div className="space-y-3.5 max-h-[45vh] overflow-y-auto pr-1">
                    {Object.entries(tiposPresentesSummary).map(([tipoId, summary]) => {
                      const colorCfg = getResidueColor(tipoId);
                      return (
                        <div
                          key={tipoId}
                          className={`rounded-2xl border ${colorCfg.border} ${colorCfg.bg} p-4 space-y-3 shadow-2xs`}
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider ${colorCfg.badge}`}
                            >
                              <Package size={13} />
                              {formatResidueType(tipoId)}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {summary.count} descarte(s) ({summary.totalUnits} un. declaradas)
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-[#1A2C71] mb-1.5">
                              Peso Total para {formatResidueType(tipoId)} (kg)
                            </label>
                            <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Weight size={18} />
                              </div>
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={pesosPorTipo[tipoId] || ""}
                                onChange={(e) =>
                                  setPesosPorTipo((prev) => ({
                                    ...prev,
                                    [tipoId]: e.target.value,
                                  }))
                                }
                                className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 text-sm font-extrabold text-[#1A2C71] transition focus:border-[#1A2C71] focus:outline-none focus:ring-2 focus:ring-[#1A2C71]/20"
                                placeholder="Ex: 12.5"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                                <span className="text-slate-500 text-xs font-bold">kg</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resumo do Total Acumulado */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale size={16} /> Total Geral Aferido
                    </span>
                    <span className="text-lg font-black text-emerald-900">
                      {Object.values(pesosPorTipo)
                        .reduce((sum, v) => sum + (Number(v) || 0), 0)
                        .toFixed(2)}{" "}
                      kg
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-13 bg-[#0B6B53] hover:bg-[#085240] text-white font-bold text-base shadow-md"
                      disabled={isProcessingBatch}
                    >
                      <CheckCheck className="mr-2 h-5 w-5" />
                      {isProcessingBatch ? "Registrando Coleta..." : "Confirmar Coleta por Resíduo"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </RoleShell>
  );
}
