import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
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

  const [isGeocoding, setIsGeocoding] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateCep()) return;

    setIsGeocoding(true);
    let lat = 0.0;
    let lon = 0.0;

    try {
      const enderecoBusca = `${address.rua || ""}, ${address.numero || ""}, ${address.cidade || ""}, Brasil`.replace(/,\s*,/g, ",");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(enderecoBusca)}`, {
        headers: { "User-Agent": "Residuum-App/1.0" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      }
    } catch (err) {
      console.warn("Geocoding failed:", err);
    } finally {
      setIsGeocoding(false);
    }

    saveCollectionPointDraft({
      ...draft,
      endereco: address,
      latitude: lat,
      longitude: lon,
    });

    navigate("/confirmacao");
  }

  return (
    <AuthShell
      title="Onde você fica?"
      subtitle="Conte para nós onde os moradores podem te encontrar."
      description="Um endereço certinho ajuda muito as pessoas da sua região a levarem os recicláveis até você sem se perderem no caminho."
      highlights={[
        "Fácil de ser encontrado no mapa",
        "Atraia moradores da sua vizinhança",
        "Só falta mais um passo depois deste!",
      ]}
      footer='"Estar acessível é o primeiro passo para criar um grande impacto local."'
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
          title="Quase lá! (Etapa 2 de 3)"
          description="Dê uma conferida rápida nos seus dados de contato e nos diga o endereço exato onde você vai receber os materiais."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Seus dados (Resumo)"
            description="Informações que você preencheu na etapa anterior."
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
            title="Documento cadastrado"
            description="Isso nos ajuda a saber se você é uma pessoa física ou uma empresa."
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
                  Pedido ainda pendente de envio e aprovação.
                </dd>
              </div>
            </dl>
          </SectionCard>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <SectionCard
            title="Endereco"
            description="Preencha onde o ponto receberá ou organizará os resíduos."
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
            title="Operação do ponto"
            description="Na próxima tela você escolhe os resíduos aceitos, o volume e o horário disponível."
            className="p-4 sm:p-5"
          >
            <InlineAlert
              variant="warning"
              title="Análise obrigatoria"
              description="Finalizar o cadastro envia uma solicitacao. O ponto nao fica ativo automaticamente."
            />
          </SectionCard>

          <Button
            type="submit"
            variant="brandPrimary"
            disabled={cepStatus.loading || isGeocoding}
            className="h-14 w-full rounded-full text-base font-semibold sm:text-lg"
          >
            {cepStatus.loading ? "Aguarde a busca do CEP..." : isGeocoding ? "Calculando localização..." : "Continuar"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
