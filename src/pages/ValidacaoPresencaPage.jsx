import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Coins,
  Loader2,
  MapPin,
  Recycle,
  Send,
  Square,
  XCircle,
} from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import LoadingButton from "../components/ui/LoadingButton";
import Button from "../components/ui/Button";
import { listInventory, transferInventoryBatch } from "../services/inventory";
import { listCollectionPoints } from "../services/collectionPoints";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

const POINTS_PER_KG = 10;

const formatResidueType = (type) =>
  String(type || "resíduo")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: Number.isInteger(Number(value || 0)) ? 0 : 1,
    maximumFractionDigits: 2,
  });

const getAvailableQuantity = (item) =>
  Number(
    item.quantidade_disponivel ??
      Math.max(
        Number(item.quantidade || 0) - Number(item.quantidade_reservada || 0),
        0
      )
  );

const getWasteIcon = () => {
  return Recycle;
};

const getWasteColor = (type) => {
  const normalized = String(type || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized === "plastico") return "text-red-600 bg-red-100";
  if (["papel", "papelao"].includes(normalized))
    return "text-blue-600 bg-blue-100";
  if (normalized === "vidro") return "text-emerald-600 bg-emerald-100";
  if (normalized === "metal") return "text-amber-500 bg-amber-100";
  if (normalized === "organico") return "text-amber-800 bg-amber-100";
  if (["eletronico", "eletronicos"].includes(normalized))
    return "text-orange-600 bg-orange-100";
  return "text-slate-600 bg-slate-100";
};

const geolocationMessage = (error) => {
  if (error?.code === 1) {
    return "A localização foi bloqueada. Libere a permissão do navegador e tente novamente.";
  }
  if (error?.code === 2) {
    return "O dispositivo não conseguiu determinar sua posição. Ative a localização e tente em um local aberto.";
  }
  if (error?.code === 3) {
    return "A localização demorou mais que o esperado. Tente novamente.";
  }
  return error?.message || "Não foi possível validar sua localização.";
};

const getPositionAttempt = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada neste dispositivo."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });

const getCurrentPosition = async () => {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await getPositionAttempt();
    } catch (error) {
      lastError = error;
      if (error?.code === 1) break;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }
  throw lastError;
};

