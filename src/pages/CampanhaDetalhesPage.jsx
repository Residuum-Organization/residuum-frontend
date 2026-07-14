import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Info,
  MapPin,
  Recycle,
  Sparkles,
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



export default function CampanhaDetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: campanhas = [], isLoading, isError, error } = useQuery({
    queryKey: ["campanhas"],
    queryFn: listCampanhas,
  });

  if (isLoading) {
    return (
      <AdminShell>
        <LoadingState title="Carregando detalhes da campanha..." />
      </AdminShell>
    );
  }

  if (isError) {
    return (
      <AdminShell>
        <ErrorState title={getApiErrorMessage(error, "Não foi possível carregar a campanha.")} />
      </AdminShell>
    );
  }

  const campanha = campanhas.find((item) => String(item.id) === String(id));

  if (!campanha) {
    return (
      <AdminShell>
        <div className="space-y-5">
          <PageHeader
            title="Campanha não encontrada"
            action={
              <Button type="button" variant="secondary" onClick={() => navigate("/campanhas")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            }
          />
          <EmptyState
            title="Campanha não encontrada"
            description="Essa campanha pode ter sido removida ou não existe."
            actionLabel="Voltar para campanhas"
            onAction={() => navigate("/campanhas")}
          />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <PageHeader
            title={campanha.titulo}
            description="Detalhes e regras."
            action={
              <Button type="button" variant="secondary" onClick={() => navigate("/campanhas")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            }
          />
        </div>

        <SectionCard>
          <CabecalhoCampanha campanha={campanha} />
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <Metrica label="Status" value={campanha.status} />
          <Metrica label="Período" value={`${campanha.data_inicio ? new Date(campanha.data_inicio).toLocaleDateString("pt-BR") : 'Início indefinido'} até ${campanha.data_fim ? new Date(campanha.data_fim).toLocaleDateString("pt-BR") : 'Sem prazo'}`} />
        </div>

        <SectionCard
          title="Informações da campanha"
          description="Consulte orientações, marca e prêmios."
        >
          <div className="flex flex-col gap-6 pt-2">
            <div>
              <h3 className="mb-4 text-base font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                Descrição
              </h3>
              <DescricaoCampanha campanha={campanha} />
            </div>

            <div>
              <h3 className="mb-4 text-base font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                Sobre a Marca
              </h3>
              <SobreMarca campanha={campanha} />
            </div>

            <div>
              <h3 className="mb-4 text-base font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                Prêmios
              </h3>
              <Premios campanha={campanha} />
            </div>
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function CabecalhoCampanha({ campanha }) {
  const dataInicio = campanha.data_inicio ? new Date(campanha.data_inicio).toLocaleDateString("pt-BR") : "Início indefinido";
  const dataFim = campanha.data_fim ? new Date(campanha.data_fim).toLocaleDateString("pt-BR") : "Sem prazo";
  const periodo = `${dataInicio} até ${dataFim}`;

  return (
    <div className="grid gap-4 md:grid-cols-[72px_1fr_auto] md:items-start">
      <LogoCampanha patrocinador={campanha.patrocinador} logoUrl={campanha.patrocinador_logo_url} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-extrabold leading-7 text-[var(--color-primary)]">
            {campanha.titulo}
          </h2>

          <StatusBadge status={campanha.status} />
        </div>

        <p className="mt-1 text-sm font-bold text-[var(--color-accent)]">
          {campanha.patrocinador}
        </p>

        <div className="mt-4 grid gap-2 text-sm font-medium text-[var(--color-text-muted)] sm:grid-cols-3">
          <Meta icon={CalendarDays} texto={periodo} />
          <Meta icon={Award} texto={`${campanha.pontos_recompensa} pontos`} />
        </div>
      </div>
    </div>
  );
}

function LogoCampanha({ patrocinador, logoUrl }) {
  if (logoUrl) {
    return (
      <img src={logoUrl} alt={patrocinador} className="h-16 w-16 rounded-2xl object-cover" />
    );
  }
  const label = patrocinador ? patrocinador.charAt(0).toUpperCase() : "N";
  return (
    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-primary)] text-2xl font-extrabold text-white">
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

function Meta({ icon: Icon, texto }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
      <span className="truncate">{texto}</span>
    </div>
  );
}

function Metrica({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
      <strong className="mt-1 block text-lg font-extrabold text-[var(--color-primary)]">
        {value}
      </strong>
    </div>
  );
}



function DescricaoCampanha({ campanha }) {
  return (
    <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
      <h4 className="flex items-center text-sm font-extrabold uppercase tracking-widest text-indigo-800 mb-2">
        <Info className="h-4 w-4 mr-2" />
        Regras e Detalhes Adicionais
      </h4>
      <p className="text-sm font-medium text-indigo-900/80 leading-relaxed whitespace-pre-wrap">
        {campanha.descricao || "Esta campanha não possui regras adicionais ou descrição específica."}
      </p>
    </div>
  );
}

function SobreMarca({ campanha }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="shrink-0 p-1 bg-white border border-[var(--color-border)] rounded-2xl shadow-sm">
        <LogoCampanha patrocinador={campanha.patrocinador} logoUrl={campanha.patrocinador_logo_url} />
      </div>

      <div className="text-center sm:text-left">
        <h3 className="text-lg font-extrabold text-[var(--color-text)]">
          {campanha.patrocinador}
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">
          Apoiadora oficial desta campanha na plataforma. A marca está comprometida com o engajamento e a sustentabilidade no descarte correto.
        </p>
      </div>
    </div>
  );
}

function Premios({ campanha }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <div className="absolute -right-4 -top-4 text-emerald-100 opacity-50">
        <Award className="h-32 w-32" />
      </div>
      
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-emerald-900">
            Recompensa Garantida
          </h3>
          <p className="mt-1 text-sm font-medium text-emerald-700/80">
            O participante ganhará <strong className="text-emerald-800 font-extrabold">{campanha.pontos_recompensa} pontos</strong> ao concluir a ação.
          </p>
        </div>
      </div>
    </div>
  );
}
