import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Gift, MapPin, Recycle, Users, ArrowLeft } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingButton from "../components/ui/LoadingButton";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import { createCampanha } from "../services/admin";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

const today = new Date().toISOString().split("T")[0];

const estadoInicial = {
  titulo: "",
  descricao: "",
  patrocinador: "",
  pontos_recompensa: "",
  produto_elegivel: "",
  meta_quantidade: "",
  condicoes: "",
  data_inicio: today,
  data_fim: "",
};

export default function NovaCampanhaPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formulario, setFormulario] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => createCampanha(payload),
    onSuccess: () => {
      setErro("");
      setSucesso(true);
      setFormulario(estadoInicial);
      queryClient.invalidateQueries(["campanhas"]);
      setTimeout(() => {
        navigate("/campanhas");
      }, 1200);
    },
    onError: (error) => {
      setErro(getApiErrorMessage(error, "Erro ao salvar a campanha"));
    },
  });

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
      produto_elegivel: formulario.produto_elegivel.trim() || null,
      meta_quantidade: Number(formulario.meta_quantidade) > 0 ? Number(formulario.meta_quantidade) : null,
      condicoes: formulario.condicoes.trim() || null,
      status: "ativa",
      data_inicio: formulario.data_inicio ? new Date(formulario.data_inicio).toISOString() : null,
      data_fim: formulario.data_fim ? new Date(formulario.data_fim).toISOString() : null,
    };

    mutation.mutate(payload);
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <PageHeader
            title="Nova Campanha"
            description="Cadastre uma nova campanha na plataforma."
            action={
              <Button type="button" variant="secondary" onClick={() => navigate("/campanhas")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            }
          />
        </div>

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

          <SectionCard
            title="Condições para o morador"
            description="Informativo: aparece na página da campanha antes da adesão. Não altera a regra de pontos."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="produto_elegivel"
                label="Produto ou material (opcional)"
                name="produto_elegivel"
                value={formulario.produto_elegivel}
                onChange={atualizarCampo}
                placeholder="Ex: Lata de alumínio"
              />
              <FormField
                id="meta_quantidade"
                type="number"
                min="1"
                label="Meta em unidades (opcional)"
                name="meta_quantidade"
                value={formulario.meta_quantidade}
                onChange={atualizarCampo}
                placeholder="Ex: 20"
              />
            </div>
            <div className="mt-4">
              <FormField
                id="condicoes"
                label="Condições de participação (opcional)"
                as="textarea"
                name="condicoes"
                value={formulario.condicoes}
                onChange={atualizarCampo}
                placeholder="O que o morador precisa fazer para participar"
              />
            </div>
          </SectionCard>

          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="Período"
              description="Informe a janela operacional da campanha."
            >
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

            <SectionCard
              title="Recompensa"
              description="Defina a pontuação."
            >
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
              Salvar Campanha
            </LoadingButton>
          </div>
        </form>
      </div>
    </AdminShell>
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
