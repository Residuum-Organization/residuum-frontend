import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import InlineAlert from "../components/ui/InlineAlert";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const abas = [
  { id: "funciona", label: "Como funciona" },
  { id: "sobre", label: "Sobre a marca" },
  { id: "premios", label: "Premios" },
];

export default function CampanhaDetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [abaAtual, setAbaAtual] = useState("funciona");

  const campanhasSalvas =
    JSON.parse(localStorage.getItem("campanhasCriadas")) || [];

  const campanha = campanhasSalvas.find(
    (item) => String(item.id) === String(id)
  );

  if (!campanha) {
    return (
      <AdminShell>
        <div className="space-y-5">
          <PageHeader
            eyebrow="Detalhes da campanha"
            title="Campanha não encontrada"
            action={
              <Button type="button" variant="secondary" onClick={() => navigate("/campanhas")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            }
          />
          <EmptyState
            title="Campanha nao encontrada"
            description="Essa campanha pode ter sido removida ou nao existe mais neste navegador."
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
            eyebrow="Detalhes da campanha"
            title={campanha.nome}
            description="Visão administrativa da campanha personalizada salva localmente."
            action={
              <Button type="button" variant="secondary" onClick={() => navigate("/campanhas")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            }
          />
        </div>

        <InlineAlert
          variant="info"
          title="Dados locais"
          description="Esta campanha foi carregada do localStorage. A empresa apoiadora ainda nao possui painel proprio nesta fase."
        />

        <SectionCard>
          <CabecalhoCampanha campanha={campanha} />
          <Progresso progresso={campanha.progresso} />
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-3">
          <Metrica label="Status" value={campanha.status} />
          <Metrica label="Periodo" value={campanha.periodo} />
          <Metrica label="Regioes" value={campanha.locais} />
        </div>

        <SectionCard
          title="Informacoes da campanha"
          description="Consulte orientacoes, marca e premios sem alterar regras de negocio."
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
  return (
    <div className="grid gap-4 md:grid-cols-[72px_1fr_auto] md:items-start">
      <LogoCampanha empresa={campanha.empresa} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-extrabold leading-7 text-[var(--color-primary)]">
            {campanha.nome}
          </h2>

          <StatusBadge status={campanha.status} />
          <Badge variant="primary">Local</Badge>
        </div>

        <p className="mt-1 text-sm font-bold text-[var(--color-accent)]">
          {campanha.empresa}
        </p>

        <div className="mt-4 grid gap-2 text-sm font-medium text-[var(--color-text-muted)] sm:grid-cols-3">
          <Meta icon={CalendarDays} texto={campanha.periodo} />
          <Meta icon={MapPin} texto={campanha.locais} />
          <Meta icon={Recycle} texto={campanha.residuo} />
        </div>
      </div>

      <Button type="button" variant="secondary" className="md:self-start">
        Quero participar
      </Button>
    </div>
  );
}

function LogoCampanha({ empresa }) {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-primary)] text-2xl font-extrabold text-white">
      {empresa ? empresa.charAt(0).toUpperCase() : "C"}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "Ativa") {
    return <Badge variant="success">Ativa</Badge>;
  }

  return <Badge variant="warning">{status}</Badge>;
}

function Meta({ icon: Icon, texto }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
      <span className="min-w-0 break-words">{texto}</span>
    </div>
  );
}

function Progresso({ progresso = 0 }) {
  return (
    <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--color-primary)]">
          Progresso da campanha
        </p>
        <p className="text-sm font-bold text-[var(--color-text-muted)]">
          {progresso}% do periodo concluido
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

function Metrica({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
      <strong className="mt-2 block break-words text-base font-extrabold text-[var(--color-primary)]">
        {value}
      </strong>
    </div>
  );
}

function Abas({ abaAtual, setAbaAtual }) {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-[var(--color-border)] pb-2">
      {abas.map((aba) => (
        <button
          key={aba.id}
          type="button"
          onClick={() => setAbaAtual(aba.id)}
          className={`min-h-10 shrink-0 rounded-2xl px-4 text-sm font-bold transition ${
            abaAtual === aba.id
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-blue-50"
          }`}
        >
          {aba.label}
        </button>
      ))}
    </nav>
  );
}

