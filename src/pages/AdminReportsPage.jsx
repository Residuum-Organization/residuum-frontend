import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  FileBarChart,
  History,
  MapPinOff,
  RotateCcw,
  ShieldCheck,
  Trophy,
  UserCog,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import { downloadAdminReport, downloadAdminReportPDF, listAuditEntries } from "../services/admin";

const reports = [
  {
    id: "descartes",
    title: "Descartes e Coletas",
    description: "Histórico de unidades descartadas por moradores e o peso real (kg) recolhido pelas cooperativas em cada ponto.",
  },
  {
    id: "usuarios",
    title: "Usuários",
    description: "Lista de todos os moradores, cooperativas e ecopontos com seus respectivos saldos de pontuação.",
  },
  {
    id: "auditoria",
    title: "Auditoria de Segurança",
    description: "Registro das ações críticas: aprovações, edições e alterações feitas pelos administradores.",
  },
];

const auditActions = {
  "sorteio.apurar": {
    title: "Resultado de sorteio publicado",
    category: "Sorteios",
    Icon: Trophy,
    iconClass: "bg-amber-100 text-amber-700 ring-amber-200",
  },
  "usuario.atualizar": {
    title: "Cadastro de usuário atualizado",
    category: "Usuários",
    Icon: UserCog,
    iconClass: "bg-sky-100 text-sky-700 ring-sky-200",
  },
  "usuario.alterar_role": {
    title: "Perfil de acesso alterado",
    category: "Segurança",
    Icon: ShieldCheck,
    iconClass: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  },
  "usuario.ajuste_pontuacao": {
    title: "Pontuação ajustada",
    category: "Usuários",
    Icon: UserRound,
    iconClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  "usuario.remover": {
    title: "Usuário removido",
    category: "Usuários",
    Icon: XCircle,
    iconClass: "bg-rose-100 text-rose-700 ring-rose-200",
  },
  "descarte.reverter": {
    title: "Descarte revertido",
    category: "Descartes",
    Icon: RotateCcw,
    iconClass: "bg-orange-100 text-orange-700 ring-orange-200",
  },
  "descarte.rejeitar": {
    title: "Descarte rejeitado",
    category: "Descartes",
    Icon: XCircle,
    iconClass: "bg-rose-100 text-rose-700 ring-rose-200",
  },
  "ponto_coleta.desativar": {
    title: "Ponto de coleta desativado",
    category: "Pontos de coleta",
    Icon: MapPinOff,
    iconClass: "bg-slate-200 text-slate-700 ring-slate-300",
  },
  "solicitacao_ponto_coleta.aprovar": {
    title: "Solicitação de ponto aprovada",
    category: "Pontos de coleta",
    Icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  "solicitacao_ponto_coleta.rejeitar": {
    title: "Solicitação de ponto rejeitada",
    category: "Pontos de coleta",
    Icon: XCircle,
    iconClass: "bg-rose-100 text-rose-700 ring-rose-200",
  },
};

const targetLabels = {
  usuario: "Usuário",
  descarte: "Descarte",
  ponto_coleta: "Ponto de coleta",
  solicitacao_ponto_coleta: "Solicitação",
  sorteio: "Sorteio",
};

const auditDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Manaus",
});

