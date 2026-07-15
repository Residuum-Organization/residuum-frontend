import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, FileBarChart, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { downloadAdminReport, listAuditEntries } from "../services/admin";

const reports = [
  { id: "descartes", title: "Descartes", description: "Movimentacoes, quantidades, pontos e locais de entrega." },
  { id: "usuarios", title: "Usuarios", description: "Cadastros, perfis de acesso e saldos de pontos." },
  { id: "auditoria", title: "Auditoria", description: "Acoes administrativas registradas pela plataforma." },
];

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = React.useState(null);
  const auditQuery = useQuery({ queryKey: ["admin-audit"], queryFn: listAuditEntries });
  const downloadMutation = useMutation({
    mutationFn: downloadAdminReport,
    onSuccess: () => setFeedback({ type: "success", text: "Relatorio gerado com sucesso." }),
    onError: (error) => setFeedback({ type: "error", text: error.message }),
  });

  const entries = auditQuery.data?.itens || [];

  return (
    <AdminShell>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Governanca"
          title="Relatorios e auditoria"
          description="Exporte dados operacionais e acompanhe as alteracoes realizadas no painel."
          action={<Button type="button" variant="secondary" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>}
        />

        {feedback ? <InlineAlert variant={feedback.type} description={feedback.text} /> : null}

        <section className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <SectionCard key={report.id} className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#1F4E79]"><FileBarChart /></div>
              <h2 className="mt-4 text-lg font-black text-[var(--color-primary)]">{report.title}</h2>
              <p className="mt-1 flex-1 text-sm text-[var(--color-text-muted)]">{report.description}</p>
              <Button
                type="button"
                className="mt-5 w-full"
                disabled={downloadMutation.isPending}
                onClick={() => {
                  setFeedback(null);
                  downloadMutation.mutate(report.id);
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
              </Button>
            </SectionCard>
          ))}
        </section>

        <SectionCard title="Atividade administrativa recente" description="Ultimos registros de alteracao e seus responsaveis.">
          {auditQuery.isLoading ? <LoadingState title="Carregando auditoria..." /> : null}
          {!auditQuery.isLoading && !entries.length ? <EmptyState title="Nenhuma atividade registrada." icon={History} /> : null}
          {entries.length ? (
            <div className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <article key={entry.id} className="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <p className="font-extrabold text-[var(--color-primary)]">{entry.action}</p>
                    <p className="mt-1 text-[var(--color-text-muted)]">{entry.admin_nome || `Administrador ${entry.admin_id}`} | {entry.target_type || "sistema"}{entry.target_id ? ` #${entry.target_id}` : ""}</p>
                    {entry.motivo ? <p className="mt-1 text-slate-500">Motivo: {entry.motivo}</p> : null}
                  </div>
                  <time className="font-semibold text-slate-500">{new Date(entry.created_at).toLocaleString("pt-BR")}</time>
                </article>
              ))}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