const createIdempotencyKey = () =>
  globalThis.crypto?.randomUUID?.() ||
  `residuum-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function ValidacaoPresencaPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedPointId, setSelectedPointId] = useState(location.state?.selectedPointId ? String(location.state.selectedPointId) : "");
  const [observacao, setObservacao] = useState("");
  const [coords, setCoords] = useState(location.state?.coords || null);
  const [locationError, setLocationError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const hasPreselectedItems = Array.isArray(location.state?.selectedItemIds) && location.state.selectedItemIds.length > 0;
  const [currentStep, setCurrentStep] = useState(hasPreselectedItems ? 2 : 1);
  const hasHydratedSelectionRef = useRef(false);
  const transferAttemptRef = useRef({ signature: "", key: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: queryKeys.inventory,
    queryFn: listInventory,
    select: (items) =>
      items.filter(
        (item) => item.status !== "cancelado" && getAvailableQuantity(item) > 0
      ),
  });

  const inventory = inventoryQuery.data || [];
  const pointFilters = coords ? { lat: coords.lat, long: coords.lng } : {};
  const pointsQuery = useQuery({
    queryKey: queryKeys.collectionPoints(pointFilters),
    queryFn: () => listCollectionPoints(pointFilters),
  });

  const selectedTypes = Object.keys(selectedItems)
    .map((id) => inventory.find((item) => String(item.id) === id)?.tipo_residuo)
    .filter(Boolean)
    .map((type) => String(type).toLowerCase());
  const compatiblePoints = (pointsQuery.data || []).filter((point) => {
    const accepted = (point.tipos_residuos_aceitos || []).map((type) =>
      String(type).toLowerCase()
    );
    return selectedTypes.every((type) => accepted.includes(type));
  });
  const selectedCount = Object.keys(selectedItems).length;
  const totalWeight = Object.values(selectedItems).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );
  const totalPoints = Math.round(totalWeight * POINTS_PER_KG);

  const selectedPoint = (pointsQuery.data || []).find(
    (p) => String(p.id) === String(selectedPointId)
  );

  const selectedItemsList = Object.entries(selectedItems)
    .map(([id, qty]) => {
      const item = inventory.find((i) => String(i.id) === String(id));
      return { item, quantity: qty };
    })
    .filter((entry) => entry.item);

  const selectAll = () => {
    setSelectedItems(
      Object.fromEntries(
        inventory.map((item) => [item.id, getAvailableQuantity(item)])
      )
    );
  };

  useEffect(() => {
    if (!inventory.length || hasHydratedSelectionRef.current) return;
    hasHydratedSelectionRef.current = true;
    const requestedIds = Array.isArray(location.state?.selectedItemIds)
      ? location.state.selectedItemIds.map(String)
      : [];
    if (requestedIds.length) {
      const requestedItems = inventory.filter((item) =>
        requestedIds.includes(String(item.id))
      );
      if (requestedItems.length) {
        setSelectedItems(
          Object.fromEntries(
            requestedItems.map((item) => [item.id, getAvailableQuantity(item)])
          )
        );
        return;
      }
    }
    if (searchParams.get("todos") === "1") {
      selectAll();
      return;
    }
    const requestedId = searchParams.get("itemId");
    const item =
      inventory.find((entry) => String(entry.id) === requestedId) ||
      inventory[0];
    setSelectedItems({
      [item.id]: getAvailableQuantity(item),
    });
  }, [inventory, location.key, location.state, searchParams]);

  useEffect(() => {
    if (!hasHydratedSelectionRef.current) return;
    const inventoryById = new Map(
      inventory.map((item) => [String(item.id), item])
    );
    setSelectedItems((current) => {
      const next = Object.fromEntries(
        Object.entries(current).flatMap(([id, quantity]) => {
          const item = inventoryById.get(id);
          const maximum = item ? getAvailableQuantity(item) : 0;
          if (maximum <= 0) return [];
          return [[id, Math.min(Number(quantity) || maximum, maximum)]];
        })
      );
      const currentEntries = Object.entries(current);
      const nextEntries = Object.entries(next);
      const unchanged =
        currentEntries.length === nextEntries.length &&
        nextEntries.every(([id, quantity]) => current[id] === quantity);
      return unchanged ? current : next;
    });
  }, [inventory]);

  useEffect(() => {
    if (pointsQuery.isLoading || !pointsQuery.data) return;
    const isStillCompatible = compatiblePoints.some(
      (point) => String(point.id) === String(selectedPointId)
    );
    if (!isStillCompatible)
      setSelectedPointId(
        compatiblePoints[0] ? String(compatiblePoints[0].id) : ""
      );
  }, [compatiblePoints, selectedPointId, pointsQuery.isLoading, pointsQuery.data]);

  const toggleItem = (item) => {
    setSelectedItems((current) => {
      const next = { ...current };
      if (next[item.id] !== undefined) delete next[item.id];
      else next[item.id] = getAvailableQuantity(item);
      return next;
    });
  };

  const updateQuantity = (itemId, value, maximum) => {
    const quantity = Math.min(maximum, Math.max(1, parseInt(value, 10) || 1));
    setSelectedItems((current) => ({ ...current, [itemId]: quantity }));
  };

  const requestLocation = async () => {
    setLocationError("");
    setIsLocating(true);
    try {
      const position = await getCurrentPosition();
      setCoords(position);
      return position;
    } catch (error) {
      setLocationError(geolocationMessage(error));
      throw error;
    } finally {
      setIsLocating(false);
    }
  };

  const handleTransfer = async () => {
    setFeedback(null);
    if (!selectedCount) {
      setFeedback({
        tone: "error",
        message: "Selecione pelo menos um item do estoque.",
      });
      return;
    }
    if (!selectedPointId) {
      setFeedback({
        tone: "error",
        message: "Selecione um ponto de coleta compatível.",
      });
      return;
    }

    let currentCoords = coords;
    try {
      currentCoords = currentCoords || (await requestLocation());
    } catch (_error) {
      return;
    }

    const itemIds = Object.keys(selectedItems);
    const transferPayload = {
      itens: itemIds.map((itemId) => ({
        item_id: Number(itemId),
        quantidade: Number(selectedItems[itemId]),
      })),
      ponto_coleta_id: Number(selectedPointId),
      usuario_lat: currentCoords.lat,
      usuario_long: currentCoords.lng,
      usuario_precisao: currentCoords.accuracy,
      observacao: observacao.trim() || undefined,
    };
    const signature = JSON.stringify(transferPayload);
    if (transferAttemptRef.current.signature !== signature) {
      transferAttemptRef.current = {
        signature,
        key: createIdempotencyKey(),
      };
    }

    setIsTransferring(true);
    try {
      const transfer = await transferInventoryBatch({
        ...transferPayload,
        chave_idempotencia: transferAttemptRef.current.key,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.inventory }),
        queryClient.invalidateQueries({ queryKey: queryKeys.discardHistory }),
      ]);
      transferAttemptRef.current = { signature: "", key: "" };
      const firstItem = inventory.find(i => String(i.id) === String(itemIds[0]));
      const resolvedDesc = firstItem?.descricao || location.state?.preloadedDesc || formatResidueType(firstItem?.tipo_residuo || location.state?.preloadedType);
      const resolvedType = formatResidueType(firstItem?.tipo_residuo || location.state?.preloadedType);
      navigate("/transferencia-concluida", {
        replace: true,
        state: {
          transferId: transfer.id,
          itemCount: transfer.total_itens ?? itemIds.length,
          pointName: transfer.ponto_coleta_nome || "Ponto de coleta",
          totalPoints: transfer.pontos_estimados ?? totalPoints,
          totalWeight: transfer.peso_total ?? totalWeight,
          firstItemDesc: resolvedDesc,
          firstItemType: resolvedType,
        },
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(
          error,
          "Não foi possível enviar os resíduos para validação."
        ),
      });
    } finally {
      setIsTransferring(false);
    }
  };

  if (inventoryQuery.isLoading) {
    return (
      <RoleShell variant="morador">
        <LoadingState
          title="Carregando itens para transferência..."
          className="mx-auto mt-10 max-w-md"
        />
      </RoleShell>
    );
  }

  if (inventoryQuery.isError) {
    return (
      <RoleShell variant="morador">
        <ErrorState
          title={getApiErrorMessage(
            inventoryQuery.error,
            "Não foi possível carregar o estoque."
          )}
        />
      </RoleShell>
    );
  }

  return (
    <RoleShell
      variant="morador"
      shellClassName="bg-[var(--color-surface)]"
      contentClassName="px-4 py-4 pb-36 sm:px-6 sm:py-6 lg:px-8 lg:pb-40"
    >
      <div className="space-y-6">
        <PageHeader
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />
        {feedback ? (
          <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert>
        ) : null}

        {!inventory.length ? (
          <EmptyState
            title="Seu estoque está vazio."
            description="Cadastre um resíduo antes de solicitar a validação."
            actionLabel="Cadastrar resíduo"
            onAction={() => navigate("/cadastrar-residuo")}
            icon={Recycle}
          />
        ) : (
          <div>
            <div className="mb-8 relative">
              {/* Barra de progresso */}
              <div className="absolute top-5 left-10 right-10 sm:left-16 sm:right-16 h-1 bg-slate-200 z-0">
                <div className="absolute top-0 left-0 h-full bg-[#1A2C71] transition-all duration-300" style={{ width: `${(currentStep - 1) * 50}%` }} />
              </div>

              <div className="flex items-center justify-between px-4 sm:px-12 relative z-10">
                {[1, 2, 3].map((step) => {
                  const canClick = !isTransferring && (
                    step === 1 ||
                    (step === 2 && selectedCount > 0) ||
                    (step === 3 && selectedCount > 0 && selectedPointId && coords)
                  );

                  return (
                  <button 
                    key={step} 
                    type="button"
                    onClick={() => canClick && setCurrentStep(step)}
                    className={`flex flex-col items-center focus:outline-none ${canClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-extrabold transition-colors ${currentStep >= step ? "bg-[#1A2C71] text-white ring-4 ring-[#1A2C71]/20" : "bg-slate-200 text-slate-500"}`}>
                      {step}
                    </div>
                    <span className={`mt-2 text-xs font-bold ${currentStep >= step ? "text-[#1A2C71]" : "text-slate-400"} px-1 bg-[var(--color-surface)]`}>
                      {step === 1 ? "Resíduos" : step === 2 ? "Ponto de coleta" : "Confirmação"}
                    </span>
                  </button>
                  );
                })}
              </div>
            </div>

            {currentStep === 1 && (
              <div className="space-y-6">
                <SectionCard
                  title="1. Selecione os resíduos"
                  description="Envie um item ou todo o estoque disponível."
                  action={
                    <span className="rounded-full bg-[#1A2C71] px-3 py-1.5 text-xs font-bold text-white">
                      {selectedCount} selecionado{selectedCount === 1 ? "" : "s"}
                    </span>
                  }
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-200 transition-colors"
                    >
                      <CheckSquare size={14} />
                      Selecionar todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedItems({})}
                      className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <XCircle size={14} />
                      Limpar seleção
                    </button>
                  </div>
                  <div className="max-h-[390px] space-y-3 overflow-y-auto pr-1">
                    {inventory.map((item) => {
                      const selected = selectedItems[item.id] !== undefined;
                      const maximum = getAvailableQuantity(item);
                      const ItemIcon = getWasteIcon(item.tipo_residuo);
                      return (
                        <article
                          key={item.id}
                          className={`rounded-2xl border-2 p-4 ${
                            selected
                              ? "border-[#1A2C71] bg-[#f4f7fa]"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(item)}
                            className="flex w-full items-center gap-3 text-left"
                          >
                            {selected ? (
                              <CheckSquare className="text-[#1A2C71]" size={22} />
                            ) : (
                              <Square className="text-slate-300" size={22} />
                            )}
                            <span
                              className={`flex items-center justify-center rounded-xl p-2 h-10 w-10 ${
                                getWasteColor(item.tipo_residuo)
                              } ${selected ? "ring-2 ring-emerald-500 ring-offset-1" : ""}`}
                            >
                              <ItemIcon size={21} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                {formatResidueType(item.tipo_residuo)}
                              </p>
                              <strong className="mt-0.5 block truncate text-sm text-[#1a3a4a]">
                                {item.descricao || formatResidueType(item.tipo_residuo)}
                              </strong>
                              <small className="mt-1 block text-slate-500">
                                Disponível: {formatQuantity(maximum)} un.
                              </small>
                            </span>
                          </button>
                          {selected && maximum > 1 ? (
                            <div 
                              className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-xs font-bold text-[#1A2C71]">
                                Quantidade a enviar
                              </span>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  disabled={Number(selectedItems[item.id] || 1) <= 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentVal = Number(selectedItems[item.id] || 1);
                                    if (currentVal > 1) {
                                      updateQuantity(item.id, currentVal - 1, maximum);
                                    }
                                  }}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#1A2C71] text-lg font-black text-[#1A2C71] transition-all hover:bg-[#1A2C71] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1A2C71] active:scale-95"
                                >
                                  -
                                </button>

                                <span className="min-w-[2rem] text-center text-base font-black text-[#1A2C71]">
                                  {selectedItems[item.id] || 1}
                                </span>

                                <button
                                  type="button"
                                  disabled={Number(selectedItems[item.id] || 1) >= maximum}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentVal = Number(selectedItems[item.id] || 1);
                                    if (currentVal < maximum) {
                                      updateQuantity(item.id, currentVal + 1, maximum);
                                    }
                                  }}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A2C71] text-lg font-black text-white transition-all hover:bg-[#121D4D] disabled:opacity-30 active:scale-95"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                </SectionCard>

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(2)} 
                  disabled={!selectedCount}
                  className="w-full py-4 text-base bg-[#1A2C71] hover:bg-[#1a4266]"
                >
                  Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <SectionCard
                  title="2. Escolha o ponto de coleta"
                  description="A lista considera todos os materiais selecionados e exibe os pontos mais próximos da sua localização."
                >
              {pointsQuery.isLoading ? (
                <LoadingState title="Buscando pontos compatíveis..." />
              ) : null}
              {pointsQuery.isError ? (
                <ErrorState title="Não foi possível carregar os pontos de coleta." />
              ) : null}
              {!pointsQuery.isLoading &&
              !pointsQuery.isError &&
              compatiblePoints.length ? (
                <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                  {compatiblePoints.map((point) => {
                    const selected =
                      String(point.id) === String(selectedPointId);
                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => setSelectedPointId(String(point.id))}
                        className={`w-full rounded-2xl border-2 p-4 text-left ${
                          selected
                            ? "border-[#1A2C71] bg-[#f4f7fa]"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <strong className="text-sm text-[#1a3a4a]">
                            {point.nome}
                          </strong>
                          {point.distancia_km != null ? (
                            <small className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 font-bold text-emerald-700">
                              {formatQuantity(point.distancia_km)} km
                            </small>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {point.endereco || "Endereço não informado"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {!pointsQuery.isLoading &&
              !pointsQuery.isError &&
              !compatiblePoints.length ? (
                <InlineAlert variant="warning">
                  Nenhum ponto aceita todos os resíduos selecionados.
                </InlineAlert>
              ) : null}
            </SectionCard>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(3)} 
                  disabled={!selectedPointId || !coords}
                  className="w-full py-4 text-base bg-[#1A2C71] hover:bg-[#1a4266]"
                >
                  Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentStep(1)} 
                  className="w-full py-4 text-base"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
              </div>
            </div>
            )}

            {currentStep === 3 && (
            <div className="space-y-6">
              <SectionCard
                title="3. Confirmar descarte"
                description="Confira o resumo da operação e confirme o envio dos resíduos para o ponto de coleta."
              >
                <div className="space-y-4">
                  {/* Ponto de Coleta Selecionado */}
                  {selectedPoint && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                        <MapPin size={14} className="text-[#1A2C71]" />
                        <span>PONTO DE COLETA SELECIONADO</span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#1A2C71]">
                        {selectedPoint.nome}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {selectedPoint.endereco || "Endereço não informado"}
                      </p>
                    </div>
                  )}

                  {/* Resíduos Selecionados */}
                  <div className="space-y-2">
                    <div className="max-h-[240px] space-y-2 overflow-y-auto pr-1">
                      {selectedItemsList.map(({ item, quantity }) => {
                        const ItemIcon = getWasteIcon(item.tipo_residuo);
                        return (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                          >
                            <div className="flex items-start gap-3">
                              <span className={`flex items-center justify-center rounded-xl p-2.5 h-10 w-10 shrink-0 ${getWasteColor(item.tipo_residuo)}`}>
                                <ItemIcon size={20} />
                              </span>
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                  {formatResidueType(item.tipo_residuo)}
                                </p>
                                <h5 className="text-sm font-extrabold text-[#1A2C71] truncate">
                                  {item.descricao || formatResidueType(item.tipo_residuo)}
                                </h5>
                                <p className="text-xs font-bold text-slate-500 pt-0.5">
                                  Quantidade: <strong className="text-[#1A2C71] font-black">{quantity} un.</strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mini Cards Embaixo: Quantidade e Pontos */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#1A2C71] text-white">
                          <Recycle size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quantidade</p>
                          <strong className="text-xl font-black text-[#1A2C71]">{totalWeight} un.</strong>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                          <Coins size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Pontos</p>
                          <strong className="text-xl font-black text-emerald-700">+{totalPoints}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                <LoadingButton
                  type="button"
                  onClick={handleTransfer}
                  disabled={isTransferring || !selectedCount || !selectedPointId}
                  isLoading={isTransferring}
                  loadingText="Enviando descarte..."
                  className="w-full py-4 text-base bg-emerald-600 hover:bg-emerald-700 font-bold"
                >
                  <Send size={18} className="mr-2" /> Enviar descarte
                </LoadingButton>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentStep(2)} 
                  disabled={isTransferring}
                  className="w-full py-4 text-base"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </RoleShell>
  );
}
