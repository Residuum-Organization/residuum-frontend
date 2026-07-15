import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, CheckCircle2, Gift, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import {
  joinCampaign,
  listActiveCampaigns,
  listMyCampaignSubscriptions,
} from "../services/campaigns";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("pt-BR")
  : "Sem data limite";

export default function CampanhasAtivasPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = React.useState(null);

  const campaignsQuery = useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: listActiveCampaigns,
  });
  const subscriptionsQuery = useQuery({
    queryKey: queryKeys.campaignSubscriptions,
    queryFn: listMyCampaignSubscriptions,
  });

  const subscribedIds = new Set(
    (subscriptionsQuery.data || []).map((item) => Number(item.campanha_id)),
  );

  const joinMutation = useMutation({
    mutationFn: joinCampaign,
    onSuccess: (subscription) => {
      setFeedback({
        type: "success",
        text: `Participacao confirmada. ${subscription.pontos_concedidos || 0} pontos foram adicionados a sua carteira.`,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaignSubscriptions });
      queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
    onError: (error) => setFeedback({
      type: "error",
      text: getApiErrorMessage(error, "Nao foi possivel participar desta campanha."),
    }),
  });

  const isLoading = campaignsQuery.isLoading || subscriptionsQuery.isLoading;
  const isError = campaignsQuery.isError || subscriptionsQuery.isError;
  const campaigns = campaignsQuery.data || [];

  return (
    <RoleShell variant="morador" contentClassName="px-4 py-4 pb-36 sm:px-6 sm:py-6 lg:px-8 lg:pb-32">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Engajamento"
          title="Campanhas ativas"
          description="Participe das acoes de marcas parceiras e receba a recompensa informada diretamente na carteira."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />

        {feedback ? (
          <InlineAlert
            variant={feedback.type}
            title={feedback.type === "success" ? "Participacao confirmada" : "Atencao"}
            description={feedback.text}
          />
        ) : null}

        {isLoading ? <LoadingState title="Carregando campanhas..." /> : null}
        {isError ? (
          <ErrorState title="Nao foi possivel carregar as campanhas e participacoes." />
        ) : null}

        {!isLoading && !isError ? (
          campaigns.length ? (
            <section className="grid gap-4 lg:grid-cols-2">
              {campaigns.map((campaign) => {
                const subscribed = subscribedIds.has(Number(campaign.id));
                const isJoining = joinMutation.isPending && Number(joinMutation.variables) === Number(campaign.id);

                return (
                  <SectionCard key={campaign.id} className="overflow-hidden border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0B6B53] text-white">
                        {campaign.patrocinador_logo_url ? (
                          <img src={campaign.patrocinador_logo_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Megaphone size={26} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black uppercase tracking-wider text-[#0B6B53]">{campaign.patrocinador}</p>
                        <h2 className="mt-1 text-xl font-black text-[var(--color-primary)]">{campaign.titulo}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{campaign.descricao || "Campanha de engajamento Residuum."}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-2 rounded-2xl bg-white/80 p-4 text-sm font-semibold text-[var(--color-text-muted)] sm:grid-cols-2">
                      <span className="flex items-center gap-2"><Gift size={17} /> {campaign.pontos_recompensa} pontos</span>
                      <span className="flex items-center gap-2"><CalendarDays size={17} /> Ate {formatDate(campaign.data_fim)}</span>
                    </div>

                    <Button
                      type="button"
                      className="mt-4 w-full"
                      disabled={subscribed || joinMutation.isPending}
                      onClick={() => {
                        setFeedback(null);
                        joinMutation.mutate(campaign.id);
                      }}
                    >
                      {subscribed ? (
                        <><CheckCircle2 className="mr-2 h-4 w-4" /> Voce ja participa</>
                      ) : isJoining ? "Confirmando participacao..." : `Participar e ganhar ${campaign.pontos_recompensa} pts`}
                    </Button>
                  </SectionCard>
                );
              })}
            </section>
          ) : (
            <EmptyState
              title="Nenhuma campanha ativa."
              description="Novas campanhas de marcas parceiras aparecerao aqui quando forem publicadas."
              icon={Megaphone}
            />
          )
        ) : null}
      </div>
    </RoleShell>
  );
}
