import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, Gift, Lock, Megaphone, Users } from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { MATERIAL_LABELS } from "../components/Campanhas/CampaignRequirementsEditor";
import { MECHANICS } from "../components/Campanhas/CampaignMechanicsEditor";
import { claimCampaignReward, claimMechanicBonus, getCampaign, getCampaignProgress, joinCampaign } from "../services/campaigns";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { formatCalendarDate } from "../utils/dates";

const formatPeriod = (start, end) => {
  if (start && end) return `${formatCalendarDate(start)} a ${formatCalendarDate(end)}`;
  if (end) return `Até ${formatCalendarDate(end)}`;
  if (start) return `A partir de ${formatCalendarDate(start)}`;
  return "Sem prazo definido";
};

const describeRequirement = (item) => {
  if (item.descricao) return item.descricao;
  const material = item.tipo_residuo ? MATERIAL_LABELS[item.tipo_residuo] || item.tipo_residuo : "qualquer material";
  return `${item.quantidade} unidade(s) de ${material}`;
};

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B6B53]"><Icon size={20} aria-hidden="true" /></span>
      <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-black text-[#1A2C71]">{value}</p></div>
    </div>
  );
}

function RequirementProgress({ item }) {
  const percent = Math.min(100, Math.round((item.atual / item.quantidade) * 100));
  return (
    <li className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-[#1A2C71]">{describeRequirement(item)}</span>
        <span className={`shrink-0 font-black ${item.cumprido ? "text-emerald-700" : "text-slate-600"}`}>{item.cumprido ? "Cumprido" : `${item.atual}/${item.quantidade}`}</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={item.atual} aria-valuemin={0} aria-valuemax={item.quantidade} aria-label={describeRequirement(item)}>
        <div className={`h-full rounded-full ${item.cumprido ? "bg-emerald-600" : "bg-[#1A2C71]"}`} style={{ width: `${percent}%` }} />
      </div>
      {(item.codigos_barras || []).length ? <p className="mt-2 text-xs font-semibold text-slate-500">Produto com código de barras {item.codigos_barras.join(", ")}</p> : null}
    </li>
  );
}

export default function CampanhaMoradorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);

  const campaignQuery = useQuery({ queryKey: queryKeys.campaignDetails(id), queryFn: () => getCampaign(id), retry: false });
  const progressQuery = useQuery({ queryKey: queryKeys.campaignProgress(id), queryFn: () => getCampaignProgress(id), enabled: campaignQuery.isSuccess });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.campaignProgress(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.campaignSubscriptions });
    queryClient.invalidateQueries({ queryKey: queryKeys.pointsStatement });
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
  };

  const joinMutation = useMutation({
    mutationFn: joinCampaign,
    onMutate: () => setFeedback(null),
    onSuccess: () => {
      setFeedback({ type: "success", text: "Você está participando. Os bônus da campanha valem a partir de agora." });
      refresh();
    },
    onError: (error) => setFeedback({ type: "error", text: getApiErrorMessage(error, "Não foi possível participar desta campanha.") }),
  });

  const claimMutation = useMutation({
    mutationFn: claimCampaignReward,
    onMutate: () => setFeedback(null),
    onSuccess: (result) => {
      setFeedback({ type: "success", text: `Recompensa recebida: ${result.pontos_concedidos} pontos foram adicionados à carteira.` });
      refresh();
    },
    onError: (error) => setFeedback({ type: "error", text: getApiErrorMessage(error, "Não foi possível receber a recompensa.") }),
  });

  const bonusMutation = useMutation({
    mutationFn: claimMechanicBonus,
    onMutate: () => setFeedback(null),
    onSuccess: (result) => {
      setFeedback({ type: "success", text: `Bônus recebido: ${result.pontos} pontos foram adicionados à carteira.` });
      refresh();
    },
    onError: (error) => setFeedback({ type: "error", text: getApiErrorMessage(error, "Não foi possível receber o bônus.") }),
  });

  const campaign = campaignQuery.data;
  const progress = progressQuery.data;
  const isPrivate = campaign?.acesso === "privada";
  const hasMissions = (progress?.missoes || []).length > 0;

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
            <PageHeader eyebrow={`${campaign.patrocinador || "Parceiro Residuum"} · ${isPrivate ? "Campanha privada" : "Campanha pública"}`} title={campaign.titulo} description={campaign.descricao || "Nenhuma descrição publicada para esta campanha."} />

            {feedback ? <InlineAlert variant={feedback.type} title={feedback.type === "success" ? "Tudo certo" : "Atenção"}>{feedback.text}</InlineAlert> : null}

            <SectionCard title="Resumo" description="O que você ganha e por quanto tempo a campanha vale.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem icon={Gift} label="Recompensa" value={campaign.pontos_recompensa > 0 ? `+${campaign.pontos_recompensa} pontos ao concluir as missões` : "Sem pontos de recompensa"} />
                <InfoItem icon={CalendarDays} label="Vigência" value={formatPeriod(campaign.data_inicio, campaign.data_fim)} />
                <InfoItem icon={isPrivate ? Lock : Users} label="Acesso" value={isPrivate ? "Privada: a entrada libera os bônus" : "Pública: qualquer morador pode participar"} />
              </div>
            </SectionCard>

            {progressQuery.isLoading ? <LoadingState title="Carregando o seu progresso..." /> : null}
            {progressQuery.isError ? <InlineAlert variant="error" title="Atenção">Não foi possível carregar o seu progresso.</InlineAlert> : null}

            {progress && progress.entrada.length ? (
              <SectionCard title="Requisitos de entrada" description="Contam a partir da sua participação. Cumpra todos para liberar os bônus desta campanha privada.">
                <ul className="grid gap-3">{progress.entrada.map((item) => <RequirementProgress key={item.id} item={item} />)}</ul>
              </SectionCard>
            ) : null}

            {progress && hasMissions ? (
              <SectionCard title="Missões" description="Contam a partir da sua participação. Conclua todas para receber a recompensa.">
                <ul className="grid gap-3">{progress.missoes.map((item) => <RequirementProgress key={item.id} item={item} />)}</ul>
              </SectionCard>
            ) : null}

            {progress && progress.mecanicas.length ? (
              <SectionCard title="Bônus da campanha" description="Contam a partir da sua participação.">
                <ul className="grid gap-3">
                  {progress.mecanicas.map((item) => {
                    const material = item.tipo_residuo ? MATERIAL_LABELS[item.tipo_residuo] || item.tipo_residuo : "o resíduo da campanha";
                    return (
                      <li key={item.tipo} className="space-y-3">
                        <RequirementProgress
                          item={{ ...item, descricao: `${MECHANICS[item.tipo]?.label || item.tipo}: recicle ${item.quantidade} unidade(s) de ${material} e ganhe +${item.pontos} pontos`, cumprido: item.cumprida }}
                        />
                        {item.concedida ? <p className="text-sm font-semibold text-slate-600">Bônus já recebido.</p> : null}
                        {item.disponivel ? (
                          <Button type="button" disabled={bonusMutation.isPending} onClick={() => bonusMutation.mutate({ campaignId: campaign.id, mechanic: item.tipo })}>
                            {bonusMutation.isPending ? "Recebendo..." : `Receber +${item.pontos} pontos`}
                          </Button>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </SectionCard>
            ) : null}

            <SectionCard title="Condições de participação" description="Leia antes de participar.">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{campaign.condicoes || "Esta campanha não publicou condições adicionais."}</p>
              <p className="mt-4 text-xs font-semibold text-slate-500">Participar é gratuito, mas só quem participa recebe os bônus da campanha. Só contam os descartes feitos depois que você participar. Pontos são benefícios da plataforma e não podem ser trocados por dinheiro.</p>
            </SectionCard>

            {progress ? (
              <div className="space-y-3">
                {!progress.participando ? (
                  <>
                    <Button type="button" className="w-full sm:w-auto sm:px-10" disabled={joinMutation.isPending} onClick={() => joinMutation.mutate(campaign.id)}>
                      {joinMutation.isPending ? "Confirmando participação..." : "Participar da campanha (grátis)"}
                    </Button>
                    <p className="text-sm font-semibold text-slate-600">Seus descartes só contam para esta campanha depois que você participar.{isPrivate ? " Depois, cumpra os requisitos de entrada para liberar os bônus." : ""}</p>
                  </>
                ) : (
                  <>
                    <p className="inline-flex items-center gap-2 text-sm font-black text-emerald-700"><CheckCircle2 size={18} aria-hidden="true" /> Você participa desta campanha</p>
                    {progress.recompensa_concedida ? <p className="text-sm font-semibold text-slate-600">Recompensa já recebida.</p> : null}
                    {isPrivate && !progress.acesso_liberado ? <p className="text-sm font-semibold text-slate-600">Cumpra os requisitos de entrada para liberar os bônus desta campanha.</p> : null}
                    {progress.recompensa_disponivel ? (
                      <div><Button type="button" className="w-full sm:w-auto sm:px-10" disabled={claimMutation.isPending} onClick={() => claimMutation.mutate(campaign.id)}>{claimMutation.isPending ? "Recebendo..." : `Receber ${progress.recompensa_pontos} pontos`}</Button></div>
                    ) : null}
                    {!progress.recompensa_concedida && !progress.recompensa_disponivel && progress.acesso_liberado && hasMissions ? <p className="text-sm font-semibold text-slate-600">Conclua todas as missões para liberar a recompensa.</p> : null}
                  </>
                )}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </RoleShell>
  );
}
