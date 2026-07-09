import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Gift,
  MapPin,
  Megaphone,
  Plus,
  Recycle,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import InlineAlert from "../components/ui/InlineAlert";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const campanhasPadrao = [
  {
    id: 1,
    nome: "Campanha Heineken",
    empresa: "Heineken",
    status: "Ativa",
    periodo: "01/04/2026 - 30/04/2026",
    locais: "Norte, Sul e Leste",
    progresso: 67,
    tipo: "heineken",
  },
  {
    id: 2,
    nome: "Campanha Coca-Cola",
    empresa: "Coca-Cola",
    status: "Planejada",
    periodo: "01/05/2026 - 30/05/2026",
    locais: "Todos os pontos",
    progresso: 0,
    tipo: "coca",
  },
];

export default function CampanhasPage() {
  const navigate = useNavigate();
  const [campanhasCriadas, setCampanhasCriadas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const campanhasSalvas =
      JSON.parse(localStorage.getItem("campanhasCriadas")) || [];

    setCampanhasCriadas(campanhasSalvas);
  }, []);

  const todasCampanhas = useMemo(
    () => [...campanhasPadrao, ...campanhasCriadas],
    [campanhasCriadas]
  );

  const campanhasAtivas = todasCampanhas.filter(
    (campanha) => campanha.status === "Ativa"
  ).length;

  function abrirCampanha(campanha) {
    if (campanha.tipo === "heineken") {
      navigate("/campanha-heineken");
      return;
    }

    if (campanha.tipo === "personalizada") {
      navigate(`/campanhas/${campanha.id}`);
      return;
    }

    setMensagem("A tela de detalhes dessa campanha ainda nao foi criada.");

    setTimeout(() => {
      setMensagem("");
    }, 2500);
  }

  function excluirCampanha(id) {
    const campanhasAtualizadas = campanhasCriadas.filter(
      (campanha) => campanha.id !== id
    );

    setCampanhasCriadas(campanhasAtualizadas);

    localStorage.setItem(
      "campanhasCriadas",
      JSON.stringify(campanhasAtualizadas)
    );

    setMensagem("Campanha removida com sucesso.");

    setTimeout(() => {
      setMensagem("");
    }, 2500);
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Modulo administrativo demonstrativo"
          title="Campanhas"
          description="Gestao administrativa de campanhas e empresas apoiadoras. A area propria da empresa apoiadora ainda nao esta implementada."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
          }
        />

        <InlineAlert
          variant="info"
          title="Campanhas e empresas apoiadoras"
          description="Este modulo representa a gestao administrativa de campanhas e empresas apoiadoras. A area propria da empresa apoiadora ainda nao esta implementada; os dados seguem demonstrativos ou locais."
        />

        {mensagem ? (
          <InlineAlert variant="success" description={mensagem} />
        ) : null}

        <ResumoCampanhas
          total={todasCampanhas.length}
          ativas={campanhasAtivas}
          locais={campanhasCriadas.length}
        />

        <SectionCard
          title="Campanhas cadastradas"
          description="Acompanhe status, periodo, abrangencia e progresso administrativo das campanhas."
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
          {todasCampanhas.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {todasCampanhas.map((campanha) => (
                <CardCampanha
                  key={campanha.id}
                  campanha={campanha}
                  onClick={() => abrirCampanha(campanha)}
                  onDelete={
                    campanha.tipo === "personalizada"
                      ? () => excluirCampanha(campanha.id)
                      : null
                  }
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

        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <CampanhasEncerradas />
          <NovaCampanhaSugerida onClick={() => navigate("/nova-campanha")} />
        </div>
      </div>
    </AdminShell>
  );
}

function ResumoCampanhas({ total, ativas, locais }) {
  const cards = [
    { label: "Total", value: total },
    { label: "Ativas", value: ativas },
    { label: "Criadas neste navegador", value: locais },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
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

function CardCampanha({ campanha, onClick, onDelete }) {
  const temProgresso = campanha.progresso > 0;
  const isLocal = campanha.tipo === "personalizada";

  return (
    <article className="relative rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm transition hover:border-[var(--color-primary)]/40">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-2"
      >
        <div className="grid grid-cols-[52px_1fr] gap-3 sm:grid-cols-[60px_1fr]">
          <LogoCampanha tipo={campanha.tipo} empresa={campanha.empresa} />

          <div className="min-w-0 pr-9">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold leading-6 text-[var(--color-primary)]">
                {campanha.nome}
              </h2>

              <StatusBadge status={campanha.status} />
              {isLocal ? <Badge variant="primary">Local</Badge> : null}
            </div>

            <p className="mt-1 text-sm font-bold text-[var(--color-accent)]">
              {campanha.empresa}
            </p>

            <div className="mt-3 grid gap-2 text-sm font-medium text-[var(--color-text-muted)]">
              <InfoLinha icon={CalendarDays} texto={campanha.periodo} />
              <InfoLinha icon={MapPin} texto={campanha.locais} />

              {campanha.residuo ? (
                <InfoLinha icon={Recycle} texto={campanha.residuo} />
              ) : null}
            </div>
          </div>
        </div>

        {temProgresso ? <BarraProgresso progresso={campanha.progresso} /> : null}

        <span className="mt-4 inline-flex items-center text-sm font-bold text-[var(--color-primary)]">
          Ver detalhes
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </span>
      </button>

      {onDelete ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2"
          title="Excluir campanha"
          aria-label="Excluir campanha"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </article>
  );
}

function LogoCampanha({ tipo, empresa }) {
  const label = empresa ? empresa.charAt(0).toUpperCase() : "N";

  if (tipo === "heineken") {
    return (
      <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[#00843d] text-xs font-extrabold text-white sm:h-[60px] sm:w-[60px]">
        H
      </div>
    );
  }

  if (tipo === "coca") {
    return (
      <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-red-600 text-xl font-extrabold text-white sm:h-[60px] sm:w-[60px]">
        C
      </div>
    );
  }

  return (
    <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[var(--color-primary)] text-xl font-extrabold text-white sm:h-[60px] sm:w-[60px]">
      {label}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "Ativa") {
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

function BarraProgresso({ progresso }) {
  return (
    <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-[var(--color-primary)]">
          Progresso da campanha
        </p>
        <p className="text-xs font-bold text-[var(--color-text-muted)]">
          {progresso}%
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${progresso}%` }}
        />
      </div>
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
        description="Campanhas finalizadas aparecerao aqui quando existirem dados no fluxo."
        className="py-6"
      />
    </SectionCard>
  );
}

function NovaCampanhaSugerida({ onClick }) {
  return (
    <SectionCard
      title="Nova campanha"
      description="Cadastre uma acao de empresa apoiadora sem alterar integracoes ou endpoints."
      className="h-full"
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-left transition hover:border-[var(--color-primary)]/40 sm:flex-row sm:items-center"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary)] text-white">
          <Megaphone className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-[var(--color-primary)]">
            Criar campanha personalizada
          </h3>

          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            Organize empresa apoiadora, periodo, residuos e premiacao.
          </p>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
      </button>
    </SectionCard>
  );
}
