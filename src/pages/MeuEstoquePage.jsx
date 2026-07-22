import React, { useState } from "react";
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

export default function MeuEstoquePage() {
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
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
    onSuccess: () => {
      setFeedback({ tone: "success", message: "Item removido do estoque." });
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
                onClick={() => navigate("/validacao-presenca?todos=1")}
                disabled={!itens.length}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Enviar todos
                <ArrowRight className="ml-2 h-4 w-4" />
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

          {filteredItens.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItens.map((item) => {
                const ItemIcon = getItemIcon(item.tipo_residuo);
                const quantityAvailable = Number(item.quantidade || 0);
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[#dde1ef] bg-[#f7f9fc] p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1F4E79] text-white">
                        <ItemIcon size={24} />
                      </div>
                      <div className="min-w-0">
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

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/validacao-presenca?itemId=${item.id}`)
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#1F4E79] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#173B5C]"
                      >
                        Enviar para validação
                        <ArrowRight size={16} />
                      </button>

                      <div className="flex items-center gap-1">
                        <span className="mr-3 text-sm font-bold text-green-700">
                          +{getEstimatedPoints(quantityAvailable)} pts
                        </span>
                        <button
                          type="button"
                          aria-label="Editar item"
                          onClick={() =>
                            navigate("/cadastrar-residuo", { state: { item } })
                          }
                          disabled={isSubmitting}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#1F4E79] disabled:opacity-50"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          aria-label="Remover item"
                          onClick={() => remover(item.id)}
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
