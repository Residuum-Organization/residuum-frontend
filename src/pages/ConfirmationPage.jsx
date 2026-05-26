import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import FormField from "../components/forms/FormField";
import Button from "../components/ui/Button";

const residuos = ["Plastico", "Metal", "Vidro", "Papelao"];

export default function Confirmation() {
  const navigate = useNavigate();
  const [residuosSelecionados, setResiduosSelecionados] = useState([]);

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

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/welcome");
  }

  return (
    <AuthShell
      title="Confirmação do Ponto"
      subtitle="Defina os tipos de resíduo, quantidade e disponibilidade."
      description="Finalize o cadastro informando quais resíduos o ponto recebe e quando a coleta pode acontecer."
      highlights={[
        "Selecione os materiais aceitos",
        "Informe volume e janela de coleta",
        "Deixe observações úteis para a operação",
      ]}
      footer='"A confirmação completa transforma o cadastro em um ponto pronto para operar."'
    >
      <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-[var(--color-welcome-blue)]">
        Etapa 3 de 3 · Resíduos e disponibilidade
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[var(--color-welcome-blue)]">
              Tipo de Resíduo
            </h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {residuosSelecionados.length} selecionado(s)
            </span>
          </div>

          <div className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {residuosSelecionados.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">
                Clique nos resíduos abaixo para adicionar.
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
          label="Quantidade"
          placeholder="Ex: 10 kg, 5 sacolas, 2 caixas"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="data" label="Data" type="date" />
          <FormField id="horario" label="Horario" type="time" />
        </div>

        <FormField
          id="observacoes"
          label="Observações"
          as="textarea"
          placeholder="Digite alguma observação"
        />

        <Button
          type="submit"
          variant="brandPrimary"
          className="h-14 w-full rounded-full text-lg font-semibold"
        >
          <span className="inline-flex items-center justify-center gap-2">
            Finalizar Cadastro
            <CheckCircle2 size={20} />
          </span>
        </Button>
      </form>
    </AuthShell>
  );
}
