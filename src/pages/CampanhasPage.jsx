import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronRight,
  Gift,
  Megaphone,
  Plus,
  ArrowLeft,
} from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import { listCampanhas } from "../services/admin";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

export default function CampanhasPage() {
  const navigate = useNavigate();
  
  const { data: todasCampanhas = [], isLoading, isError, error } = useQuery({
    queryKey: ["campanhas"],
    queryFn: listCampanhas,
  });

  const campanhasAtivas = todasCampanhas.filter(
    (campanha) => campanha.status === "ativa"
  ).length;

  return (
    <AdminShell>
      <div className="space-y-5">
        <PageHeader
          title="Campanhas"
          description="Gestao administrativa de campanhas e empresas apoiadoras."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
          }
        />

        <ResumoCampanhas
          total={todasCampanhas.length}
          ativas={campanhasAtivas}
        />

        <SectionCard
          title="Campanhas cadastradas"
          description="Acompanhe status, periodo e patrocinador das campanhas."
          action={
            <Button
              type="button"
              onClick={() => navigate("/nova-campanha")}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Nova campanha
            </Button>
          }
        >
          {isLoading ? (
            <LoadingState title="Carregando campanhas..." />
          ) : isError ? (
            <ErrorState title={getApiErrorMessage(error, "Não foi possível carregar as campanhas.")} />
          ) : todasCampanhas.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {todasCampanhas.map((campanha) => (
                <CardCampanha
                  key={campanha.id}
                  campanha={campanha}
                  onClick={() => navigate(`/campanhas/${campanha.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma campanha encontrada"
              description="Crie uma campanha para organizar ações de engajamento e premiacao."
              actionLabel="Criar campanha"
              onAction={() => navigate("/nova-campanha")}
            />
          )}
        </SectionCard>

        <CampanhasEncerradas />
      </div>
    </AdminShell>
  );
}

function ResumoCampanhas({ total, ativas }) {
  const cards = [
    { label: "Total", value: total },
    { label: "Ativas", value: ativas },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm"
        >
          <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
            {item.label}
          </span>
          <strong className="mt-2 block text-2xl font-extrabold text-[var(--color-primary)]">
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

function CardCampanha({ campanha, onClick }) {
  const dataFim = campanha.data_fim ? new Date(campanha.data_fim).toLocaleDateString("pt-BR") : "Sem data fim";

  return (
    <article className="relative rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm transition hover:border-[var(--color-primary)]/40">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-2"
      >
        <div className="grid grid-cols-[52px_1fr] gap-3 sm:grid-cols-[60px_1fr]">
          <LogoCampanha patrocinador={campanha.patrocinador} logoUrl={campanha.patrocinador_logo_url} />

          <div className="min-w-0 pr-9">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold leading-6 text-[var(--color-primary)]">
                {campanha.titulo}
              </h2>

              <StatusBadge status={campanha.status} />
            </div>

            <p className="mt-1 text-sm font-bold text-[var(--color-accent)]">
              {campanha.patrocinador}
            </p>

            <div className="mt-3 grid gap-2 text-sm font-medium text-[var(--color-text-muted)]">
              <InfoLinha icon={CalendarDays} texto={`Até ${dataFim}`} />
              <InfoLinha icon={Gift} texto={`${campanha.pontos_recompensa} pontos`} />
            </div>
          </div>
        </div>

        <span className="mt-4 inline-flex items-center text-sm font-bold text-[var(--color-primary)]">
          Ver detalhes
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </span>
      </button>
    </article>
  );
}

function LogoCampanha({ patrocinador, logoUrl }) {
  if (logoUrl) {
    return (
      <img src={logoUrl} alt={patrocinador} className="h-[52px] w-[52px] rounded-2xl object-cover sm:h-[60px] sm:w-[60px]" />
    );
  }
  const label = patrocinador ? patrocinador.charAt(0).toUpperCase() : "N";
  return (
    <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[var(--color-primary)] text-xl font-extrabold text-white sm:h-[60px] sm:w-[60px]">
      {label}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "ativa") {
    return <Badge variant="success">Ativa</Badge>;
  }

  return <Badge variant="warning">{status}</Badge>;
}

function InfoLinha({ icon: Icon, texto }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
      <span className="min-w-0 break-words">{texto}</span>
    </div>
  );
}

function CampanhasEncerradas() {
  return (
    <SectionCard
      title="Campanhas encerradas"
      description="Histórico de ações finalizadas."
      className="h-full"
    >
      <EmptyState
        icon={Gift}
        title="Nenhuma campanha encerrada"
        description="Campanhas finalizadas aparecerao aqui quando existirem dados."
        className="py-6"
      />
    </SectionCard>
  );
}

