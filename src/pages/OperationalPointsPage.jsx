import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Save, Plus, Trash2, Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { useCepAddress } from "../hooks/useCepAddress";
import { toast } from "sonner";
import {
  listOperationalCollectionPoints,
  updateOperationalCollectionPoint,
  updatePointHours
} from "../services/collectionPoints";

const DAYS_ABBR = [
  { value: 0, label: "D", title: "Domingo" },
  { value: 1, label: "S", title: "Segunda-feira" },
  { value: 2, label: "T", title: "Terça-feira" },
  { value: 3, label: "Q", title: "Quarta-feira" },
  { value: 4, label: "Q", title: "Quinta-feira" },
  { value: 5, label: "S", title: "Sexta-feira" },
  { value: 6, label: "S", title: "Sábado" }
];

const tiposResiduo = [
  { id: 'plastico', label: 'Plástico', icon: <Recycle size={22} />, color: 'bg-red-500', ringColor: 'ring-red-500' },
  { id: 'papel', label: 'Papel', icon: <Recycle size={22} />, color: 'bg-blue-600', ringColor: 'ring-blue-500' },
  { id: 'vidro', label: 'Vidro', icon: <Recycle size={22} />, color: 'bg-emerald-500', ringColor: 'ring-emerald-500' },
  { id: 'metal', label: 'Metal', icon: <Recycle size={22} />, color: 'bg-amber-400', ringColor: 'ring-amber-400' },
  { id: 'organico', label: 'Orgânico', icon: <Recycle size={22} />, color: 'bg-amber-800', ringColor: 'ring-amber-800' },
  { id: 'eletronico', label: 'Eletrônicos', icon: <Recycle size={22} />, color: 'bg-orange-500', ringColor: 'ring-orange-500' },
];

