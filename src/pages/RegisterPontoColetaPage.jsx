import React from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import SectionCard from "../components/ui/SectionCard";
import { saveCollectionPointDraft } from "../services/collectionPointRequests";

const responsibleFields = [
  { id: "responsavel", label: "Nome do responsavel", type: "text" },
  { id: "documento", label: "CPF/CNPJ", type: "text" },
  { id: "telefone", label: "Telefone", type: "tel" },
  { id: "email", label: "E-mail", type: "email" },
  { id: "senha", label: "Senha", type: "password" },
  { id: "confirmarSenha", label: "Confirmar senha", type: "password" },
];

export default function RegisterPontoColetaPage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    responsavel: "",
    documento: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveCollectionPointDraft({
      responsavel: form.responsavel,
      documento: form.documento,
      telefone: form.telefone,
      email: form.email,
      senha: form.senha,
    });
    navigate("/empresa");
  }

  return (
    <AuthShell
      title="Cadastro do Ponto"
      subtitle="Informe os dados do responsavel pelo ponto de coleta."
      description="Cadastre seu ponto de coleta para receber moradores, organizar descartes e acompanhar solicitacoes na plataforma Residuum."
      highlights={[
        "Identifique o responsavel pelo cadastro",
        "Mantenha contato e acesso protegidos",
        "Avance para cadastrar o endereco de coleta",
      ]}
      footer='"Pontos bem cadastrados ajudam a cidade a reciclar com mais confianca."'
    >
      <div className="space-y-5">
        <InlineAlert
          variant="info"
          title="Etapa 1 de 3"
          description="Informe quem sera o responsavel pelo pedido. O ponto so sera liberado depois da analise manual do administrador."
        />

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <SectionCard
            title="Dados do responsavel"
            description="Use um contato ativo para que a equipe possa validar a solicitacao."
            className="p-4 sm:p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {responsibleFields.map((field) => (
                <FormField
                  key={field.id}
                  id={field.id}
                  name={field.id}
                  label={field.label}
                  type={field.type}
                  placeholder={field.label}
                  value={form[field.id]}
                  onChange={handleChange}
                  className={field.id === "responsavel" ? "sm:col-span-2" : ""}
                />
              ))}
            </div>
          </SectionCard>

          <Button
            type="submit"
            variant="brandPrimary"
            className="h-14 w-full rounded-full text-base font-semibold sm:text-lg"
          >
            Continuar
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
