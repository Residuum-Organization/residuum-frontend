import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, Gift, Megaphone, Package, Target } from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { getCampaign, joinCampaign, listMyCampaignSubscriptions } from "../services/campaigns";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { formatCalendarDate } from "../utils/dates";

const formatPeriod = (start, end) => {
  if (start && end) return `${formatCalendarDate(start)} a ${formatCalendarDate(end)}`;
  if (end) return `Até ${formatCalendarDate(end)}`;
  if (start) return `A partir de ${formatCalendarDate(start)}`;
  return "Sem prazo definido";
};

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B6B53]"><Icon size={20} aria-hidden="true" /></span>
      <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-black text-[#1A2C71]">{value}</p></div>
    </div>
  );
}

export default function CampanhaMoradorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);

  const campaignQuery = useQuery({ queryKey: queryKeys.campaignDetails(id), queryFn: () => getCampaign(id), retry: false });
  const subscriptionsQuery = useQuery({ queryKey: queryKeys.campaignSubscriptions, queryFn: listMyCampaignSubscriptions });

  const joinMutation = useMutation({
    mutationFn: joinCampaign,
    onMutate: () => setFeedback(null),
    onSuccess: (subscription) => {
      const points = subscription.pontos_concedidos || 0;
      setFeedback({ type: "success", text: points > 0 ? `Participação confirmada. ${points} pontos foram adicionados à carteira.` : "Participação confirmada." });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignSubscriptions });
      queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
    onError: (error) => setFeedback({ type: "error", text: getApiErrorMessage(error, "Não foi possível participar desta campanha.") }),
  });

  const campaign = campaignQuery.data;
  const subscribed = (subscriptionsQuery.data || []).some((item) => Number(item.campanha_id) === Number(id));

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-32 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-5">
        <Link to="/loja?aba=campanhas" className="inline-flex items-center gap-2 text-sm font-bold text-[#1A2C71] hover:underline"><ArrowLeft size={16} aria-hidden="true" /> Voltar para a loja</Link>

        {campaignQuery.isLoading ? <LoadingState title="Carregando campanha..." /> : null}

        {campaignQuery.isError ? (
          <EmptyState icon={Megaphone} title="Campanha indisponível." description="Ela pode ter sido encerrada, ainda não ter começado ou não existir." actionLabel="Ver campanhas" onAction={() => navigate("/loja?aba=campanhas")} />
        ) : null}

        {campaign ? (
          <>
            <PageHeader eyebrow={campaign.patrocinador || "Parceiro Residuum"} title={campaign.titulo} description={campaign.descricao || "Nenhuma descrição publicada para esta campanha."} />

            {feedback ? <InlineAlert variant={feedback.type} title={feedback.type === "success" ? "Tudo certo" : "Atenção"}>{feedback.text}</InlineAlert> : null}

            <SectionCard title="Resumo" description="O que você ganha e por quanto tempo a campanha vale.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem icon={Gift} label="Recompensa" value={`+${campaign.pontos_recompensa || 0} pontos`} />
                <InfoItem icon={CalendarDays} label="Vigência" value={formatPeriod(campaign.data_inicio, campaign.data_fim)} />
                {campaign.produto_elegivel ? <InfoItem icon={Package} label="Produto ou material" value={campaign.produto_elegivel} /> : null}
                {campaign.meta_quantidade ? <InfoItem icon={Target} label="Meta" value={`${campaign.meta_quantidade} unidades`} /> : null}
              </div>
            </SectionCard>

            <SectionCard title="Condições de participação" description="Leia antes de participar.">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{campaign.condicoes || "Esta campanha não publicou condições adicionais."}</p>
              <p className="mt-4 text-xs font-semibold text-slate-500">Pontos são benefícios da plataforma e não podem ser trocados por dinheiro. Participar não gera nenhuma cobrança.</p>
            </SectionCard>

            <Button type="button" className="w-full sm:w-auto sm:px-10" disabled={subscribed || joinMutation.isPending || subscriptionsQuery.isLoading} onClick={() => joinMutation.mutate(campaign.id)}>
              {subscribed ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Você já participa</> : joinMutation.isPending ? "Confirmando participação..." : "Participar da campanha"}
            </Button>
          </>
        ) : null}
      </div>
    </RoleShell>
  );
}
