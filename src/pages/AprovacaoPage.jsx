import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApprovalCard from "../components/coleta-dados/ApprovalCard";
import AdminShell from "../components/admin/AdminShell";
import {
  confirmPendingDiscard,
  getPendingDiscards,
  rejectPendingDiscard,
} from "../services/discards";
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

export default function Aprovacao() {
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const {
    data: pendingDiscards = [],
    isLoading,
    isError,
    error,
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
    [pendingDiscards]
  );

  const confirmMutation = useMutation({
    mutationFn: ({ discardId, quantity }) =>
      confirmPendingDiscard(discardId, { quantidade_confirmada: quantity }),
    onSuccess: () => {
      setFeedback("Descarte confirmado com sucesso.");
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (mutationError) => {
      setFeedback(
        getApiErrorMessage(mutationError, "Não foi possível confirmar este descarte.")
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (discardId) =>
      rejectPendingDiscard(discardId, {
        motivo: "Solicitação rejeitada pela operação.",
      }),
    onSuccess: () => {
      setFeedback("Solicitação removida da fila de pendências.");
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingDiscards });
    },
    onError: (mutationError) => {
      setFeedback(
        getApiErrorMessage(mutationError, "Não foi possível rejeitar este descarte.")
      );
    },
  });

  return (
    <AdminShell contentClassName="px-5 pt-5">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1F4E79]">
            Painel Operacional
          </p>
          <h1 className="mt-1 text-3xl font-bold leading-tight text-gray-800">
            Descartes em
            <br />
            confirmação
          </h1>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Logo Residuum"
            className="w-10 object-contain"
          />
        </div>
      </header>

      <p className="mb-6 flex items-center gap-2 font-medium text-yellow-500">
        <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
        {cards.length} descartes pendentes
      </p>

      {feedback ? <p className="mb-4 text-sm font-medium text-[#1F4E79]">{feedback}</p> : null}

      {isLoading && (
        <p className="mt-10 text-center text-gray-500">Carregando pendências...</p>
      )}

      {isError && (
        <p className="mt-10 text-center text-red-500">
          {getApiErrorMessage(error, "Não foi possível carregar os descartes pendentes.")}
        </p>
      )}

      {!isLoading && !isError && cards.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          Nenhum descarte pendente no momento.
        </p>
      )}

      {cards.map((item) => (
        <ApprovalCard
          key={item.id}
          item={item}
          onAprovar={() => {
            const discard = pendingDiscards.find((entry) => entry.id_descarte === item.id);
            confirmMutation.mutate({
              discardId: item.id,
              quantity: Number(discard?.quantidade || 0),
            });
          }}
          onRejeitar={() => rejectMutation.mutate(item.id)}
        />
      ))}
    </AdminShell>
  );
}
