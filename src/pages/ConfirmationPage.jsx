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
    title: "Aguardando aprovação",
    description: "Seu cadastro foi enviado ao servidor e esta em análise manual pelo administrador.",
    badge: "bg-amber-100 text-amber-700",
    Icon: Clock3,
  },
  aprovado: {
    title: "Ponto aprovado",
    description: "Seu ponto foi aprovado pelo backend e pode seguir o fluxo operacional.",
    badge: "bg-emerald-100 text-emerald-700",
    Icon: CheckCircle2,
  },
  rejeitado: {
    title: "Solicitacao rejeitada",
    description: "Revise as informacoes e envie uma nova solicitacao.",
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
    diasSemana: draft.diasSemana || [],
    horaAbertura: draft.horaAbertura || "",
    horaFechamento: draft.horaFechamento || "",
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
      try {
        await registerUser({
          name: draft.responsavel || "Responsável do Ponto",
          email: draft.email,
          phone: draft.telefone || "",
          password: draft.senha,
        });
      } catch (err) {
        // Se o usuário já existir ou falhar, ignoramos para tentar apenas logar
      }
      
      await login(draft.email, draft.senha);
      
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
        title="Status da Solicitacao"
        subtitle="Acompanhe a aprovação do seu ponto de coleta."
        description="Sempre que houver atualizacao real do backend, ela aparecera aqui."
        highlights={[
          "Confira o andamento da análise",
          "Saiba quando houver aprovação do administrador",
          "Reenvie os dados se for necessario ajustar a solicitacao",
        ]}
        footer='"Solicitacoes completas facilitam a análise do administrador."'
      >
        <SectionCard className="p-5 text-center sm:p-6">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${statusConfig.badge}`}>
            <StatusIcon size={28} />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[var(--color-welcome-blue)]">{statusConfig.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{statusConfig.description}</p>

          <InlineAlert
            variant={currentStatus === "aprovado" ? "success" : currentStatus === "rejeitado" ? "error" : "warning"}
            title={currentStatus === "aprovado" ? "Aprovado pelo servidor" : "Pendente de verificacao"}
            description={
              currentStatus === "aprovado"
                ? "A aprovação exibida veio da resposta do backend."
                : "Enquanto nao houver aprovação, o ponto nao deve ser considerado ativo."
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
      title="Confirmacao do Ponto"
      subtitle="Defina os tipos de residuo, quantidade e disponibilidade."
      description="Finalize o cadastro informando quais residuos o ponto recebe e quando a coleta pode acontecer."
      highlights={[
        "Revise os dados antes do envio",
        "Selecione os materiais aceitos",
        "Aguarde a análise manual do administrador",
      ]}
      footer='"A confirmacao completa envia o pedido para análise, sem ativacao automatica."'
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
          title="Etapa 3 de 3"
          description="Revise os dados e informe como o ponto opera. A solicitacao ficara pendente ate a aprovação manual."
        />

        {fallbackStatus ? (
          <InlineAlert variant="warning" title="Solicitacao preservada neste navegador">
            {fallbackStatus.mensagem ||
              "Nao foi possivel enviar sua solicitacao ao servidor. Seus dados foram preservados para nova tentativa."}
          </InlineAlert>
        ) : null}

        <SectionCard
          title="Revisao do cadastro"
          description="Confira os dados principais antes de enviar ao servidor."
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
            title="Residuos aceitos"
            description="Selecione todos os materiais que o ponto podera receber."
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
            title="Disponibilidade"
            description="Informe volume estimado e melhor horario para a coleta."
            className="p-4 sm:p-5"
          >
            <div className="space-y-4">
              <FormField
                id="quantidade"
                name="quantidade"
                label="Quantidade"
                placeholder="Ex: 10 kg, 5 sacolas, 2 caixas"
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
