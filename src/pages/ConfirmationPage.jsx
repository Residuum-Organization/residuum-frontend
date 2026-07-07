import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock3, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import {
  buildCollectionPointPayload,
  clearCollectionPointDraft,
  getCollectionPointDraft,
  getCollectionPointRequestErrorMessage,
  getCollectionPointRequestStatus,
  saveLocalCollectionPointRequestFallback,
  submitCollectionPointRequest,
} from "../services/collectionPointRequests";
import { queryKeys } from "../services/queryKeys";

const residuos = ["Plastico", "Metal", "Vidro", "Papelao"];

const statusMap = {
  pendente: {
    title: "Aguardando aprovacao",
    description: "Seu cadastro foi enviado ao servidor e esta em analise.",
    badge: "bg-amber-100 text-amber-700",
    Icon: Clock3,
  },
  aprovado: {
    title: "Ponto aprovado",
    description: "Seu ponto ja pode comecar a operar na plataforma.",
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

export default function Confirmation() {
  const navigate = useNavigate();
  const draft = useMemo(() => getCollectionPointDraft() || {}, []);
  const [residuosSelecionados, setResiduosSelecionados] = useState([]);
  const [details, setDetails] = useState({ quantidade: "", data: "", horario: "", observacoes: "" });
  const [feedback, setFeedback] = useState("");
  const [localFallback, setLocalFallback] = useState(null);

  const statusQuery = useQuery({
    queryKey: queryKeys.collectionPointRequestStatus,
    queryFn: getCollectionPointRequestStatus,
  });

  const requestMutation = useMutation({
    mutationFn: submitCollectionPointRequest,
    onSuccess: () => {
      clearCollectionPointDraft();
      setLocalFallback(null);
      statusQuery.refetch();
      setFeedback("Solicitacao enviada com sucesso.");
    },
    onError: (error, payload) => {
      const message = getCollectionPointRequestErrorMessage(error);
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

    const payload = buildCollectionPointPayload(draft, residuosSelecionados, details);
    const validationMessage = validatePayload(payload);

    if (validationMessage) {
      setFeedback(validationMessage);
      return;
    }

    setFeedback("");
    requestMutation.mutate(payload);
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
        subtitle="Acompanhe a aprovacao do seu ponto de coleta."
        description="Sempre que houver atualizacao, ela aparecera aqui."
        highlights={[
          "Confira o andamento da analise",
          "Saiba quando o ponto estiver apto a operar",
          "Reenvie os dados se for necessario ajustar a solicitacao",
        ]}
        footer='"Solicitacoes completas aceleram a entrada do ponto na operacao."'
      >
        <div className="rounded-3xl bg-white p-6 shadow-sm text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${statusConfig.badge}`}>
            <StatusIcon size={28} />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[var(--color-welcome-blue)]">{statusConfig.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{statusConfig.description}</p>
          {feedback ? <p className="mt-4 text-sm font-semibold text-[var(--color-welcome-blue)]">{feedback}</p> : null}

          <Button
            type="button"
            variant="brandPrimary"
            className="mt-6 h-14 w-full rounded-full text-lg font-semibold"
            onClick={() => navigate("/welcome")}
          >
            Voltar ao inicio
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Confirmacao do Ponto"
      subtitle="Defina os tipos de residuo, quantidade e disponibilidade."
      description="Finalize o cadastro informando quais residuos o ponto recebe e quando a coleta pode acontecer."
      highlights={[
        "Selecione os materiais aceitos",
        "Informe volume e janela de coleta",
        "Deixe observacoes uteis para a operacao",
      ]}
      footer='"A confirmacao completa transforma o cadastro em um ponto pronto para operar."'
    >
      <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-[var(--color-welcome-blue)]">
        Etapa 3 de 3 - Residuos e disponibilidade
      </div>

      {fallbackStatus ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          <span className="mb-2 inline-flex items-center gap-2">
            <AlertCircle size={18} /> Solicitacao salva localmente
          </span>
          <p className="font-medium">
            {fallbackStatus.mensagem ||
              "Nao foi possivel enviar sua solicitacao ao servidor. Seus dados foram preservados localmente para nova tentativa."}
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[var(--color-welcome-blue)]">
              Tipo de Residuo
            </h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {residuosSelecionados.length} selecionado(s)
            </span>
          </div>

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
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-welcome-blue)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    {residuo}
                    <X size={14} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {residuos.map((residuo) => (
              <button
                key={residuo}
                type="button"
                onClick={() => adicionarResiduo(residuo)}
                className="rounded-full border border-[var(--color-welcome-blue)] px-4 py-3 text-sm font-bold text-[var(--color-welcome-blue)] transition hover:bg-[var(--color-welcome-blue)] hover:text-white"
              >
                {residuo}
              </button>
            ))}
          </div>
        </section>

        <FormField
          id="quantidade"
          name="quantidade"
          label="Quantidade"
          placeholder="Ex: 10 kg, 5 sacolas, 2 caixas"
          value={details.quantidade}
          onChange={handleDetailChange}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="data" name="data" label="Data" type="date" value={details.data} onChange={handleDetailChange} />
          <FormField id="horario" name="horario" label="Horario" type="time" value={details.horario} onChange={handleDetailChange} />
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

        {feedback ? <p className="text-sm font-medium text-amber-700">{feedback}</p> : null}

        <Button
          type="submit"
          variant="brandPrimary"
          disabled={requestMutation.isPending}
          className="h-14 w-full rounded-full text-lg font-semibold"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {requestMutation.isPending
              ? "Enviando..."
              : fallbackStatus
                ? "Tentar enviar novamente"
                : "Finalizar Cadastro"}
            <CheckCircle2 size={20} />
          </span>
        </Button>
      </form>
    </AuthShell>
  );
}
