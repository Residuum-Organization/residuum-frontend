import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Star, Ticket, Pencil, Trash2, X } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import {
  listVouchers,
  listActiveRaffles,
  createVoucher,
  createRaffle,
} from "../services/rewards";

export default function AdminSorteiosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: vouchers = [],
    isLoading: isLoadingVouchers,
    isError: isErrorVouchers,
  } = useQuery({
    queryKey: ["admin_vouchers"],
    queryFn: listVouchers,
  });

  const {
    data: sorteios = [],
    isLoading: isLoadingSorteios,
    isError: isErrorSorteios,
  } = useQuery({
    queryKey: ["admin_sorteios"],
    queryFn: listActiveRaffles,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
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
          description="Sorteios programados para datas específicas."
        >
          {isLoadingSorteios ? (
            <LoadingState title="Carregando sorteios..." />
          ) : isErrorSorteios ? (
            <ErrorState title="Não foi possível carregar os sorteios." />
          ) : sorteios.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {sorteios.map((s) => (
                <RewardCard
                  key={`sorteio-${s.id}`}
                  reward={{ ...s, type: "sorteio" }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum sorteio cadastrado"
              description="Crie sorteios de grandes prêmios."
            />
          )}
        </SectionCard>
      </div>

      {isModalOpen && (
        <NovaRecompensaModal onClose={() => setIsModalOpen(false)} />
      )}
    </AdminShell>
  );
}

function RewardCard({ reward }) {
  const isSorteio = reward.type === "sorteio";

  return (
    <article className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm transition hover:border-[var(--color-primary)]/40">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isSorteio
              ? "bg-blue-100 text-[#1F4E79]"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {isSorteio ? <Star size={24} /> : <Ticket size={24} />}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#1a3a4a]">
            {reward.title || reward.titulo}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-gray-500">
            Custo:{" "}
            <strong className="text-[#1F4E79]">
              {reward.pontos || reward.custo_pontos} pts
            </strong>
          </p>
          <div className="mt-2 flex gap-2">
            <Badge variant={isSorteio ? "primary" : "success"}>
              {isSorteio
                ? `Sorteio em: ${new Date(
                    reward.data_fim || reward.date
                  ).toLocaleDateString("pt-BR")}`
                : `Disponíveis: ${
                    reward.quantidade_disponivel || reward.available
                  }`}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#1F4E79]">
          <Pencil size={18} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600">
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}

function NovaRecompensaModal({ onClose }) {
  const [tipo, setTipo] = useState("voucher");
  const [titulo, setTitulo] = useState("");
  const [custoPontos, setCustoPontos] = useState("");
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState("");
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split("T")[0]);
  const [dataFim, setDataFim] = useState("");
  const [parceiro, setParceiro] = useState("");
  const [premio, setPremio] = useState("");
  const queryClient = useQueryClient();

  const voucherMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_vouchers"] });
      onClose();
    },
  });

  const sorteioMutation = useMutation({
    mutationFn: createRaffle,
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
        data_inicio: dataInicio ? new Date(dataInicio).toISOString() : null,
        data_fim: dataFim ? new Date(dataFim).toISOString() : null,
      });
    }
  };

  const isSubmitting = voucherMutation.isPending || sorteioMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-[#1a3a4a]">Criar Sorteio ou Voucher</h2>
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
                onClick={() => setTipo("voucher")}
                className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-4 font-bold transition-all border-2 ${
                  tipo === "voucher"
                    ? 'border-[#1F4E79] bg-blue-50 text-[#1F4E79] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-[#1F4E79]/50 hover:bg-slate-50'
                }`}
              >
                <Ticket size={20} />
                Voucher
              </button>
              <button
                type="button"
                onClick={() => setTipo("sorteio")}
                className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-4 font-bold transition-all border-2 ${
                  tipo === "sorteio"
                    ? 'border-[#1F4E79] bg-blue-50 text-[#1F4E79] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-[#1F4E79]/50 hover:bg-slate-50'
                }`}
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4E79]"
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