function ComoFunciona({ campanha }) {
  return (
    <div>
      <SectionTitle>Como funciona</SectionTitle>

      <div className="grid gap-3">
        <Linha
          icon={Recycle}
          titulo="Separe seus residuos"
          texto={`Separe corretamente o material da campanha: ${campanha.residuo}.`}
        />

        <Linha
          icon={MapPin}
          titulo="Leve ate um ponto participante"
          texto={`Entregue seus residuos nos pontos de coleta participantes da regiao: ${campanha.locais}.`}
        />

        <Linha
          icon={CheckCircle2}
          titulo="Registre sua participacao"
          texto="No ponto de coleta, seus materiais serao registrados para contabilizar sua participacao na campanha."
        />

        <Linha
          icon={Gift}
          titulo="Concorra aos premios"
          texto="Ao participar da campanha, voce aumenta suas chances de concorrer aos premios definidos pela empresa apoiadora."
        />
      </div>
    </div>
  );
}

function SobreMarca({ campanha }) {
  return (
    <div>
      <SectionTitle>Sobre a marca</SectionTitle>

      <p className="mb-4 text-sm font-medium leading-6 text-[var(--color-text-muted)]">
        A campanha <strong>{campanha.nome}</strong> foi criada em parceria com a
        empresa apoiadora <strong>{campanha.empresa}</strong>, incentivando praticas mais
        sustentaveis e o descarte correto de residuos.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <Linha
          icon={Sparkles}
          titulo="Compromisso ambiental"
          texto="A empresa apoiadora financia ou apoia ações voltadas a sustentabilidade e reducao de impactos ambientais."
        />

        <Linha
          icon={Recycle}
          titulo="Incentivo a reciclagem"
          texto={`A campanha estimula a coleta e o descarte correto de ${campanha.residuo}.`}
        />

        <Linha
          icon={Info}
          titulo="Parceria com a comunidade"
          texto="A proposta aproxima empresas, pontos de coleta e moradores por meio de ações sustentaveis."
        />
      </div>
    </div>
  );
}

function Premios({ campanha }) {
  const premios = separarPremios(campanha.premiacao);

  return (
    <div>
      <SectionTitle>Premios</SectionTitle>

      <p className="mb-4 text-sm font-medium leading-6 text-[var(--color-text-muted)]">
        Quanto mais voce participa, maiores sao suas chances de ganhar.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <CardPremio
          titulo="1o Premio"
          texto={premios[0] || "Premio principal da campanha"}
        />

        <CardPremio
          titulo="2o Premio"
          texto={premios[1] || "Segundo premio a definir"}
        />

        <CardPremio
          titulo="3o Premio"
          texto={premios[2] || "Terceiro premio a definir"}
        />
      </div>

      <InlineAlert
        variant="warning"
        className="mt-4"
        title="Importante"
        description="As regras, datas e premiacoes podem ser ajustadas pelo administrador enquanto a empresa apoiadora nao possui painel proprio."
      />
    </div>
  );
}

function separarPremios(textoPremiacao) {
  if (!textoPremiacao) {
    return [];
  }

  return textoPremiacao
    .split(/\n|;|\|/)
    .map((premio) => premio.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-lg font-extrabold text-[var(--color-primary)]">
      {children}
    </h2>
  );
}

function Linha({ icon: Icon, titulo, texto }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-extrabold text-[var(--color-primary)]">
        {titulo}
      </h3>

      <p className="mt-1 text-sm font-medium leading-6 text-[var(--color-text-muted)]">
        {texto}
      </p>
    </div>
  );
}

function CardPremio({ titulo, texto }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Award className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-extrabold text-[var(--color-primary)]">
        {titulo}
      </h3>

      <p className="mt-1 text-sm font-medium leading-6 text-[var(--color-text-muted)]">
        {texto}
      </p>
    </div>
  );
}
