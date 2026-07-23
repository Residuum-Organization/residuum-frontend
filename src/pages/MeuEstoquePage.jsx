import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookText,
  CircleDot,
  FlaskConical,
  Trash2,
  Wine,
  ArrowLeft,
  Search,
  Pencil,
  Check,
  Layers3,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import InlineAlert from "../components/ui/InlineAlert";
import {
  listInventory,
  removeInventoryItem,
  updateInventoryItem,
} from "../services/inventory";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

const POINTS_PER_KG = 10;

const getItemIcon = (tipo) => {
  const normalizedType = String(tipo || "").toLowerCase();
  if (normalizedType === "metal" || normalizedType === "aluminio")
    return CircleDot;
  if (normalizedType === "papel" || normalizedType === "papelao")
    return BookText;
  if (normalizedType === "plastico") return FlaskConical;
  return Wine;
};

const typeLabels = {
  plastico: "Plástico",
  metal: "Metal",
  aluminio: "Alumínio",
  papel: "Papel",
  papelao: "Papelão",
  vidro: "Vidro",
};

const formatResidueType = (tipo) => {
  const normalized = String(tipo || "").toLowerCase();
  if (typeLabels[normalized]) return typeLabels[normalized];
  return String(tipo || "resíduo")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatQuantity = (value) => {
  const quantity = Number(value || 0);
  return quantity.toLocaleString("pt-BR", {
    minimumFractionDigits: Number.isInteger(quantity) ? 0 : 1,
    maximumFractionDigits: 2,
  });
};

const getEstimatedPoints = (quantity) =>
  Math.round(Number(quantity || 0) * POINTS_PER_KG);

const getAvailableQuantity = (item) =>
  Number(
    item.quantidade_disponivel ??
      Math.max(
        Number(item.quantidade || 0) - Number(item.quantidade_reservada || 0),
        0
      )
  );

export default function MeuEstoquePage() {
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: itens = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.inventory,
    queryFn: () => listInventory(),
    select: (items) =>
      items.filter(
        (item) =>
          item.status !== "cancelado" &&
          (Number(item.quantidade || 0) > 0 ||
            Number(item.quantidade_reservada || 0) > 0)
      ),
  });

  const availableTypes = [
    "Todos",
    ...Array.from(
      new Set(itens.map((item) => formatResidueType(item.tipo_residuo)))
    ).sort(),
  ];

  const filteredItens = itens.filter((item) => {
    const matchesQuery =
      !searchQuery ||
      String(item.descricao || formatResidueType(item.tipo_residuo))
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "Todos" ||
      formatResidueType(item.tipo_residuo) === selectedType;
    return matchesQuery && matchesType;
  });

  useEffect(() => {
    const availableIds = new Set(
      itens
        .filter((item) => getAvailableQuantity(item) > 0)
        .map((item) => String(item.id))
    );
    setSelectedItemIds((current) => {
      const next = current.filter((id) => availableIds.has(String(id)));
      return next.length === current.length ? current : next;
    });
  }, [itens]);

  const selectedCount = selectedItemIds.length;
  const availableItemIds = itens
    .filter((item) => getAvailableQuantity(item) > 0)
    .map((item) => String(item.id));

  const toggleItemSelection = (item) => {
    if (getAvailableQuantity(item) <= 0) return;
    const itemId = String(item.id);
    setFeedback(null);
    setSelectedItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const continueWithSelection = () => {
    if (!selectedCount) return;
    navigate("/validacao-presenca", {
      state: { selectedItemIds },
    });
  };

  const transferFullInventory = () => {
    if (!availableItemIds.length) return;
    navigate("/validacao-presenca", {
      state: { selectedItemIds: availableItemIds },
    });
  };

  const updateMutation = useMutation({
    mutationFn: ({ itemId, payload }) => updateInventoryItem(itemId, payload),
    onSuccess: () => {
      setFeedback({
        tone: "success",
        message: "Estoque atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
    },
    onError: (mutationError) => {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(
          mutationError,
          "Não foi possível atualizar o item."
        ),
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeInventoryItem,
    onSuccess: (_, removedItemId) => {
      setFeedback({ tone: "success", message: "Item removido do estoque." });
      setSelectedItemIds((current) =>
        current.filter((id) => id !== String(removedItemId))
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
    },
    onError: (mutationError) => {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(
          mutationError,
          "Não foi possível remover o item."
        ),
      });
    },
  });

  const isSubmitting = updateMutation.isPending || removeMutation.isPending;

  const remover = (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover este resíduo do seu estoque?"
      )
    ) {
      setFeedback(null);
      removeMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <RoleShell
        variant="morador"
        shellClassName="bg-[var(--color-surface)]"
        contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28"
      >
        <LoadingState
          title="Carregando estoque..."
          className="mx-auto mt-10 w-full max-w-md"
        />
      </RoleShell>
    );
  }

  if (isError) {
    return (
      <RoleShell
        variant="morador"
        shellClassName="bg-[var(--color-surface)]"
        contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28"
      >
        <div className="space-y-5">
          <PageHeader
            title="Meu Estoque"
            description="Acompanhe os resíduos cadastrados para entrega."
          />
          <ErrorState
            title={getApiErrorMessage(
              error,
              "Não foi possível carregar o estoque."
            )}
          />
        </div>
      </RoleShell>
    );
  }

  return (
    <RoleShell
      variant="morador"
      shellClassName="bg-[var(--color-surface)]"
      contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28"
    >
      <div className="space-y-5">
        <PageHeader
          title="Meu Estoque"
          description="Cadastre seus resíduos antes de ir ao ponto de coleta."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/cadastrar-residuo")}
              >
                Adicionar resíduo
              </Button>
              <Button
                type="button"
                onClick={transferFullInventory}
                disabled={!availableItemIds.length}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Layers3 className="mr-2 h-4 w-4" />
                Enviar estoque completo
              </Button>
            </div>
          }
        />

        {feedback ? (
          <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert>
        ) : null}

        <SectionCard
          title="Itens no estoque"
          description="Gerencie a quantidade disponível e siga para a validação presencial quando estiver pronto."
          action={
            <span className="inline-flex min-h-10 items-center rounded-full bg-[#1F4E79] px-4 text-sm font-bold text-white">
              {filteredItens.length} itens
            </span>
          }
        >
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar pelo nome do resíduo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#1F4E79] focus:ring-1 focus:ring-[#1F4E79]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedType === type
                      ? "bg-[#1F4E79] text-white"
                      : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {selectedCount ? (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-[0_10px_28px_rgba(5,150,105,0.08)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Layers3 size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-emerald-900">
                    {selectedCount} resíduo{selectedCount === 1 ? "" : "s"}{" "}
                    selecionado{selectedCount === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs font-medium text-emerald-700">
                    Continue escolhendo ou avance para definir o ponto de
                    coleta.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedItemIds([])}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <X size={15} /> Limpar
                </button>
                <Button
                  type="button"
                  onClick={continueWithSelection}
                  className="min-h-10 flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs hover:bg-emerald-700 sm:flex-none"
                >
                  Enviar selecionados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          {filteredItens.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItens.map((item) => {
                const ItemIcon = getItemIcon(item.tipo_residuo);
                const quantityAvailable = getAvailableQuantity(item);
                const isSelected = selectedItemIds.includes(String(item.id));
                return (
                  <article
                    key={item.id}
                    onClick={() => toggleItemSelection(item)}
                    className={`relative rounded-2xl border p-4 shadow-sm transition-all duration-200 ${
                      quantityAvailable <= 0
                        ? "cursor-not-allowed border-[#dde1ef] bg-slate-100 opacity-70"
                        : isSelected
                        ? "cursor-pointer border-emerald-500 bg-emerald-50 shadow-[0_10px_24px_rgba(5,150,105,0.12)]"
                        : "cursor-pointer border-[#dde1ef] bg-[#f7f9fc] hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleItemSelection(item)}
                      disabled={quantityAvailable <= 0}
                      aria-label={`Selecionar ${
                        item.descricao || formatResidueType(item.tipo_residuo)
                      } para transferência`}
                      className="absolute right-4 top-4 h-6 w-6 cursor-pointer accent-emerald-600 disabled:cursor-not-allowed"
                    />

                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1F4E79] text-white">
                        <ItemIcon size={24} />
                      </div>
                      <div className="min-w-0 pr-8">
                        <p className="break-words text-base font-bold leading-tight text-[#1a3a4a]">
                          {item.descricao ||
                            formatResidueType(item.tipo_residuo)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Tipo: {formatResidueType(item.tipo_residuo)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-500">
                          Disponível: {formatQuantity(quantityAvailable)} kg
                          {Number(item.quantidade_reservada || 0) > 0
                            ? ` | Reservado: ${formatQuantity(
                                item.quantidade_reservada
                              )} kg`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                      <span
                        className={`inline-flex min-h-9 items-center gap-1.5 text-xs font-bold ${
                          isSelected ? "text-emerald-700" : "text-[#1F4E79]"
                        }`}
                      >
                        {isSelected
                          ? "Selecionado para transferência"
                          : "Clique para transferir"}
                        {isSelected ? (
                          <Check size={15} />
                        ) : (
                          <ArrowRight size={15} />
                        )}
                      </span>

                      <div className="ml-auto flex items-center gap-1">
                        <span className="mr-1 text-xs font-extrabold text-green-700">
                          +{getEstimatedPoints(quantityAvailable)} pts
                        </span>
                        <button
                          type="button"
                          aria-label="Editar item"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate("/cadastrar-residuo", { state: { item } });
                          }}
                          disabled={isSubmitting}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#1F4E79] disabled:opacity-50"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          aria-label="Remover item"
                          onClick={(event) => {
                            event.stopPropagation();
                            remover(item.id);
                          }}
                          disabled={isSubmitting}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Seu estoque está vazio."
              description="Cadastre um resíduo para começar a organizar sua próxima entrega."
              actionLabel="Cadastrar resíduo"
              onAction={() => navigate("/cadastrar-residuo")}
            />
          )}
        </SectionCard>
      </div>
    </RoleShell>
  );
}
