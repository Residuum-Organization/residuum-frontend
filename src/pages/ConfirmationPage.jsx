import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingButton from "../components/ui/LoadingButton";
import SectionCard from "../components/ui/SectionCard";
import {
  buildCollectionPointPayload,
  clearCollectionPointDraft,
  getCollectionPointDraft,
  getCollectionPointRequestStatus,
  saveLocalCollectionPointRequestFallback,
  submitCollectionPointRequest,
} from "../services/collectionPointRequests";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { queryKeys } from "../services/queryKeys";
import { registerUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const residuos = ["Plastico", "Metal", "Vidro", "Papelao"];

const statusMap = {
  pendente: {
    title: "Em análise",
    description: "Sua solicitação está com a nossa equipe. Em breve daremos um retorno!",
    badge: "bg-amber-100 text-amber-700",
    Icon: Clock3,
  },
  aprovado: {
    title: "Ponto Aprovado!",
    description: "Parabéns! Seu ponto de coleta já faz parte da rede oficial e está pronto.",
    badge: "bg-emerald-100 text-emerald-700",
    Icon: CheckCircle2,
  },
  rejeitado: {
    title: "Ops! Precisamos de ajustes",
    description: "Algo não deu certo. Revise suas informações e envie uma nova solicitação.",
    badge: "bg-rose-100 text-rose-700",
    Icon: X,
  },
};

const requiredPayloadFields = [
  ["responsavel_nome", "Informe o nome do responsavel antes de finalizar."],
  ["documento", "Informe CPF ou CNPJ antes de finalizar."],
  ["responsavel_telefone", "Informe o telefone do responsavel antes de finalizar."],
  ["email", "Informe o e-mail do responsavel antes de finalizar."],
  ["endereco", "Informe o endereco do ponto antes de finalizar."],
  ["capacidade_maxima", "Informe a quantidade/capacidade antes de finalizar."],
  ["horario_funcionamento", "Informe o horario disponivel antes de finalizar."],
];

const validatePayload = (payload) => {
  const missingField = requiredPayloadFields.find(([field]) => {
    const value = payload[field];
    return value == null || String(value).trim() === "";
  });

  return missingField?.[1] || "";
};

const getDraftAddressPreview = (address) => {
  if (!address || typeof address !== "object") return "Nao informado";

  return [address.rua, address.numero, address.bairro, address.cidade, address.cep]
    .filter(Boolean)
    .join(", ") || "Nao informado";
};

export default function Confirmation() {
  const navigate = useNavigate();
  const draft = useMemo(() => getCollectionPointDraft() || {}, []);
  const [residuosSelecionados, setResiduosSelecionados] = useState([]);
  const [details, setDetails] = useState({
    quantidade: draft.quantidade || "",
    diasSemana: draft.diasSemana || ["Seg", "Ter", "Qua", "Qui", "Sex"],
    horaAbertura: draft.horaAbertura || "08:00",
    horaFechamento: draft.horaFechamento || "17:00",
    observacoes: draft.observacoes || "",
  });
  const [feedback, setFeedback] = useState("");
  const [localFallback, setLocalFallback] = useState(null);
  const { login, isAuthenticated } = useAuth();

  const statusQuery = useQuery({
    queryKey: queryKeys.collectionPointRequestStatus,
    queryFn: getCollectionPointRequestStatus,
    enabled: isAuthenticated,
  });

  const requestMutation = useMutation({
    mutationFn: async (payload) => {
      return submitCollectionPointRequest(payload);
    },
    onSuccess: () => {
      clearCollectionPointDraft();
      setLocalFallback(null);
      statusQuery.refetch();
      setFeedback("Solicitacao enviada com sucesso.");
    },
    onError: (error, payload) => {
      const message = getApiErrorMessage(error, "Não foi possível enviar sua solicitação. Seus dados foram preservados localmente.");
      setLocalFallback(saveLocalCollectionPointRequestFallback(payload, message));
      setFeedback(message);
    },
  });

  function adicionarResiduo(residuo) {
    if (!residuosSelecionados.includes(residuo)) {
      setResiduosSelecionados([...residuosSelecionados, residuo]);
    }
  }

  function removerResiduo(residuo) {
    setResiduosSelecionados(
      residuosSelecionados.filter((item) => item !== residuo)
    );
  }

  function handleDetailChange(event) {
    const { name, value } = event.target;
    setDetails((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (requestMutation.isPending) return;

    if (residuosSelecionados.length === 0) {
      setFeedback("Selecione pelo menos um tipo de residuo aceito pelo ponto.");
      return;
    }

    try {
      let horarioFuncionamento = "";
      if (details.diasSemana.length > 0 && details.horaAbertura && details.horaFechamento) {
        horarioFuncionamento = `Dias: ${details.diasSemana.join(", ")}, Horário: ${details.horaAbertura} às ${details.horaFechamento}`;
      }

      const payload = buildCollectionPointPayload(draft, residuosSelecionados, {
        ...details,
        horario_funcionamento: horarioFuncionamento
      });
      const validationMessage = validatePayload(payload);

      if (validationMessage) {
        setFeedback(validationMessage);
        return;
      }

      setFeedback("");
      requestMutation.mutate(payload);
    } catch (error) {
      if (error.issues && error.issues.length > 0) {
        setFeedback(error.issues[0].message);
      } else {
        setFeedback(error.message || "Verifique os dados informados (CPF/CNPJ inválido).");
      }
    }
  }

  const visibleStatus = requestMutation.data || statusQuery.data;
  const fallbackStatus = localFallback || (visibleStatus?.isLocalFallback ? visibleStatus : null);
  const realStatus = visibleStatus && !visibleStatus.isLocalFallback ? visibleStatus : null;
  const currentStatus = realStatus?.status;
  const statusConfig = currentStatus ? statusMap[currentStatus] || statusMap.pendente : null;

  if (statusConfig) {
    const StatusIcon = statusConfig.Icon;

    return (
      <AuthShell
        title="Status do seu Cadastro"
        subtitle="Acompanhe a aprovação do seu ponto."
        description="Esta tela mostra em tempo real o andamento da sua parceria com a nossa rede."
        highlights={[
          "Fique de olho no andamento da sua análise",
          "Avisaremos assim que você for aprovado",
          "Ajuste os dados e envie novamente, se precisar",
        ]}
        footer='"Estamos super ansiosos para ter você no nosso time de parceiros!"'
      >
        <SectionCard className="p-5 text-center sm:p-6">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${statusConfig.badge}`}>
            <StatusIcon size={28} />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[var(--color-welcome-blue)]">{statusConfig.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{statusConfig.description}</p>

          <InlineAlert
            variant={currentStatus === "aprovado" ? "success" : currentStatus === "rejeitado" ? "error" : "warning"}
            title={currentStatus === "aprovado" ? "Tudo certo para começar!" : "Aguardando verificação"}
            description={
              currentStatus === "aprovado"
                ? "Agora você pode acessar a plataforma e organizar sua rotina de recebimentos."
                : "A sua solicitação chegou até nós e a nossa equipe já vai analisar seu perfil com muito carinho."
            }
            className="mt-5 text-left"
          />

          {feedback ? (
            <p className="mt-4 text-sm font-semibold text-[var(--color-welcome-blue)]">{feedback}</p>
          ) : null}

          <Button
            type="button"
            variant="brandPrimary"
            className="mt-6 h-14 w-full rounded-full text-lg font-semibold"
            onClick={() => navigate("/welcome")}
          >
            Voltar ao inicio
          </Button>
        </SectionCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Sua Operação (Último passo!)"
      subtitle="Quais materiais você vai receber e quando?"
      description="Para fecharmos com chave de ouro, nos conte o que o seu ponto recebe e quais os horários de funcionamento. Os moradores vão usar essas informações para te encontrar."
      highlights={[
        "Fica mais fácil para a vizinhança reciclar",
        "Você escolhe o que pode receber",
        "Sua aprovação será mais rápida",
      ]}
      footer='"Informação clara ajuda o morador e fortalece a rede sustentável."'
    >
      <div className="mb-6">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-sm font-semibold text-[var(--color-welcome-blue)] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </button>
      </div>
      <div className="space-y-5">
        <InlineAlert
          variant="info"
          title="Tudo pronto? (Etapa 3 de 3)"
          description="Confira seus dados pela última vez e nos diga quais materiais a sua estrutura consegue receber. Em seguida, é só enviar e aguardar nossa confirmação super rápida."
        />

        {fallbackStatus ? (
          <InlineAlert variant="warning" title="Solicitacao preservada neste navegador">
            {fallbackStatus.mensagem ||
              "Nao foi possivel enviar sua solicitacao ao servidor. Seus dados foram preservados para nova tentativa."}
          </InlineAlert>
        ) : null}

        <SectionCard
          title="Seu Resumo"
          description="Veja se essas informações de contato e endereço estão corretinhas."
          className="p-4 sm:p-5"
        >
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-[var(--color-primary)]">Responsavel</dt>
              <dd className="mt-1 break-words text-[var(--color-text-muted)]">
                {draft.responsavel || "Nao informado"}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-[var(--color-primary)]">Contato</dt>
              <dd className="mt-1 break-words text-[var(--color-text-muted)]">
                {draft.email || draft.telefone || "Nao informado"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-bold text-[var(--color-primary)]">Endereco</dt>
              <dd className="mt-1 break-words text-[var(--color-text-muted)]">
                {getDraftAddressPreview(draft.endereco)}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <SectionCard
            title="O que você aceita receber?"
            description="Marque todas as opções de materiais que você tem capacidade para organizar."
            action={
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {residuosSelecionados.length} selecionado(s)
              </span>
            }
            className="p-4 sm:p-5"
          >
            <div className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {residuosSelecionados.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">
                  Clique nos residuos abaixo para adicionar.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {residuosSelecionados.map((residuo) => (
                    <button
                      key={residuo}
                      type="button"
                      onClick={() => removerResiduo(residuo)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--color-welcome-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                    >
                      {residuo}
                      <X size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {residuos.map((residuo) => (
                <button
                  key={residuo}
                  type="button"
                  onClick={() => adicionarResiduo(residuo)}
                  className="min-h-12 rounded-full border border-[var(--color-welcome-blue)] px-4 py-3 text-sm font-bold text-[var(--color-welcome-blue)] transition hover:bg-[var(--color-welcome-blue)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                >
                  {residuo}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Horários e Limites"
            description="Nos diga qual o volume máximo que consegue armazenar e qual o horário as pessoas podem levar até você."
            className="p-4 sm:p-5"
          >
            <div className="space-y-4">
              <FormField
                id="quantidade"
                name="quantidade"
                label="Quantidade (kg)"
                type="number"
                min="0"
                step="0.1"
                placeholder="Ex: 10"
                value={details.quantidade}
                onChange={handleDetailChange}
              />

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#1F4E79]">Dias de Funcionamento</label>
                <div className="flex flex-wrap gap-2">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(dia => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => {
                        const newDias = details.diasSemana.includes(dia) 
                          ? details.diasSemana.filter(d => d !== dia)
                          : [...details.diasSemana, dia];
                        setDetails({ ...details, diasSemana: newDias });
                      }}
                      className={`min-h-10 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
                        details.diasSemana.includes(dia)
                          ? "border-[var(--color-welcome-blue)] bg-[var(--color-welcome-blue)] text-white"
                          : "border-slate-300 bg-white text-slate-600 hover:border-[var(--color-welcome-blue)]"
                      }`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="horaAbertura" name="horaAbertura" label="Horário de Abertura" type="time" value={details.horaAbertura} onChange={handleDetailChange} />
                <FormField id="horaFechamento" name="horaFechamento" label="Horário de Fechamento" type="time" value={details.horaFechamento} onChange={handleDetailChange} />
              </div>

              <FormField
                id="observacoes"
                name="observacoes"
                label="Observacoes"
                as="textarea"
                placeholder="Digite alguma observacao"
                value={details.observacoes}
                onChange={handleDetailChange}
              />
            </div>
          </SectionCard>

          {feedback ? (
            <InlineAlert
              variant={requestMutation.isError || fallbackStatus ? "warning" : "info"}
              title="Atencao"
              description={feedback}
            />
          ) : null}

          <LoadingButton
            type="submit"
            variant="brandPrimary"
            isLoading={requestMutation.isPending}
            loadingText="Enviando solicitacao..."
            className="h-14 w-full rounded-full text-base font-semibold sm:text-lg"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {fallbackStatus ? "Tentar enviar novamente" : "Enviar para análise"}
              <CheckCircle2 size={20} />
            </span>
          </LoadingButton>
        </form>
      </div>
    </AuthShell>
  );
}
