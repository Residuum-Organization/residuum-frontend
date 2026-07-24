import React, { useState } from "react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import InlineAlert from "../components/ui/InlineAlert";
import FormField from "../components/forms/FormField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listOperationalCollectionPoints, registrarPesagemAvulsa } from "../services/collectionPoints";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Send, Weight } from "lucide-react";
import LoadingState from "../components/ui/LoadingState";


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

  const queryClient = useQueryClient();

  const { data: pontos = [], isLoading: isLoadingPontos } = useQuery({
    queryKey: ["operational-points"],
    queryFn: listOperationalCollectionPoints,
  });

  const mutation = useMutation({
    mutationFn: registrarPesagemAvulsa,
    onSuccess: () => {
      toast.success("Registro salvo! O relatório de volume foi atualizado.");
      setForm({ ponto_origem: "", material: "", peso_kg: "" });
      queryClient.invalidateQueries({ queryKey: ["operational-points"] });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao registrar a pesagem.");
    }
  });

  const selectedPonto = pontos.find((p) => String(p.id) === form.ponto_origem);
  const unidadesNoInventario = selectedPonto?.inventario?.[form.material] || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.ponto_origem || !form.material || !form.peso_kg) {
      toast.error("Preencha todos os campos para registrar a coleta.");
      return;
    }

    mutation.mutate({
      ponto_coleta_id: Number(form.ponto_origem),
      material: form.material,
      peso_kg: Number(form.peso_kg),
    });
  };

  return (
    <RoleShell variant="operacional">
      <div className="space-y-6">
        <PageHeader 
          title="Registrar Coleta" 
          description="Lance a pesagem oficial dos resíduos recolhidos nos pontos de coleta parceiros."
        />


        <div className="max-w-2xl">
          <SectionCard title="Dados da Pesagem" description="Informe a origem, o material e o peso exato em kg (quilogramas) que chegou na cooperativa.">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#1A2C71]">
                  Ponto de Coleta (Origem)
                </label>
                <Select value={form.ponto_origem} onValueChange={(val) => setForm(f => ({ ...f, ponto_origem: val }))} disabled={isLoadingPontos}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPontos ? "Carregando..." : "Selecione o ponto de coleta"} />
                  </SelectTrigger>
                  <SelectContent>
                    {pontos.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>
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

              {form.ponto_origem && form.material && (
                <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                  <p className="text-sm font-medium text-sky-800">
                    📦 Inventário aguardando coleta no local selecionado: <strong className="text-lg">{unidadesNoInventario}</strong> unidades de {MATERIAIS.find(m => m.id === form.material)?.label}.
                  </p>
                </div>
              )}

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
                  disabled={mutation.isPending}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {mutation.isPending ? "Registrando..." : "Registrar Pesagem"}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </RoleShell>
  );
}
