import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Coins, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import InlineAlert from "../components/ui/InlineAlert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { getPendingDiscards } from "../services/discards";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

const POINTS_PER_KG = 10;

const formatKg = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export default function UserPointsManagementPage() {
  const navigate = useNavigate();
  const { data: pendingDiscards = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.pendingDiscards,
    queryFn: getPendingDiscards,
  });

  const summary = useMemo(() => {
    const grouped = new Map();

    pendingDiscards.forEach((item) => {
      const key = item.usuario_id || item.usuario_email || item.usuario_nome;
      const current = grouped.get(key) || {
        id: key,
        nome: item.usuario_nome || "Usuário pendente",
        email: item.usuario_email || "Sem e-mail informado",
        descartes: 0,
        quantidade: 0,
        pontosEstimados: 0,
      };

      const quantidade = Number(item.quantidade || 0);

      current.descartes += 1;
      current.quantidade += quantidade;
      current.pontosEstimados += Math.round(quantidade * POINTS_PER_KG);
      grouped.set(key, current);
    });

    return Array.from(grouped.values()).sort((a, b) => b.pontosEstimados - a.pontosEstimados);
  }, [pendingDiscards]);

  const totalUsuarios = summary.length;
  const totalPontosEstimados = summary.reduce((sum, user) => sum + user.pontosEstimados, 0);

  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Pontuação dos usuários"
          title="Gestão operacional de pontuação"
          description="Acompanhe usuários com descartes pendentes e a projeção de pontos antes da confirmação final."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate('/aprovacao')} className="w-full sm:w-auto">
              Abrir aprovações
            </Button>
          }
        />

        <InlineAlert variant="info" title="Leitura operacional">
          Esta tela consolida os descartes pendentes por usuário com base no backend atual. A pontuação final só entra após a confirmação na etapa de aprovação.
        </InlineAlert>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Usuários aguardando" value={String(totalUsuarios)} icon={Users} />
          <MetricCard label="Pontos estimados" value={String(totalPontosEstimados)} icon={Coins} />
          <MetricCard label="Descartes pendentes" value={String(pendingDiscards.length)} icon={ArrowRight} />
        </section>

        <SectionCard
          title="Usuários na fila de pontuação"
          description="Baseado nos descartes pendentes já retornados pela API operacional."
        >
          {isLoading ? <LoadingState title="Carregando pontuação dos usuários..." /> : null}
          {isError ? <ErrorState title={getApiErrorMessage(error, 'Não foi possível carregar a fila de pontuação.')} /> : null}

          {!isLoading && !isError ? (
            summary.length ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {summary.map((user) => (
                  <article key={user.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold text-[var(--color-primary)]">{user.nome}</h3>
                        <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">{user.email}</p>
                      </div>
                      <Badge variant="warning">Pendente</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <DataTile label="Descartes" value={String(user.descartes)} />
                      <DataTile label="Quantidade" value={`${formatKg(user.quantidade)} kg`} />
                      <DataTile label="Pontos" value={`+${user.pontosEstimados}`} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum usuário aguardando pontuação."
                description="Quando houver descartes pendentes vinculados ao seu ponto, os usuários aparecerão aqui."
                icon={Users}
              />
            )
          ) : null}
        </SectionCard>
      </div>
    </RoleShell>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold text-[var(--color-primary)]">{value}</p>
          <p className="mt-1 text-sm font-bold text-[var(--color-text-muted)]">{label}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function DataTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-3">
      <p className="text-xs font-bold uppercase text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-[var(--color-primary)]">{value}</p>
    </div>
  );
}
