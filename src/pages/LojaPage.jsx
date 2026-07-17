import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Gift,
  Megaphone,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  WalletCards,
  X,
} from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { joinCampaign, listActiveCampaigns, listMyCampaignSubscriptions } from "../services/campaigns";
import {
  listActiveRaffles,
  listMyRaffleTickets,
  listMyVoucherRedemptions,
  listVouchers,
  redeemVoucher,
} from "../services/rewards";
import { getPointsStatement } from "../services/points";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { formatCalendarDate } from "../utils/dates";

const tabs = [
  { id: "campanhas", label: "Campanhas", Icon: Megaphone },
  { id: "sorteios", label: "Sorteios", Icon: Star },
  { id: "vouchers", label: "Vouchers", Icon: Ticket },
  { id: "recompensas", label: "Minhas recompensas", Icon: WalletCards },
];

const normalizeStatus = (status) => String(status || "").toLowerCase();
const isRaffleClosed = (raffle) =>
  normalizeStatus(raffle.status) === "encerrado" || Boolean(raffle.resultado);

function ConfirmSpendModal({ item, balance, onCancel, onConfirm, isPending }) {
  if (!item) return null;
  const remaining = Number(balance || 0) - Number(item.custo_pontos || 0);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="confirm-spend-title">
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Confirmar resgate</p>
            <h2 id="confirm-spend-title" className="mt-1 text-2xl font-black text-[#1F4E79]">{item.titulo}</h2>
          </div>
          <button type="button" onClick={onCancel} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Fechar confirmação"><X size={21} /></button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">O código promocional será gerado imediatamente e ficará salvo em Minhas recompensas.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4"><small className="font-bold text-slate-500">Custo</small><strong className="mt-1 block text-xl text-[#1F4E79]">{item.custo_pontos} pts</strong></div>
          <div className={`rounded-2xl p-4 ${remaining >= 0 ? "bg-emerald-50" : "bg-red-50"}`}><small className={`font-bold ${remaining >= 0 ? "text-emerald-700" : "text-red-700"}`}>Saldo restante</small><strong className={`mt-1 block text-xl ${remaining >= 0 ? "text-emerald-700" : "text-red-700"}`}>{remaining} pts</strong></div>
        </div>
        {remaining < 0 ? <InlineAlert variant="error" className="mt-4">Você não possui pontos suficientes para este resgate.</InlineAlert> : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="button" onClick={onConfirm} disabled={remaining < 0 || isPending}>{isPending ? "Resgatando..." : "Confirmar"}</Button>
        </div>
      </div>
    </div>
  );
}

function CampaignsTab({ campaigns, subscriptions, isLoading, isError, joinMutation }) {
  if (isLoading) return <LoadingState title="Carregando campanhas..." />;
  if (isError) return <ErrorState title="Não foi possível carregar as campanhas." />;
  if (!campaigns.length) return <EmptyState icon={Megaphone} title="Nenhuma campanha ativa." description="Novas ações de marcas parceiras aparecerão aqui." />;
  const subscribedIds = new Set(subscriptions.map((item) => Number(item.campanha_id)));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {campaigns.map((campaign) => {
        const subscribed = subscribedIds.has(Number(campaign.id));
        const joining = joinMutation.isPending && Number(joinMutation.variables) === Number(campaign.id);
        return (
          <article key={campaign.id} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0B6B53] text-white">{campaign.patrocinador_logo_url ? <img src={campaign.patrocinador_logo_url} alt="" className="h-full w-full object-cover" /> : <Megaphone size={26} />}</span>
              <div className="min-w-0"><p className="text-xs font-black uppercase tracking-wider text-[#0B6B53]">{campaign.patrocinador || "Parceiro Residuum"}</p><h3 className="mt-1 text-xl font-black text-[#1F4E79]">{campaign.titulo}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{campaign.descricao || "Campanha de engajamento Residuum."}</p></div>
            </div>
            <div className="mt-5 grid gap-2 rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-600 sm:grid-cols-2">
              <span className="flex items-center gap-2"><Gift size={17} /> +{campaign.pontos_recompensa} pontos</span>
              <span className="flex items-center gap-2"><CalendarDays size={17} /> Até {campaign.data_fim ? formatCalendarDate(campaign.data_fim) : "sem limite"}</span>
            </div>
            <Button type="button" className="mt-4 w-full" disabled={subscribed || joinMutation.isPending} onClick={() => joinMutation.mutate(campaign.id)}>
              {subscribed ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Você já participa</> : joining ? "Confirmando participação..." : `Participe e ganhe ${campaign.pontos_recompensa} pts`}
            </Button>
          </article>
        );
      })}
    </div>
  );
}

