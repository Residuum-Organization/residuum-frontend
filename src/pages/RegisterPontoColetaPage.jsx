import React from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import { saveCollectionPointDraft } from "../services/collectionPointRequests";

const responsibleFields = [
  { id: "responsavel", label: "Nome do Responsável", type: "text" },
  { id: "documento", label: "CPF/CNPJ", type: "text" },
  { id: "telefone", label: "Telefone", type: "tel" },
  { id: "email", label: "E-mail", type: "email" },
  { id: "senha", label: "Senha", type: "password" },
  { id: "confirmarSenha", label: "Confirmar Senha", type: "password" },
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
      subtitle="Informe os dados do responsável pelo ponto de coleta."
      description="Cadastre seu ponto de coleta para receber moradores, organizar descartes e acompanhar solicitações na plataforma Residuum."
      highlights={[
        "Identifique o responsável pelo cadastro",
        "Mantenha contato e acesso protegidos",
        "Avance para cadastrar o endereço de coleta",
      ]}
      footer='"Pontos bem cadastrados ajudam a cidade a reciclar com mais confiança."'
    >
      <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-[var(--color-welcome-blue)]">
        Etapa 1 de 3 · Dados do responsável
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
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
          />
        ))}

        <Button
          type="submit"
          variant="brandPrimary"
          className="mt-2 h-14 w-full rounded-full text-lg font-semibold"
        >
          Continuar
        </Button>
      </form>
    </AuthShell>
  );
}
