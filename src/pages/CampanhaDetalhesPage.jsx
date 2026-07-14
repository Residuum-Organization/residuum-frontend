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

const abas = [
  { id: "funciona", label: "Como funciona" },
  { id: "sobre", label: "Sobre a marca" },
  { id: "premios", label: "Premios" },
];

export default function CampanhaDetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [abaAtual, setAbaAtual] = useState("funciona");

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
            title="Campanha nao encontrada"
            description="Essa campanha pode ter sido removida ou nao existe."
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
          <Metrica label="Período" value={campanha.data_fim ? `Até ${new Date(campanha.data_fim).toLocaleDateString("pt-BR")}` : 'Sem prazo'} />
        </div>

        <SectionCard
          title="Informacoes da campanha"
          description="Consulte orientacoes, marca e premios."
        >
          <Abas abaAtual={abaAtual} setAbaAtual={setAbaAtual} />

          <div className="pt-5">
            {abaAtual === "funciona" ? (
              <ComoFunciona campanha={campanha} />
            ) : null}
            {abaAtual === "sobre" ? <SobreMarca campanha={campanha} /> : null}
            {abaAtual === "premios" ? <Premios campanha={campanha} /> : null}
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function CabecalhoCampanha({ campanha }) {
  const dataFim = campanha.data_fim ? `Até ${new Date(campanha.data_fim).toLocaleDateString("pt-BR")}` : 'Sem prazo';

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
          <Meta icon={CalendarDays} texto={dataFim} />
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

function Abas({ abaAtual, setAbaAtual }) {
  return (
    <div className="flex overflow-x-auto border-b border-[var(--color-border)]">
      {abas.map((aba) => {
        const isAtiva = abaAtual === aba.id;

        return (
          <button
            key={aba.id}
            onClick={() => setAbaAtual(aba.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition ${
              isAtiva
                ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            {aba.label}
          </button>
        );
      })}
    </div>
  );
}

function ComoFunciona({ campanha }) {
  const passos = [
    {
      titulo: "Participe da campanha",
      descricao: "Se inscreva para confirmar sua participacao na acao.",
    },
    {
      titulo: "Acumule pontos extras",
      descricao: "Você ganhará a recompensa base e poderá trocar por benefícios.",
    },
  ];

  return (
    <div className="space-y-4">
      {passos.map((passo, index) => (
        <div key={index} className="flex gap-4 rounded-2xl bg-[var(--color-surface)] p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary)] text-sm font-extrabold text-white">
            {index + 1}
          </div>
          <div>
            <h3 className="font-extrabold text-[var(--color-primary)]">
              {passo.titulo}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
              {passo.descricao}
            </p>
          </div>
        </div>
      ))}
      <div className="mt-4 p-4 text-sm text-[var(--color-text)] bg-white border rounded-2xl">
        {campanha.descricao || "Nenhuma descrição fornecida."}
      </div>
    </div>
  );
}

function SobreMarca({ campanha }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-center shadow-sm">
      <LogoCampanha patrocinador={campanha.patrocinador} logoUrl={campanha.patrocinador_logo_url} />

      <h3 className="mt-4 font-extrabold text-[var(--color-primary)]">
        {campanha.patrocinador}
      </h3>
      <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
        Apoiadora oficial desta campanha na plataforma.
      </p>
    </div>
  );
}

function Premios({ campanha }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-[var(--color-accent)]" />
        <h3 className="font-extrabold text-[var(--color-primary)]">
          Recompensa Garantida
        </h3>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">
        Esta campanha distribui {campanha.pontos_recompensa} pontos de recompensa.
      </p>
    </div>
  );
}