function RafflesTab({ raffles, isLoading, isError }) {
  if (isLoading) return <LoadingState title="Carregando sorteios..." />;
  if (isError) return <ErrorState title="Não foi possível carregar os sorteios." />;
  if (!raffles.length) return <EmptyState icon={Trophy} title="Nenhum sorteio disponível." description="Os próximos prêmios aparecerão aqui." />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {raffles.map((raffle) => {
        const closed = isRaffleClosed(raffle);
        return (
          <article key={raffle.id} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4"><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${closed ? "bg-slate-100 text-slate-500" : "bg-sky-100 text-[#1F4E79]"}`}><Star size={27} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-black text-[#1F4E79]">{raffle.titulo}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${closed ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>{closed ? "encerrado" : "ativo"}</span></div><p className="mt-1 text-sm font-semibold text-slate-500">{raffle.patrocinador ? `Oferecido por ${raffle.patrocinador}` : "Sorteio Residuum"}</p></div></div>
            <div className="mt-4 grid grid-cols-2 gap-3"><span className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-600"><Gift className="mb-1" size={16} />{raffle.custo_pontos} pts</span><span className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-600"><CalendarDays className="mb-1" size={16} />{raffle.data_fim ? formatCalendarDate(raffle.data_fim) : "Sem limite"}</span></div>
            {raffle.resultado ? <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">Vencedor: {raffle.resultado.vencedor_nome} · bilhete #{raffle.resultado.numero}</p> : null}
            <Link to={`/sorteios/${raffle.id}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#1F4E79] px-4 text-sm font-bold text-white hover:bg-[#173B5C]">{closed ? "Ver resultado" : "Ver detalhes e participar"}</Link>
          </article>
        );
      })}
    </div>
  );
}

function VouchersTab({ vouchers, isLoading, isError, onRedeem }) {
  if (isLoading) return <LoadingState title="Carregando vouchers..." />;
  if (isError) return <ErrorState title="Não foi possível carregar os vouchers." />;
  if (!vouchers.length) return <EmptyState icon={Ticket} title="Nenhum voucher disponível." description="Novos benefícios aparecerão aqui quando forem publicados." />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {vouchers.map((voucher) => (
        <article key={voucher.id} className="rounded-2xl border border-emerald-100 bg-[#ECFFF4] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B6B53]"><Ticket size={23} /></span><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">{voucher.quantidade_disponivel || 0} disponíveis</span></div>
          <p className="mt-4 text-xs font-black uppercase tracking-wider text-[#0B6B53]">{voucher.parceiro || "Parceiro Residuum"}</p><h3 className="mt-1 text-lg font-black text-[#1F4E79]">{voucher.titulo}</h3><p className="mt-2 text-sm text-slate-600">{voucher.descricao || "Benefício disponível para troca direta."}</p>
          <Button type="button" onClick={() => onRedeem(voucher)} disabled={(voucher.quantidade_disponivel || 0) <= 0} className="mt-5 w-full bg-[#0B6B53] hover:bg-emerald-800">Resgatar por {voucher.custo_pontos} pts</Button>
        </article>
      ))}
    </div>
  );
}

function RewardsTab({ redemptions, tickets, isLoading }) {
  if (isLoading) return <LoadingState title="Carregando suas recompensas..." />;
  if (!redemptions.length && !tickets.length) return <EmptyState icon={Sparkles} title="Você ainda não possui recompensas." description="Vouchers resgatados e bilhetes aparecerão aqui." />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {redemptions.map((item) => <article key={`voucher-${item.id}`} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Voucher ativo</p><h3 className="mt-1 font-black text-[#1F4E79]">{item.titulo || "Voucher Residuum"}</h3><p className="mt-4 break-all rounded-xl bg-white px-3 py-3 font-mono text-lg font-black tracking-wider text-[#0B6B53]">{item.codigo}</p><p className="mt-2 text-xs font-semibold text-slate-500">{item.parceiro || "Parceiro Residuum"} · {item.pontos_utilizados} pts</p></article>)}
      {tickets.map((item) => <article key={`ticket-${item.id}`} className="rounded-2xl border border-sky-200 bg-sky-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-sky-700">Bilhete confirmado</p><h3 className="mt-1 font-black text-[#1F4E79]">{item.titulo || "Sorteio Residuum"}</h3><p className="mt-4 text-3xl font-black text-[#1F4E79]">#{String(item.numero).padStart(4, "0")}</p><p className="mt-2 text-xs font-semibold text-slate-500">{item.premio || "Prêmio informado no sorteio"}</p><Link to={`/sorteios/${item.sorteio_id}`} className="mt-3 inline-flex text-xs font-black text-[#1F4E79]">Ver sorteio e resultado</Link></article>)}
    </div>
  );
}

export default function LojaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("aba");
  const activeTab = tabs.some((tab) => tab.id === requestedTab) ? requestedTab : "campanhas";
  const [feedback, setFeedback] = useState(null);
  const [voucherToRedeem, setVoucherToRedeem] = useState(null);
  const queryClient = useQueryClient();

  const pointsQuery = useQuery({ queryKey: queryKeys.pointsStatement, queryFn: getPointsStatement });
  const campaignsQuery = useQuery({ queryKey: queryKeys.campaigns, queryFn: listActiveCampaigns });
  const subscriptionsQuery = useQuery({ queryKey: queryKeys.campaignSubscriptions, queryFn: listMyCampaignSubscriptions });
  const rafflesQuery = useQuery({ queryKey: queryKeys.raffles, queryFn: listActiveRaffles });
  const vouchersQuery = useQuery({ queryKey: queryKeys.vouchers, queryFn: listVouchers });
  const redemptionsQuery = useQuery({ queryKey: queryKeys.myVoucherRedemptions, queryFn: listMyVoucherRedemptions });
  const ticketsQuery = useQuery({ queryKey: queryKeys.myRaffleTickets, queryFn: listMyRaffleTickets });

  const joinMutation = useMutation({
    mutationFn: joinCampaign,
    onMutate: () => setFeedback(null),
    onSuccess: (subscription) => {
      setFeedback({ type: "success", text: `Participação confirmada. ${subscription.pontos_concedidos || 0} pontos foram adicionados à carteira.` });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignSubscriptions });
      queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
    onError: (error) => setFeedback({ type: "error", text: getApiErrorMessage(error, "Não foi possível participar desta campanha.") }),
  });

  const redeemMutation = useMutation({
    mutationFn: redeemVoucher,
    onSuccess: (redemption) => {
      setVoucherToRedeem(null);
      setFeedback({ type: "success", text: `Voucher resgatado. O código ${redemption.codigo} já está em Minhas recompensas.` });
      queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers });
      queryClient.invalidateQueries({ queryKey: queryKeys.myVoucherRedemptions });
    },
    onError: (error) => setFeedback({ type: "error", text: getApiErrorMessage(error, "Não foi possível resgatar este voucher.") }),
  });

  const setTab = (tab) => {
    setFeedback(null);
    setSearchParams({ aba: tab });
  };
  const balance = pointsQuery.data?.pontuacao_total || 0;

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-32 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#123a5a] p-6 text-white shadow-lg sm:p-8">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader eyebrow="Benefícios Residuum" title="Loja" description="Ganhe pontos em campanhas e descartes. Use seu saldo em sorteios e vouchers." className="[&_h1]:text-white [&_p]:text-white/75 [&_span]:text-emerald-300" />
            <div className="min-w-48 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70"><ShoppingBag size={16} /> Seu saldo</p><strong className="mt-1 block text-3xl font-black">{pointsQuery.isLoading ? "..." : balance} <span className="text-base text-emerald-300">pts</span></strong></div>
          </div>
        </section>

        <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" aria-label="Seções da loja">
          {tabs.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => setTab(id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${activeTab === id ? "bg-[#1F4E79] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-[#1F4E79]"}`} aria-current={activeTab === id ? "page" : undefined}><Icon size={17} />{label}</button>)}
        </nav>

        {feedback ? <InlineAlert variant={feedback.type} title={feedback.type === "success" ? "Tudo certo" : "Atenção"}>{feedback.text}</InlineAlert> : null}

        <SectionCard title={tabs.find((tab) => tab.id === activeTab)?.label} description={activeTab === "campanhas" ? "Participe de ações e aumente seu saldo." : activeTab === "sorteios" ? "Use pontos para concorrer a grandes prêmios." : activeTab === "vouchers" ? "Troque pontos por benefícios imediatos." : "Consulte códigos e bilhetes vinculados à sua conta."}>
          {activeTab === "campanhas" ? <CampaignsTab campaigns={campaignsQuery.data || []} subscriptions={subscriptionsQuery.data || []} isLoading={campaignsQuery.isLoading || subscriptionsQuery.isLoading} isError={campaignsQuery.isError || subscriptionsQuery.isError} joinMutation={joinMutation} /> : null}
          {activeTab === "sorteios" ? <RafflesTab raffles={rafflesQuery.data || []} isLoading={rafflesQuery.isLoading} isError={rafflesQuery.isError} /> : null}
          {activeTab === "vouchers" ? <VouchersTab vouchers={vouchersQuery.data || []} isLoading={vouchersQuery.isLoading} isError={vouchersQuery.isError} onRedeem={setVoucherToRedeem} /> : null}
          {activeTab === "recompensas" ? <RewardsTab redemptions={redemptionsQuery.data || []} tickets={ticketsQuery.data || []} isLoading={redemptionsQuery.isLoading || ticketsQuery.isLoading} /> : null}
        </SectionCard>
      </div>

      <ConfirmSpendModal item={voucherToRedeem} balance={balance} isPending={redeemMutation.isPending} onCancel={() => setVoucherToRedeem(null)} onConfirm={() => redeemMutation.mutate(voucherToRedeem)} />
    </RoleShell>
  );
}
