import React from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";

const addressFields = [
  { id: "cep", label: "CEP", type: "text" },
  { id: "rua", label: "Nome da Rua", type: "text" },
  { id: "numero", label: "Numero", type: "text" },
  { id: "bairro", label: "Bairro", type: "text" },
  { id: "cidade", label: "Cidade", type: "text" },
  { id: "complemento", label: "Complemento", type: "text" },
];

export default function Company() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/confirmacao");
  }

  return (
    <AuthShell
      title="Endereço de Coleta"
      subtitle="Cadastre onde o ponto recebe ou organiza os resíduos."
      description="O endereço correto facilita a rota dos moradores e ajuda a operação de coleta a encontrar o ponto sem ruído."
      highlights={[
        "Informe dados completos de localização",
        "Evite divergências na busca pelo mapa",
        "Finalize configurando os resíduos aceitos",
      ]}
      footer='"Um endereço claro reduz atrito e aumenta a adesão à coleta seletiva."'
    >
      <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-[var(--color-welcome-blue)]">
        Etapa 2 de 3 · Localização do ponto
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          {addressFields.map((field) => (
            <FormField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.label}
              className={field.id === "rua" || field.id === "complemento" ? "sm:col-span-2" : ""}
            />
          ))}
        </div>

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