export default function OperationalPointsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { address, setAddress, cepStatus, handleFieldChange } = useCepAddress();

  const pointsQuery = useQuery({ queryKey: ["operational-points"], queryFn: listOperationalCollectionPoints });
  const points = pointsQuery.data || [];
  const selected = points.find((point) => String(point.id) === String(selectedId)) || points[0];

  React.useEffect(() => {
    if (!selected) return;
    setSelectedId(String(selected.id));
    setForm({
      nome: selected.nome || "",
      capacidade_maxima: selected.capacidade_maxima ?? "",
      raio_operacao: selected.raio_operacao ?? 1000,
      tipos_residuos_aceitos: selected.tipos_residuos_aceitos || [],
      status: selected.status || "ativo",
    });

    let partes = (selected.endereco || "").split(", ").map(s => s.trim());
    let cepExtraido = "";
    if (partes.length > 0 && /^\d{5}-\d{3}$/.test(partes[partes.length - 1])) {
      cepExtraido = partes.pop();
    }

    let pRua = "", pNumero = "", pComplemento = "", pBairro = "", pCidade = "";

    if (partes.length >= 4) {
      pCidade = partes.pop() || "";
      pBairro = partes.pop() || "";
      pRua = partes.shift() || "";
      pNumero = partes.shift() || "";
      if (partes.length > 0) {
        pComplemento = partes.join(", ");
      }
    } else {
      pRua = partes[0] || selected.endereco || "";
      pNumero = partes[1] || "";
      pBairro = partes[2] || "";
      pCidade = partes[3] || "";
    }

    setAddress({
      cep: cepExtraido,
      rua: pRua,
      numero: pNumero,
      complemento: pComplemento,
      bairro: pBairro,
      cidade: pCidade,
    });

    if (selected.horarios) {
      const grouped = {};
      selected.horarios.forEach(h => {
        const key = `${String(h.hora_abertura).substring(0, 5)}|${String(h.hora_fechamento).substring(0, 5)}`;
        if (!grouped[key]) {
          grouped[key] = {
            dias_semana: [],
            hora_abertura: String(h.hora_abertura).substring(0, 5),
            hora_fechamento: String(h.hora_fechamento).substring(0, 5)
          };
        }
        if (!grouped[key].dias_semana.includes(h.dia_semana)) {
          grouped[key].dias_semana.push(h.dia_semana);
        }
      });
      setSchedules(Object.values(grouped).map(s => ({
        ...s,
        dias_semana: s.dias_semana.sort((a, b) => a - b)
      })));
    } else {
      setSchedules([]);
    }
  }, [selected?.id]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const toggleResiduo = (residuoId) => {
    setForm(current => {
      const isSelected = current.tipos_residuos_aceitos.includes(residuoId);
      if (isSelected) {
        return { ...current, tipos_residuos_aceitos: current.tipos_residuos_aceitos.filter(id => id !== residuoId) };
      } else {
        return { ...current, tipos_residuos_aceitos: [...current.tipos_residuos_aceitos, residuoId] };
      }
    });
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { dias_semana: [1, 2, 3, 4, 5], hora_abertura: "08:00", hora_fechamento: "18:00" }]);
  };

  const submit = async (event) => {
    event.preventDefault();
    
    const hoursPayload = [];
    for (const s of schedules) {
      if (s.dias_semana.length === 0) continue;
      if (s.hora_abertura >= s.hora_fechamento) {
        toast.error("A hora de fechamento deve ser maior que a hora de abertura na grade de funcionamento.");
        return;
      }
      for (const d of s.dias_semana) {
        hoursPayload.push({
          dia_semana: d,
          hora_abertura: s.hora_abertura + ":00",
          hora_fechamento: s.hora_fechamento + ":00"
        });
      }
    }

    const fullAddress = [address.rua, address.numero, address.complemento, address.bairro, address.cidade, address.cep]
      .filter(Boolean)
      .join(", ");

    setIsSaving(true);
    try {
      await updateOperationalCollectionPoint(selected.id, {
        ...form,
        endereco: fullAddress,
        capacidade_maxima: Number(form.capacidade_maxima),
        raio_operacao: Number(form.raio_operacao),
        tipos_residuos_aceitos: form.tipos_residuos_aceitos,
      });
      await updatePointHours(selected.id, hoursPayload);
      
      toast.success("Dados e horários do ponto atualizados com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["operational-points"] });
    } catch (error) {
      toast.error(error.message || "Erro ao salvar horários.");
      setSchedules([]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RoleShell variant="operacional" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Operação"
          title="Meus pontos de coleta"
          description="Mantenha os dados públicos e operacionais dos locais sob sua responsabilidade."
          action={<Button type="button" variant="secondary" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>}
        />

        {pointsQuery.isLoading ? <LoadingState title="Carregando seus pontos..." /> : null}
        {!pointsQuery.isLoading && !points.length ? <EmptyState title="Nenhum local vinculado à sua conta." icon={MapPin} /> : null}

        {selected && form ? (
          <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <SectionCard title="Locais de coleta">
              <div className="space-y-2">
                {points.map((point) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedId(String(point.id))}
                    className={`w-full rounded-2xl border p-3 text-left font-bold transition-all ${String(point.id) === String(selected.id) ? "border-[#0B6B53] bg-emerald-50 text-[#0B6B53]" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    {point.nome}
                    <span className="mt-1 block text-xs font-medium opacity-70 uppercase">{point.status || "ativo"}</span>
                  </button>
                ))}
              </div>
            </SectionCard>

            <form onSubmit={submit} className="space-y-5">
              <SectionCard title="Configuração do local" description="As alterações de dados e de horários ficam visíveis no mapa e nos fluxos de descarte.">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Nome do local" value={form.nome} onChange={(value) => updateField("nome", value)} />
                  <Field label="Status Operacional" as="select" value={form.status} onChange={(value) => updateField("status", value)} options={["ativo", "cheio", "inativo"]} />
                  
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-[#1a3a4a]">Endereço</label>
                    <div className="grid gap-4 sm:grid-cols-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="sm:col-span-1">
                        <Field 
                          label="CEP" 
                          value={address.cep} 
                          onChange={(val) => handleFieldChange({ target: { name: 'cep', value: val } })} 
                          placeholder="00000-000"
                        />
                        {cepStatus.loading && <span className="text-xs text-slate-500 mt-1.5 block">Buscando...</span>}
                        {cepStatus.error && <span className="text-xs text-red-500 mt-1.5 block">{cepStatus.error}</span>}
                      </div>
                      <div className="sm:col-span-3">
                        <Field label="Logradouro" value={address.rua} onChange={(val) => handleFieldChange({ target: { name: 'rua', value: val } })} />
                      </div>
                      <div className="sm:col-span-1">
                        <Field label="Número" value={address.numero} onChange={(val) => handleFieldChange({ target: { name: 'numero', value: val } })} />
                      </div>
                      <div className="sm:col-span-1">
                        <Field label="Complemento" value={address.complemento} onChange={(val) => handleFieldChange({ target: { name: 'complemento', value: val } })} />
                      </div>
                      <div className="sm:col-span-1">
                        <Field label="Bairro" value={address.bairro} onChange={(val) => handleFieldChange({ target: { name: 'bairro', value: val } })} />
                      </div>
                      <div className="sm:col-span-1">
                        <Field label="Cidade" value={address.cidade} onChange={(val) => handleFieldChange({ target: { name: 'cidade', value: val } })} />
                      </div>
                    </div>
                  </div>
                  
                  <Field label="Capacidade máxima (kg)" type="number" value={form.capacidade_maxima} onChange={(value) => updateField("capacidade_maxima", value)} />
                  <Field label="Raio de operação (m)" type="number" value={form.raio_operacao} onChange={(value) => updateField("raio_operacao", value)} />
                  
                  <div className="sm:col-span-2 mt-2">
                    <label className="mb-3 block text-sm font-bold text-[#1a3a4a]">Tipos de materiais aceitos</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                      {tiposResiduo.map((tipo) => {
                        const isSelected = form.tipos_residuos_aceitos.includes(tipo.id);
                        return (
                          <button
                            key={tipo.id}
                            type="button"
                            onClick={() => toggleResiduo(tipo.id)}
                            className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-3 font-semibold transition-all ${
                              isSelected
                                ? `${tipo.color} ring-2 ${tipo.ringColor} ring-offset-2 text-white shadow-sm`
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {tipo.icon}
                            <span className="text-[11px] leading-none uppercase tracking-wider">{tipo.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="sm:col-span-2 border-t border-slate-100 pt-6 mt-2">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-[var(--color-primary)]">Grade de Funcionamento</h3>
                      <p className="text-sm font-medium text-[var(--color-text-muted)] mt-0.5">Configure os dias e horários reais de operação deste local.</p>
                    </div>

                    <div className="space-y-4">
                      {schedules.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                          Nenhum horário configurado. O local aparecerá como fechado todos os dias.
                        </div>
                      ) : (
                        schedules.map((schedule, index) => (
                          <div key={index} className="flex flex-col xl:flex-row xl:items-end justify-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                            <div className="w-full xl:w-auto">
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Dias da Semana</label>
                              <div className="flex gap-1.5 flex-wrap">
                                {DAYS_ABBR.map(d => {
                                  const isSelected = schedule.dias_semana.includes(d.value);
                                  return (
                                    <button
                                      key={d.value}
                                      type="button"
                                      title={d.title}
                                      onClick={() => {
                                        const newSchedules = [...schedules];
                                        if (isSelected) {
                                          newSchedules[index].dias_semana = newSchedules[index].dias_semana.filter(v => v !== d.value);
                                        } else {
                                          newSchedules[index].dias_semana.push(d.value);
                                        }
                                        setSchedules(newSchedules);
                                      }}
                                      className={`h-9 w-9 flex shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${isSelected ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                    >
                                      {d.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div className="flex gap-4 w-full xl:w-auto">
                              <div className="flex-1 xl:w-32">
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">Abertura</label>
                                <input 
                                  type="time" 
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[var(--color-primary)]"
                                  value={schedule.hora_abertura}
                                  onChange={(e) => {
                                    const newSchedules = [...schedules];
                                    newSchedules[index].hora_abertura = e.target.value;
                                    setSchedules(newSchedules);
                                  }}
                                />
                              </div>

                              <div className="flex-1 xl:w-32">
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">Fechamento</label>
                                <input 
                                  type="time" 
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[var(--color-primary)]"
                                  value={schedule.hora_fechamento}
                                  onChange={(e) => {
                                    const newSchedules = [...schedules];
                                    newSchedules[index].hora_fechamento = e.target.value;
                                    setSchedules(newSchedules);
                                  }}
                                />
                              </div>

                              <div className="flex shrink-0 items-end">
                                <button 
                                  type="button" 
                                  onClick={() => setSchedules(schedules.filter((_, i) => i !== index))}
                                  className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 hover:bg-red-50 transition"
                                  title="Remover horário"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                    </div>
                  </div>

                  <div className="sm:col-span-2 flex flex-col pt-2 border-t border-slate-100 mt-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <Button type="button" variant="brandOutline" onClick={handleAddSchedule} className="w-full sm:w-auto text-sm border-dashed">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Horário
                      </Button>
                      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto px-10">
                        <Save className="mr-2 h-4 w-4" /> {isSaving ? "Salvando..." : "Salvar alterações"}
                      </Button>
                    </div>
                  </div>

                </div>
              </SectionCard>
            </form>
          </div>
        ) : null}
      </div>
    </RoleShell>
  );
}

function Field({ label, value, onChange, type = "text", as, options = [], placeholder }) {
  const className = "min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[var(--color-primary)] outline-none focus:border-[#0B6B53]";
  return (
    <div className="block text-sm font-bold text-[var(--color-primary)]">
      <label className="mb-1.5 block">{label}</label>
      {as === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full uppercase">
            <SelectValue placeholder={placeholder || "Selecione..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option} className="uppercase">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <input className={`${className}`} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}
