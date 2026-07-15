import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  CalendarDays,
  Info,
  Sparkles,
  ArrowLeft,
  Edit2,
  Gift,
  X
} from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import FormField from "../components/forms/FormField";
import LoadingButton from "../components/ui/LoadingButton";
import InlineAlert from "../components/ui/InlineAlert";
import { listCampanhas, updateCampanha } from "../services/admin";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

export default function CampanhaDetalhesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formulario, setFormulario] = useState({
    titulo: "",
    descricao: "",
    patrocinador: "",
    pontos_recompensa: "",
    data_inicio: "",
    data_fim: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const { data: campanhas = [], isLoading, isError, error } = useQuery({
    queryKey: ["campanhas"],
    queryFn: listCampanhas,
  });

  const campanha = campanhas.find((item) => String(item.id) === String(id));

  useEffect(() => {
    if (campanha && !isEditing) {
      setFormulario({
        titulo: campanha.titulo || "",
        descricao: campanha.descricao || "",
        patrocinador: campanha.patrocinador || "",
        pontos_recompensa: campanha.pontos_recompensa || "",
        data_inicio: campanha.data_inicio ? campanha.data_inicio.split("T")[0] : "",
        data_fim: campanha.data_fim ? campanha.data_fim.split("T")[0] : "",
      });
    }
  }, [campanha, isEditing]);

  const mutation = useMutation({
    mutationFn: (payload) => updateCampanha(id, payload),
    onSuccess: () => {
      setErro("");
      setSucesso(true);
      queryClient.invalidateQueries(["campanhas"]);
      setTimeout(() => {
        setSucesso(false);
        setIsEditing(false);
      }, 1500);
    },
    onError: (err) => {
      setErro(getApiErrorMessage(err, "Erro ao atualizar a campanha"));
    },
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

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function salvarCampanha(event) {
    event.preventDefault();
    if (
      !formulario.titulo ||
      !formulario.patrocinador ||
      !formulario.pontos_recompensa
    ) {
      setErro("Preencha título, patrocinador e pontos de recompensa antes de salvar.");
      return;
    }

    const payload = {
      titulo: formulario.titulo,
      descricao: formulario.descricao || null,
      patrocinador: formulario.patrocinador,
      pontos_recompensa: Number(formulario.pontos_recompensa) || 0,
      data_inicio: formulario.data_inicio ? new Date(formulario.data_inicio).toISOString() : null,
      data_fim: formulario.data_fim ? new Date(formulario.data_fim).toISOString() : null,
    };

    mutation.mutate(payload);
  }

  if (isEditing) {
    return (
      <AdminShell>
        <div className="space-y-5">
          <PageHeader
            title={`Editando: ${campanha.titulo}`}
            description="Modifique as informações da campanha."
            action={
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            }
          />

          {erro && <InlineAlert variant="error" description={erro} />}
          {sucesso && <InlineAlert variant="success" description="Campanha atualizada com sucesso!" />}

          <form onSubmit={salvarCampanha} className="space-y-5">
            <SectionCard title="Dados básicos" description="Identifique a campanha e a marca responsável.">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  id="titulo"
                  label="Título da campanha"
                  name="titulo"
                  value={formulario.titulo}
                  onChange={atualizarCampo}
                  placeholder="Ex: Campanha Heineken"
                />
                <FormField
                  id="patrocinador"
                  label="Patrocinador"
                  name="patrocinador"
                  value={formulario.patrocinador}
                  onChange={atualizarCampo}
                  placeholder="Ex: Heineken"
                />
              </div>
              <div className="mt-4">
                <FormField
                  id="descricao"
                  label="Descrição"
                  as="textarea"
                  name="descricao"
                  value={formulario.descricao}
                  onChange={atualizarCampo}
                  placeholder="Detalhes sobre a campanha"
                />
              </div>
            </SectionCard>

            <div className="grid gap-5 lg:grid-cols-2">
              <SectionCard title="Período" description="Informe a janela operacional da campanha.">
                <div className="grid gap-4">
                  <CampoComIcone icon={CalendarDays}>
                    <FormField
                      id="data_inicio"
                      type="date"
                      label="Data de Início"
                      name="data_inicio"
                      value={formulario.data_inicio}
                      onChange={atualizarCampo}
                    />
                  </CampoComIcone>

                  <CampoComIcone icon={CalendarDays}>
                    <FormField
                      id="data_fim"
                      type="date"
                      label="Data de Fim"
                      name="data_fim"
                      value={formulario.data_fim}
                      onChange={atualizarCampo}
                    />
                  </CampoComIcone>
                </div>
              </SectionCard>

              <SectionCard title="Recompensa" description="Defina a pontuação.">
                <div className="grid gap-4">
                  <CampoComIcone icon={Gift}>
                    <FormField
                      id="pontos_recompensa"
                      type="number"
                      label="Pontos de Recompensa"
                      name="pontos_recompensa"
                      value={formulario.pontos_recompensa}
                      onChange={atualizarCampo}
                      placeholder="Ex: 30"
                    />
                  </CampoComIcone>
                </div>
              </SectionCard>
            </div>

            <div className="flex justify-end pt-5">
              <LoadingButton
                isLoading={mutation.isPending}
                loadingText="Salvando..."
                type="submit"
                variant="brandPrimary"
                className="w-full rounded-full text-base sm:w-auto sm:px-10"
              >
                Salvar Alterações
              </LoadingButton>
            </div>
          </form>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <PageHeader
          title={campanha.titulo}
          description="Detalhes e regras."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate("/campanhas")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button type="button" variant="brandPrimary" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Editar
              </Button>
            </div>
          }
        />

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

function CampoComIcone({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-7 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 grow">{children}</div>
    </div>
  );
}
