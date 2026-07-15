import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import SectionCard from "../components/ui/SectionCard";
import { saveCollectionPointDraft } from "../services/collectionPointRequests";

const responsibleFields = [
  { id: "responsavel", label: "Seu nome completo", type: "text" },
  { id: "documento", label: "Seu CPF ou CNPJ", type: "text" },
  { id: "telefone", label: "Telefone", type: "tel" },
  { id: "email", label: "E-mail", type: "email" },
  { id: "senha", label: "Senha", type: "password" },
  { id: "confirmarSenha", label: "Confirmar senha", type: "password" },
];

export default function RegisterPontoColetaPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = React.useState("");
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

    if (Object.values(form).some((value) => !String(value).trim())) {
      setFeedback("Preencha todos os campos para continuar.");
      return;
    }
    if (form.senha.length < 6) {
      setFeedback("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setFeedback("As senhas informadas nao conferem.");
      return;
    }

    setFeedback("");
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
      title="Seja um Ponto de Coleta"
      subtitle="Vamos começar conhecendo quem vai gerenciar o espaço."
      description="Junte-se à nossa rede! Ao se tornar um ponto de coleta parceiro, você ajuda a vizinhança a reciclar e contribui ativamente para uma cidade mais limpa."
      highlights={[
        "Cadastro gratuito e rápido",
        "Aumente a visibilidade e visitas ao seu espaço",
        "Faça parte da rede oficial de impacto sustentável",
      ]}
      footer='"Toda grande mudança ambiental começa com pequenas iniciativas locais."'
    >
      <div className="mb-6">
        <button 
          type="button" 
          onClick={() => navigate('/welcome')} 
          className="inline-flex items-center text-sm font-semibold text-[var(--color-welcome-blue)] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </button>
      </div>
      <div className="space-y-5">
        <InlineAlert
          variant="info"
          title="Vamos juntos? (Etapa 1 de 3)"
          description="Para começarmos, precisamos saber quem será a pessoa responsável pelo local. Nossa equipe fará uma validação super rápida para aprovar sua entrada."
        />

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <SectionCard
            title="Seus dados de contato"
            description="Use o e-mail e telefone que você acessa com mais frequência para não perder nenhuma atualização."
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

          {feedback ? (
            <InlineAlert variant="warning" title="Revise os dados" description={feedback} />
          ) : null}

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
