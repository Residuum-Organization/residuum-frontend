import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Star, Ticket, Pencil, Trash2, Trophy, X, Square } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import {
  listAllVouchers,
  listAllRaffles,
  createVoucher,
  createRaffle,
  updateRaffle,
  deleteRaffle,
  updateVoucher,
  deleteVoucher,
  drawRaffleWinner,
} from "../services/rewards";
import {
  formatCalendarDate,
  getTodayInputValue,
  toBusinessDayISOString,
  toDateInputValue,
} from "../utils/dates";

const isRaffleEnded = (raffle) =>
  raffle.status === "encerrado" ||
  Boolean(raffle.resultado) ||
  Boolean(raffle.data_fim && new Date(raffle.data_fim).getTime() <= Date.now());

export default function AdminSorteiosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: vouchers = [],
    isLoading: isLoadingVouchers,
    isError: isErrorVouchers,
  } = useQuery({
    queryKey: ["admin_vouchers"],
    queryFn: listAllVouchers,
  });

  const {
    data: sorteios = [],
    isLoading: isLoadingSorteios,
    isError: isErrorSorteios,
  } = useQuery({
    queryKey: ["admin_sorteios"],
    queryFn: listAllRaffles,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const sorteiosEmAndamento = sorteios.filter((sorteio) => !isRaffleEnded(sorteio));
  const sorteiosEncerrados = sorteios.filter(isRaffleEnded);

  const deleteVoucherMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_vouchers"] }),
  });

  const deleteSorteioMutation = useMutation({
    mutationFn: deleteRaffle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_sorteios"] }),
  });

  const drawMutation = useMutation({
    mutationFn: drawRaffleWinner,
    onSuccess: (result) => {
      setFeedback({ type: "success", text: `Vencedor publicado: ${result.vencedor_nome}, bilhete #${result.numero}.` });
      queryClient.invalidateQueries({ queryKey: ["admin_sorteios"] });
    },
    onError: (error) => setFeedback({ type: "error", text: error.message }),
  });

  const closeSorteioMutation = useMutation({
    mutationFn: (sorteioId) =>
      updateRaffle(sorteioId, {
        status: "encerrado",
        data_fim: new Date().toISOString(),
      }),
    onSuccess: () => {
      setFeedback({
        type: "success",
        text: "Sorteio encerrado. Agora você pode apurar o vencedor.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin_sorteios"] });
    },
    onError: (error) => setFeedback({ type: "error", text: error.message }),
  });

  const handleCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reward) => {
    setEditData(reward);
    setIsModalOpen(true);
  };

  const handleDelete = (reward) => {
    if (!window.confirm("Deseja realmente deletar esta recompensa?")) return;
    if (reward.type === "voucher") {
      deleteVoucherMutation.mutate(reward.id);
    } else {
      deleteSorteioMutation.mutate(reward.id);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <PageHeader
          title="Sorteios e Vouchers"
          description="Gestão de vouchers e sorteios disponíveis para os moradores trocarem por pontos."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button type="button" onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" /> Nova recompensa
              </Button>
            </div>
          }
        />

        {feedback ? <div className={`rounded-2xl border p-4 text-sm font-bold ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{feedback.text}</div> : null}

        <SectionCard
          title="Vouchers Ativos"
          description="Cupons de desconto e produtos para troca direta."
        >
          {isLoadingVouchers ? (
            <LoadingState title="Carregando vouchers..." />
          ) : isErrorVouchers ? (
            <ErrorState title="Não foi possível carregar os vouchers." />
          ) : vouchers.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {vouchers.map((v) => (
                <RewardCard
                  key={`voucher-${v.id}`}
                  reward={{ ...v, type: "voucher" }}
                  onEdit={() => handleEdit({ ...v, type: "voucher" })}
                  onDelete={() => handleDelete({ ...v, type: "voucher" })}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum voucher cadastrado"
              description="Adicione vouchers para incentivar os moradores."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Sorteios em Andamento"
          description="Recebendo participações ou aguardando a data de encerramento."
        >
          {isLoadingSorteios ? (
            <LoadingState title="Carregando sorteios..." />
          ) : isErrorSorteios ? (
            <ErrorState title="Não foi possível carregar os sorteios." />
          ) : sorteiosEmAndamento.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {sorteiosEmAndamento.map((s) => (
                <RewardCard
                  key={`sorteio-${s.id}`}
                  reward={{ ...s, type: "sorteio" }}
                  onEdit={() => handleEdit({ ...s, type: "sorteio" })}
                  onDelete={() => handleDelete({ ...s, type: "sorteio" })}
                  onEnd={() => {
                    if (window.confirm("Encerrar as participações deste sorteio agora?")) {
                      setFeedback(null);
                      closeSorteioMutation.mutate(s.id);
                    }
                  }}
                  onDraw={() => {
                    if (window.confirm("Confirmar a apuração? O vencedor será publicado e não poderá ser sorteado novamente.")) {
                      setFeedback(null);
                      drawMutation.mutate(s.id);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum sorteio em andamento"
              description="Crie um novo sorteio ou consulte os resultados encerrados abaixo."
            />
          )}
        </SectionCard>

        {!isLoadingSorteios && !isErrorSorteios ? (
          <SectionCard
            title="Sorteios Encerrados e Resultados"
            description="Histórico de sorteios finalizados, aguardando apuração ou com vencedor publicado."
          >
            {sorteiosEncerrados.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {sorteiosEncerrados.map((s) => (
                  <RewardCard
                    key={`sorteio-encerrado-${s.id}`}
                    reward={{ ...s, type: "sorteio" }}
                    onDelete={() => handleDelete({ ...s, type: "sorteio" })}
                    onDraw={() => {
                      if (window.confirm("Confirmar a apuração? O vencedor será publicado e não poderá ser sorteado novamente.")) {
                        setFeedback(null);
                        drawMutation.mutate(s.id);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum sorteio encerrado"
                description="Os sorteios finalizados e seus vencedores aparecerão aqui."
              />
            )}
          </SectionCard>
        ) : null}
      </div>

      {isModalOpen && (
        <NovaRecompensaModal 
          onClose={() => { setIsModalOpen(false); setEditData(null); }} 
          editData={editData} 
        />
      )}
    </AdminShell>
  );
}

function RewardCard({ reward, onEdit, onDelete, onDraw, onEnd }) {
  const isSorteio = reward.type === "sorteio";
  const isEnded = isSorteio && isRaffleEnded(reward);
  const hasResult = Boolean(reward.resultado);

  return (
    <article
      className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm transition ${
        hasResult
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            hasResult
              ? "bg-emerald-100 text-emerald-700"
              : isSorteio
              ? "bg-blue-100 text-[#1A2C71]"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {hasResult ? <Trophy size={24} /> : isSorteio ? <Star size={24} /> : <Ticket size={24} />}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#1a3a4a]">
            {reward.title || reward.titulo}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-gray-500">
            Custo:{" "}
            <strong className="text-[#1A2C71]">
              {reward.pontos || reward.custo_pontos} pontos
            </strong>
          </p>
          <div className="mt-2 flex gap-2">
            <Badge variant={isSorteio ? (isEnded ? (hasResult ? "success" : "warning") : "primary") : "success"}>
              {isSorteio
                ? `${isEnded ? "Encerrado em" : "Sorteio em"}: ${formatCalendarDate(reward.data_fim || reward.date)}`
                : `Disponíveis: ${
                    reward.quantidade_disponivel || reward.available
                  }`}
            </Badge>
          </div>
          {hasResult ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-white px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Resultado publicado
              </p>
              <p className="mt-1 text-sm font-extrabold text-[#0B6B53]">
                {reward.resultado.vencedor_nome}
                <span className="ml-2 text-xs">Bilhete #{reward.resultado.numero}</span>
              </p>
            </div>
          ) : isEnded ? (
            <p className="mt-2 text-xs font-extrabold text-amber-700">
              Aguardando apuração do vencedor.
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {isSorteio && !isEnded ? (
          <button
            onClick={onEnd}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-700"
            title="Encerrar sorteio"
          >
            <Square size={17} />
          </button>
        ) : null}
        {isSorteio && isEnded && !hasResult ? (
          <button
            onClick={onDraw}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"
            title="Apurar vencedor"
          >
            <Trophy size={18} />
          </button>
        ) : null}
        {!isSorteio || !isEnded ? (
          <button
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#1A2C71]"
            title="Editar"
          >
            <Pencil size={18} />
          </button>
        ) : null}
        {!hasResult ? (
          <button
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            title="Deletar"
          >
            <Trash2 size={18} />
          </button>
        ) : null}
      </div>
    </article>
  );
}

function NovaRecompensaModal({ onClose, editData }) {
  const [tipo, setTipo] = useState(editData ? editData.type : "voucher");
  const [titulo, setTitulo] = useState(editData ? (editData.title || editData.titulo || "") : "");
  const [custoPontos, setCustoPontos] = useState(editData ? (editData.pontos || editData.custo_pontos || "") : "");
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(editData ? (editData.quantidade_disponivel || editData.available || "") : "");
  const [dataInicio, setDataInicio] = useState(
    editData?.data_inicio ? toDateInputValue(editData.data_inicio) : getTodayInputValue()
  );
  const [dataFim, setDataFim] = useState(
    editData?.data_fim ? toDateInputValue(editData.data_fim) : ""
  );
  const [parceiro, setParceiro] = useState(editData ? (editData.parceiro || "") : "");
  const [premio, setPremio] = useState(editData ? (editData.premio || "") : "");
  const queryClient = useQueryClient();

  const voucherMutation = useMutation({
    mutationFn: (payload) => editData ? updateVoucher(editData.id, payload) : createVoucher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_vouchers"] });
      onClose();
    },
  });

  const sorteioMutation = useMutation({
    mutationFn: (payload) => editData ? updateRaffle(editData.id, payload) : createRaffle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_sorteios"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipo === "voucher") {
      voucherMutation.mutate({
        titulo,
        custo_pontos: Number(custoPontos),
        quantidade_disponivel: Number(quantidadeDisponivel),
        status: "ativo",
        parceiro: parceiro || "Sistema",
      });
    } else {
      sorteioMutation.mutate({
        titulo,
        custo_pontos: Number(custoPontos),
        premio: premio || titulo,
        status: "ativo",
        data_inicio: toBusinessDayISOString(dataInicio),
        data_fim: toBusinessDayISOString(dataFim, true),
      });
    }
  };

  const isSubmitting = voucherMutation.isPending || sorteioMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-[#1a3a4a]">{editData ? "Editar" : "Criar"} Sorteio ou Voucher</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        <form className="p-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a3a4a]">
              O que você deseja criar?
            </label>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                type="button"
                onClick={() => !editData && setTipo("voucher")}
                disabled={!!editData}
                className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-4 font-bold transition-all border-2 ${
                  tipo === "voucher"
                    ? 'border-[#1A2C71] bg-blue-50 text-[#1A2C71] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-[#1A2C71]/50 hover:bg-slate-50'
                } ${!!editData && tipo !== "voucher" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Ticket size={20} />
                Voucher
              </button>
              <button
                type="button"
                onClick={() => !editData && setTipo("sorteio")}
                disabled={!!editData}
                className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-4 font-bold transition-all border-2 ${
                  tipo === "sorteio"
                    ? 'border-[#1A2C71] bg-blue-50 text-[#1A2C71] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-[#1A2C71]/50 hover:bg-slate-50'
                } ${!!editData && tipo !== "sorteio" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Star size={20} />
                Sorteio
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={tipo === "voucher" ? "Ex: Desconto de R$ 50" : "Ex: Sorteio de Fim de Ano"}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
            />
          </div>

          {tipo === "voucher" ? (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
                Parceiro (Empresa/Patrocinador)
              </label>
              <input
                type="text"
                value={parceiro}
                onChange={(e) => setParceiro(e.target.value)}
                placeholder="Ex: Mercado Livre"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
                Prêmio
              </label>
              <input
                type="text"
                value={premio}
                onChange={(e) => setPremio(e.target.value)}
                placeholder="Ex: 01 Smart TV 55 polegadas"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
              Custo em Pontos
            </label>
            <input
              type="number"
              min="1"
              value={custoPontos}
              onChange={(e) => setCustoPontos(e.target.value)}
              placeholder={tipo === "voucher" ? "Ex: 500" : "Ex: 50"}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
            />
          </div>

          {tipo === "voucher" ? (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
                Quantidade Disponível
              </label>
              <input
                type="number"
                min="1"
                value={quantidadeDisponivel}
                onChange={(e) => setQuantidadeDisponivel(e.target.value)}
                placeholder="Ex: 100"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
                  Início das Participações
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#1a3a4a]">
                  Fim das Participações
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1A2C71]"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar {tipo === "voucher" ? "Voucher" : "Sorteio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
