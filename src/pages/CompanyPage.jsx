import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import SectionCard from "../components/ui/SectionCard";
import { useCepAddress } from "../hooks/useCepAddress";
import {
  getCollectionPointDraft,
  saveCollectionPointDraft,
} from "../services/collectionPointRequests";

const addressFields = [
  { id: "rua", label: "Nome da rua", type: "text" },
  { id: "numero", label: "Numero", type: "text" },
  { id: "bairro", label: "Bairro", type: "text" },
  { id: "cidade", label: "Cidade", type: "text" },
  { id: "complemento", label: "Complemento", type: "text" },
];

const formatDraftValue = (value) => value || "Nao informado";

export default function Company() {
  const navigate = useNavigate();
  const draft = React.useMemo(() => getCollectionPointDraft() || {}, []);
  const { address, cepStatus, handleFieldChange, validateCep } = useCepAddress();

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateCep()) return;

    saveCollectionPointDraft({
      ...draft,
      endereco: address,
    });

    navigate("/confirmacao");
  }

  return (
    <AuthShell
      title="Endereco de Coleta"
      subtitle="Cadastre onde o ponto recebe ou organiza os residuos."
      description="O endereco correto facilita a rota dos moradores e ajuda a operacao de coleta a encontrar o ponto sem ruido."
      highlights={[
        "Revise os dados do responsavel",
        "Informe dados completos de localizacao",
        "Finalize configurando os residuos aceitos",
      ]}
      footer='"Um endereco claro reduz atrito e aumenta a adesao a coleta seletiva."'
    >
      <div className="space-y-5">
        <InlineAlert
          variant="info"
          title="Etapa 2 de 3"
          description="Revise o responsavel e informe o endereco. A operacao do ponto sera definida na proxima etapa."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Dados do responsavel"
            description="Informacoes trazidas da etapa anterior."
            className="p-4 sm:p-5"
          >
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-bold text-[var(--color-primary)]">Nome</dt>
                <dd className="mt-1 break-words text-[var(--color-text-muted)]">
                  {formatDraftValue(draft.responsavel)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[var(--color-primary)]">Contato</dt>
                <dd className="mt-1 break-words text-[var(--color-text-muted)]">
                  {formatDraftValue(draft.email || draft.telefone)}
                </dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard
            title="Dados da empresa"
            description="O documento informado identifica se o pedido e de pessoa fisica ou juridica."
            className="p-4 sm:p-5"
          >
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-bold text-[var(--color-primary)]">CPF/CNPJ</dt>
                <dd className="mt-1 break-words text-[var(--color-text-muted)]">
                  {formatDraftValue(draft.documento)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[var(--color-primary)]">Situacao</dt>
                <dd className="mt-1 text-[var(--color-text-muted)]">
                  Pedido ainda pendente de envio e aprovacao.
                </dd>
              </div>
            </dl>
          </SectionCard>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <SectionCard
            title="Endereco"
            description="Preencha onde o ponto recebera ou organizara os residuos."
            className="p-4 sm:p-5"
          >
            <div className="space-y-4">
              <FormField
                id="cep"
                name="cep"
                label="CEP"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={address.cep}
                onChange={handleFieldChange}
                error={cepStatus.error}
              />

              {cepStatus.loading ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-welcome-blue)]">
                  <Loader2 size={16} className="animate-spin" /> Buscando endereco pelo CEP...
                </p>
              ) : null}

              {cepStatus.resolved ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={16} /> Endereco preenchido automaticamente.
                </p>
              ) : null}

              {cepStatus.error ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <AlertCircle size={16} /> Voce ainda pode preencher os dados manualmente.
                </p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                {addressFields.map((field) => (
                  <FormField
                    key={field.id}
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    type={field.type}
                    placeholder={field.label}
                    value={address[field.id]}
                    onChange={handleFieldChange}
                    className={
                      field.id === "rua" || field.id === "complemento" ? "md:col-span-2" : ""
                    }
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Operacao do ponto"
            description="Na proxima tela voce escolhe os residuos aceitos, volume e horario disponivel."
            className="p-4 sm:p-5"
          >
            <InlineAlert
              variant="warning"
              title="Analise obrigatoria"
              description="Finalizar o cadastro envia uma solicitacao. O ponto nao fica ativo automaticamente."
            />
          </SectionCard>

          <Button
            type="submit"
            variant="brandPrimary"
            disabled={cepStatus.loading}
            className="h-14 w-full rounded-full text-base font-semibold sm:text-lg"
          >
            {cepStatus.loading ? "Aguarde a busca..." : "Continuar"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