const getAuditDescription = (entry) => {
  const payload = entry.payload || {};

  if (entry.action === "sorteio.apurar") {
    const winner = payload.vencedor_nome || "Vencedor não identificado";
    const ticket = payload.numero
      ? `bilhete #${payload.numero}`
      : "bilhete não informado";
    return `${winner} venceu com o ${ticket}.`;
  }
  if (entry.action === "usuario.alterar_role") {
    return `Perfil alterado de ${payload.de || "não informado"} para ${
      payload.para || "não informado"
    }.`;
  }
  if (entry.action === "usuario.ajuste_pontuacao" && payload.delta != null) {
    return `Ajuste de ${payload.delta > 0 ? "+" : ""}${
      payload.delta
    } ponto(s), com saldo final de ${payload.para ?? "não informado"}.`;
  }
  if (entry.action === "usuario.remover" && payload.nome) {
    return `${payload.nome} foi removido da plataforma.`;
  }
  if (entry.action?.endsWith(".rejeitar") && entry.motivo) {
    return `Motivo da rejeição: ${entry.motivo}`;
  }
  if (entry.motivo) {
    return "A ação foi registrada com uma justificativa administrativa.";
  }

  return "Alteração administrativa registrada para rastreabilidade.";
};

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = React.useState(null);
  const auditQuery = useQuery({
    queryKey: ["admin-audit"],
    queryFn: listAuditEntries,
  });
  const downloadMutation = useMutation({
    mutationFn: downloadAdminReport,
    onSuccess: () =>
      setFeedback({ type: "success", text: "Relatorio gerado com sucesso em CSV." }),
    onError: (error) => setFeedback({ type: "error", text: error.message }),
  });

  const downloadPdfMutation = useMutation({
    mutationFn: ({ id, title }) => downloadAdminReportPDF(id, title),
    onSuccess: () =>
      setFeedback({ type: "success", text: "Relatorio gerado com sucesso em PDF." }),
    onError: (error) => setFeedback({ type: "error", text: error.message }),
  });

  const entries = auditQuery.data?.itens || [];

  return (
    <AdminShell>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Governanca"
          title="Relatórios e auditoria"
          description="Exporte dados operacionais e acompanhe as alterações realizadas no painel."
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
          <InlineAlert variant={feedback.type} description={feedback.text} />
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <SectionCard key={report.id} className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#1A2C71]">
                <FileBarChart />
              </div>
              <h2 className="mt-4 text-lg font-black text-[var(--color-primary)]">
                {report.title}
              </h2>
              <p className="mt-1 flex-1 text-sm text-[var(--color-text-muted)]">
                {report.description}
              </p>
              <div className="mt-5 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  disabled
                  className="w-full opacity-60 cursor-not-allowed"
                >
                  <Clock3 className="mr-2 h-4 w-4" /> Em breve
                </Button>
              </div>
            </SectionCard>
          ))}
        </section>

        <SectionCard
          title="Atividade administrativa recente"
          description="Linha do tempo das ações sensíveis realizadas no painel."
          action={<Badge variant="primary">{entries.length} registro(s)</Badge>}
        >
          {auditQuery.isLoading ? (
            <LoadingState title="Carregando auditoria..." />
          ) : null}
          {auditQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar o histórico administrativo."
              actionLabel="Tentar novamente"
              onAction={() => auditQuery.refetch()}
            />
          ) : null}
          {!auditQuery.isLoading && !auditQuery.isError && !entries.length ? (
            <EmptyState title="Nenhuma atividade registrada." icon={History} />
          ) : null}
          {entries.length ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <AuditEntry key={entry.id} entry={entry} />
              ))}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function AuditEntry({ entry }) {
  const presentation = auditActions[entry.action] || {
    title: "Alteração administrativa",
    category: "Sistema",
    Icon: History,
    iconClass: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  const { Icon } = presentation;
  const payload = entry.payload || {};
  const targetLabel = targetLabels[entry.target_type] || "Registro";
  const targetName =
    entry.action === "sorteio.apurar" && payload.titulo
      ? payload.titulo
      : entry.target_id
      ? `${targetLabel} #${entry.target_id}`
      : targetLabel;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md hover:shadow-slate-200/60 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-start">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-105 ${presentation.iconClass}`}
        >
          <Icon size={22} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              {presentation.category}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="truncate text-xs font-bold text-[#1A2C71]">
              {targetName}
            </span>
          </div>

          <h3 className="mt-1 text-base font-black text-[var(--color-primary)] sm:text-lg">
            {presentation.title}
          </h3>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
            {getAuditDescription(entry)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              <UserRound size={13} aria-hidden="true" />
              {entry.admin_nome || `Administrador ${entry.admin_id}`}
            </span>
            {entry.motivo &&
            entry.action !== "descarte.rejeitar" &&
            entry.action !== "solicitacao_ponto_coleta.rejeitar" ? (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
                Motivo: {entry.motivo}
              </span>
            ) : null}
          </div>
        </div>

        <time
          dateTime={entry.created_at}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-500 ring-1 ring-slate-200 sm:justify-self-end"
        >
          <Clock3 size={14} className="text-[#1A2C71]" aria-hidden="true" />
          {auditDateFormatter.format(new Date(entry.created_at))}
        </time>
      </div>
    </article>
  );
}
