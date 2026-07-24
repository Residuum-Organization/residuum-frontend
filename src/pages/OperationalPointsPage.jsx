import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, ClipboardCheck, CheckCircle2, Weight, X, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import InlineAlert from "../components/ui/InlineAlert";
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

export default function OperationalPointsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [approvingDiscard, setApprovingDiscard] = useState(null);
  const [pesoEntrada, setPesoEntrada] = useState("");

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

  // If no selected point, default to the first one
  const selected = useMemo(() => {
    return points.find((point) => String(point.id) === String(selectedId)) || points[0];
  }, [points, selectedId]);

  // Make sure we select the first point on initial load
  React.useEffect(() => {
    if (!selectedId && points.length > 0) {
      setSelectedId(String(points[0].id));
    }
  }, [points, selectedId]);

  const discardsForSelectedPoint = useMemo(() => {
    if (!selected) return [];
    return pendingDiscards.filter(d => String(d.ponto_coleta_id) === String(selected.id));
  }, [pendingDiscards, selected]);

  const confirmMutation = useMutation({
    mutationFn: ({ discardId, payload }) => confirmPendingDiscard(discardId, payload),
    onSuccess: () => {
      toast.success("Descarte validado e peso registrado no sistema!");
      setApprovingDiscard(null);
      setPesoEntrada("");
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
      queryClient.invalidateQueries({ queryKey: ["operational-points"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Não foi possível validar o descarte."));
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

  return (
    <RoleShell variant="operacional" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Operação"
          title="Meus pontos de coleta"
          description="Verifique as informações dos seus locais e valide os descartes pendentes de cada um."
          action={<Button type="button" variant="secondary" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>}
        />

        {pointsQuery.isLoading ? <LoadingState title="Carregando seus locais..." /> : null}
        {!pointsQuery.isLoading && !points.length ? <EmptyState title="Nenhum local vinculado à sua conta." icon={MapPin} /> : null}

        {selected ? (
          <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <SectionCard title="Seus Locais">
              <div className="space-y-2">
                {points.map((point) => {
                  const pendingCount = pendingDiscards.filter(d => String(d.ponto_coleta_id) === String(point.id)).length;
                  return (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => setSelectedId(String(point.id))}
                      className={`relative w-full rounded-2xl border p-3 text-left font-bold transition-all ${String(point.id) === String(selected.id) ? "border-[#0B6B53] bg-emerald-50 text-[#0B6B53]" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                    >
                      {point.nome}
                      {pendingCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-white shadow-sm">
                          {pendingCount}
                        </span>
                      )}
                      <span className="mt-1 block text-xs font-medium opacity-70 uppercase">{point.status || "ativo"}</span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <div className="space-y-5">
              <SectionCard title="Informações do Local">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome do Ponto</span>
                    <strong className="text-base text-[#1A2C71]">{selected.nome}</strong>
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</span>
                    <Badge variant={selected.status === "ativo" ? "success" : "neutral"} className="uppercase">{selected.status}</Badge>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Endereço</span>
                    <p className="text-sm font-medium text-slate-700">{selected.endereco || "Não informado"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Materiais Aceitos</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(selected.tipos_residuos_aceitos || []).map(tipo => (
                        <span key={tipo} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                          {formatResidueType(tipo)}
                        </span>
                      ))}
                      {(!selected.tipos_residuos_aceitos || selected.tipos_residuos_aceitos.length === 0) && (
                        <span className="text-sm text-slate-500">Nenhum material configurado.</span>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Solicitações de Descarte" description="Analise e valide os materiais que foram deixados neste ponto de coleta.">
                {discardsQuery.isLoading ? <LoadingState title="Buscando descartes..." size="sm" /> : null}
                
                {!discardsQuery.isLoading && discardsForSelectedPoint.length === 0 ? (
                  <EmptyState 
                    icon={ClipboardCheck}
                    title="Tudo em dia!"
                    description="Não há novos descartes aguardando validação neste ponto de coleta."
                  />
                ) : null}

                {!discardsQuery.isLoading && discardsForSelectedPoint.length > 0 ? (
                  <div className="grid gap-4">
                    {discardsForSelectedPoint.map(discard => (
                      <div key={discard.id_descarte} className="flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="warning">Pendente</Badge>
                            <span className="text-xs font-semibold text-slate-500">{formatDate(discard.data_desc)}</span>
                          </div>
                          <h4 className="text-lg font-black text-[#1A2C71]">
                            {discard.inventario_item_descricao || formatResidueType(discard.tipo_residuo)}
                          </h4>
                          <p className="text-sm font-semibold text-slate-600 mt-1">
                            Usuário: <span className="font-bold text-[#1A2C71]">{discard.usuario_nome || discard.usuario_email || "Anônimo"}</span>
                          </p>
                          <p className="text-sm font-semibold text-slate-600">
                            Declarado pelo usuário: <span className="font-bold text-[#1A2C71]">{discard.quantidade} unidades</span>
                          </p>
                          {discard.observacao && (
                            <p className="text-xs font-medium text-slate-500 mt-2 bg-white/50 p-2 rounded-lg border border-amber-100 italic">
                              "{discard.observacao}"
                            </p>
                          )}
                        </div>
                        <div className="flex w-full flex-row sm:w-auto sm:flex-col gap-2 shrink-0">
                          <Button 
                            variant="primary" 
                            className="flex-1 sm:flex-none justify-center"
                            disabled={confirmMutation.isPending || rejectMutation.isPending}
                            onClick={() => setApprovingDiscard(discard)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Aprovar
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="flex-1 sm:flex-none justify-center text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            disabled={confirmMutation.isPending || rejectMutation.isPending}
                            onClick={() => rejectMutation.mutate(discard.id_descarte)}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Rejeitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </SectionCard>
            </div>
          </div>
        ) : null}
      </div>

      <Dialog.Root open={!!approvingDiscard} onOpenChange={(open) => !open && setApprovingDiscard(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm transition-opacity" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform p-4 sm:p-6 outline-none">
            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <Dialog.Title className="text-lg font-black text-[#1A2C71]">Registrar Pesagem</Dialog.Title>
                <Dialog.Close className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </Dialog.Close>
              </div>

              <div className="p-6">
                <Dialog.Description className="mb-4 text-sm font-medium text-slate-500">
                  Valide este descarte informando o peso real (kg) do material que chegou à cooperativa. Isso atualizará o estoque e creditará os pontos do usuário.
                </Dialog.Description>

                <div className="mb-5 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resumo do Material</p>
                  <p className="text-sm font-bold text-[#1A2C71]">{approvingDiscard?.inventario_item_descricao || formatResidueType(approvingDiscard?.tipo_residuo)}</p>
                  <p className="text-sm font-medium text-slate-600 mt-1">Unidades declaradas: {approvingDiscard?.quantidade}</p>
                </div>

                <form onSubmit={handleApproveSubmit} className="space-y-5">
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
                        className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pl-12 text-slate-900 transition focus:border-[#1A2C71] focus:outline-none focus:ring-2 focus:ring-[#1A2C71]/20"
                        placeholder="Ex: 15.5"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-slate-500 font-medium">kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full h-12"
                      disabled={confirmMutation.isPending}
                    >
                      {confirmMutation.isPending ? "Validando..." : "Confirmar Validação"}
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
