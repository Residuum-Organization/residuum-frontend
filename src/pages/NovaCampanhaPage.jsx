import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Gift, MapPin, Recycle, Users } from "lucide-react";
import CampaignLayout, {
  BotaoVoltar,
  LogoResiduum,
} from "../components/Campanhas/CampaignLayout";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingButton from "../components/ui/LoadingButton";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const estadoInicial = {
  nome: "",
  empresa: "",
  periodo: "",
  locais: "",
  residuo: "",
  premiacao: "",
};

export default function NovaCampanhaPage() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

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
      !formulario.nome ||
      !formulario.empresa ||
      !formulario.periodo ||
      !formulario.locais ||
      !formulario.residuo ||
      !formulario.premiacao
    ) {
      setErro("Preencha todos os campos antes de salvar a campanha.");
      return;
    }

    const novaCampanha = {
      id: Date.now(),
      nome: formulario.nome,
      empresa: formulario.empresa,
      status: "Planejada",
      periodo: formulario.periodo,
      locais: formulario.locais,
      residuo: formulario.residuo,
      premiacao: formulario.premiacao,
      progresso: 0,
      tipo: "personalizada",
    };

    const campanhasSalvas =
      JSON.parse(localStorage.getItem("campanhasCriadas")) || [];

    const campanhasAtualizadas = [...campanhasSalvas, novaCampanha];

    localStorage.setItem(
      "campanhasCriadas",
      JSON.stringify(campanhasAtualizadas)
    );

    setErro("");
    setSucesso(true);
    setFormulario(estadoInicial);

    setTimeout(() => {
      navigate("/campanhas");
    }, 1200);
  }

  return (
    <CampaignLayout>
      <div className="space-y-5">
        <div>
          <BotaoVoltar onClick={() => navigate("/campanhas")} />
          <PageHeader
            eyebrow="Cadastro local"
            title="Nova Campanha"
            description="Preencha os dados da empresa parceira, periodo, publico e premiacao."
            action={<LogoResiduum />}
          />
        </div>

        <InlineAlert
          variant="warning"
          title="Fluxo demonstrativo"
          description="A campanha criada sera salva no navegador via localStorage. Nenhum endpoint ou payload de API foi alterado."
        />

        {erro ? <InlineAlert variant="error" description={erro} /> : null}

        {sucesso ? (
          <InlineAlert
            variant="success"
            description="Campanha cadastrada com sucesso. Redirecionando..."
          />
        ) : null}

        <form onSubmit={salvarCampanha} className="space-y-5">
          <SectionCard
            title="Dados basicos"
            description="Identifique a campanha e a marca responsavel."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="nome"
                label="Nome da campanha"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Ex: Campanha Heineken"
              />

              <FormField
                id="empresa"
                label="Empresa parceira"
                name="empresa"
                value={formulario.empresa}
                onChange={atualizarCampo}
                placeholder="Ex: Heineken"
              />
            </div>
          </SectionCard>

          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="Periodo"
              description="Informe a janela operacional da campanha."
            >
              <CampoComIcone icon={CalendarDays}>
                <FormField
                  id="periodo"
                  label="Periodo da campanha"
                  name="periodo"
                  value={formulario.periodo}
                  onChange={atualizarCampo}
                  placeholder="Ex: 01/04/2026 - 30/04/2026"
                />
              </CampoComIcone>
            </SectionCard>

            <SectionCard
              title="Publico e condicoes"
              description="Defina regioes e material aceito."
            >
              <div className="grid gap-4">
                <CampoComIcone icon={MapPin}>
                  <FormField
                    id="locais"
                    label="Regioes participantes"
                    name="locais"
                    value={formulario.locais}
                    onChange={atualizarCampo}
                    placeholder="Ex: Norte, Sul e Leste"
                  />
                </CampoComIcone>

                <CampoComIcone icon={Recycle}>
                  <FormField
                    id="residuo"
                    label="Tipo de residuo"
                    name="residuo"
                    value={formulario.residuo}
                    onChange={atualizarCampo}
                    placeholder="Ex: Garrafas PET"
                  />
                </CampoComIcone>
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title="Recompensa e premiacao"
            description="Descreva os premios ou beneficios previstos."
          >
            <CampoComIcone icon={Gift}>
              <FormField
                id="premiacao"
                as="textarea"
                label="Premiacao"
                name="premiacao"
                value={formulario.premiacao}
                onChange={atualizarCampo}
                placeholder="Descreva os premios da campanha"
              />
            </CampoComIcone>
          </SectionCard>

          <SectionCard
            title="Pontos de coleta participantes"
            description="Esta versao ainda usa a descricao de regioes participantes informada acima."
          >
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium leading-6 text-[var(--color-text-muted)]">
                Nenhum seletor de pontos foi adicionado nesta fase para preservar
                o fluxo atual. Use o campo de regioes participantes para orientar
                a campanha.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Revisao"
            description="Confira os principais dados antes de salvar."
          >
            <ResumoFormulario formulario={formulario} />
          </SectionCard>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/campanhas")}
              disabled={sucesso}
            >
              Cancelar
            </Button>
            <LoadingButton
              type="submit"
              isLoading={sucesso}
              loadingText="Salvando..."
              disabled={sucesso}
            >
              Salvar campanha
            </LoadingButton>
          </div>
        </form>
      </div>
    </CampaignLayout>
  );
}

function CampoComIcone({ icon: Icon, children }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[44px_1fr]">
      <div className="hidden h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)] sm:grid">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function ResumoFormulario({ formulario }) {
  const itens = [
    ["Campanha", formulario.nome || "Nao informado"],
    ["Empresa", formulario.empresa || "Nao informado"],
    ["Periodo", formulario.periodo || "Nao informado"],
    ["Regioes", formulario.locais || "Nao informado"],
    ["Residuo", formulario.residuo || "Nao informado"],
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3"
        >
          <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
            {label}
          </dt>
          <dd className="mt-1 break-words text-sm font-semibold text-[var(--color-primary)]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
