import React, { useMemo, useState } from "react";
import { AlertTriangle, Eye, MapPin, SlidersHorizontal } from "lucide-react";

import AdminShell from "../components/admin/AdminShell";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import InlineAlert from "../components/ui/InlineAlert";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const points = [
  {
    name: "Ponto Oeste",
    address: "Rua Oeste, 101 - bairro",
    percent: 72,
    status: "Ativo",
    tone: "success",
  },
  {
    name: "Ponto Sul",
    address: "Rua Sul, 789 - bairro",
    percent: 45,
    status: "Ativo",
    tone: "success",
  },
  {
    name: "Ponto Norte",
    address: "Rua Norte, 456 - bairro",
    percent: 88,
    status: "Atencao",
    tone: "warning",
  },
  {
    name: "Ponto Leste",
    address: "Av. Leste, 123 - bairro",
    percent: 100,
    status: "Critico",
    tone: "error",
  },
];

const filters = [
  { label: "Todos", value: "all" },
  { label: "Ativos", value: "Ativo" },
  { label: "Atencao", value: "Atencao" },
  { label: "Criticos", value: "Critico" },
];

const barClassByTone = {
  success: "bg-[var(--color-accent)]",
  warning: "bg-amber-500",
  error: "bg-[var(--color-error)]",
};

export default function AdminPoints() {
  const [filter, setFilter] = useState("all");

  const filteredPoints = useMemo(() => {
    if (filter === "all") return points;
    return points.filter((point) => point.status === filter);
  }, [filter]);

  const activeCount = points.filter((point) => point.status === "Ativo").length;
  const criticalCount = points.filter((point) => point.status === "Critico").length;
  const attentionCount = points.filter((point) => point.status === "Atencao").length;
  const average = Math.round(
    points.reduce((sum, point) => sum + point.percent, 0) / points.length
  );

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Painel geral"
        title="Pontos de coleta"
        description="Acompanhamento visual dos pontos cadastrados nesta amostra administrativa."
      />

      <InlineAlert
        className="mt-5"
        variant="warning"
        title="Dados demonstrativos"
        description="Esta tela ainda usa uma lista local para exibicao. Nenhum ponto e ativado, suspenso ou alterado aqui."
      />

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Media de preenchimento" value={`${average}%`} />
        <MetricCard label="Pontos ativos" value={`${activeCount} de ${points.length}`} />
        <MetricCard label="Pontos criticos" value={criticalCount} variant="error" />
        <MetricCard label="Requerem atencao" value={attentionCount} variant="warning" />
      </section>

      <SectionCard
        className="mt-6"
        title="Lista de pontos"
        description="Status, ocupacao e endereco em cards fluidos para mobile e desktop."
        action={<Badge variant="warning">Demo</Badge>}
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtros
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
                  filter === item.value
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPoints.length === 0 ? (
          <EmptyState
            title="Nenhum ponto encontrado."
            description="Altere o filtro para visualizar outros status."
            icon={MapPin}
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filteredPoints.map((point) => (
              <PointCard key={point.name} point={point} />
            ))}
          </div>
        )}
      </SectionCard>
    </AdminShell>
  );
}

function MetricCard({ label, value, variant = "primary" }) {
  const iconClass =
    variant === "error"
      ? "text-[var(--color-error)] bg-red-50"
      : variant === "warning"
        ? "text-amber-700 bg-amber-50"
        : "text-[var(--color-primary)] bg-[var(--color-surface)]";

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold text-[var(--color-primary)]">
            {value}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--color-text-muted)]">
            {label}
          </p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
          {variant === "error" || variant === "warning" ? (
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MapPin className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
      </div>
    </div>
  );
}

function PointCard({ point }) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-[var(--color-primary)]">
              {point.name}
            </h3>
            <Badge variant={point.tone}>{point.status}</Badge>
          </div>
          <p className="mt-2 flex items-start gap-2 text-sm font-medium text-[var(--color-text-muted)]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{point.address}</span>
          </p>
        </div>

        <p className="text-3xl font-extrabold text-[var(--color-primary)]">
          {point.percent}%
        </p>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className={`h-full rounded-full ${barClassByTone[point.tone]}`}
            style={{ width: `${point.percent}%` }}
          />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
            Preenchimento atual
          </p>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] px-3 text-sm font-bold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Visualizar
          </button>
        </div>
      </div>
    </article>
  );
}
