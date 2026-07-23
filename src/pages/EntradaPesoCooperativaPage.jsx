import React, { useState } from "react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import FormField from "../components/forms/FormField";
import { Send, Weight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";

const MOCK_PONTOS = [
  { id: "1", label: "Ecoponto Centro" },
  { id: "2", label: "Coleta Vizinhança - Sul" },
  { id: "3", label: "Associação de Moradores" },
];

const MATERIAIS = [
  { id: "plastico", label: "Plástico" },
  { id: "papel", label: "Papel / Papelão" },
  { id: "vidro", label: "Vidro" },
  { id: "metal", label: "Metal / Alumínio" },
  { id: "eletronico", label: "Eletrônicos" },
];

export default function EntradaPesoCooperativaPage() {
  const [form, setForm] = useState({
    ponto_origem: "",
    material: "",
    peso_kg: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.ponto_origem || !form.material || !form.peso_kg) {
      setFeedback({ type: "error", message: "Preencha todos os campos para registrar a coleta." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Mock API call
    setTimeout(() => {
      setFeedback({ type: "success", message: "Registro de coleta salvo com sucesso! O relatório de volume foi atualizado." });
      setForm({ ponto_origem: "", material: "", peso_kg: "" });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <RoleShell variant="cooperativa">
      <div className="space-y-6">
        <PageHeader 
          title="Registrar Coleta" 
          description="Lance a pesagem oficial dos resíduos recolhidos nos pontos de coleta parceiros."
        />

        {feedback && (
          <InlineAlert variant={feedback.type} description={feedback.message} />
        )}

        <div className="max-w-2xl">
          <SectionCard title="Dados da Pesagem" description="Informe a origem, o material e o peso exato em kg (quilogramas) que chegou na cooperativa.">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#1A2C71]">
                  Ponto de Coleta (Origem)
                </label>
                <Select value={form.ponto_origem} onValueChange={(val) => setForm(f => ({ ...f, ponto_origem: val }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o ponto de coleta" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PONTOS.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#1A2C71]">
                  Material recolhido
                </label>
                <Select value={form.material} onValueChange={(val) => setForm(f => ({ ...f, material: val }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAIS.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#1A2C71]">
                  Peso Total (kg)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Weight size={20} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={form.peso_kg}
                    onChange={(e) => setForm(f => ({ ...f, peso_kg: e.target.value }))}
                    className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pl-12 text-slate-900 transition focus:border-[#1A2C71] focus:outline-none focus:ring-2 focus:ring-[#1A2C71]/20"
                    placeholder="Ex: 15.5"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-slate-500 font-medium">kg</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg" 
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Registrando..." : "Registrar Pesagem"}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </RoleShell>
  );
}
