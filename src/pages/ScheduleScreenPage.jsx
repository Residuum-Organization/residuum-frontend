import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { listOperationalCollectionPoints, updatePointHours } from "../services/collectionPoints";

const DAYS_ABBR = [
  { value: 0, label: "D", title: "Domingo" },
  { value: 1, label: "S", title: "Segunda-feira" },
  { value: 2, label: "T", title: "Terça-feira" },
  { value: 3, label: "Q", title: "Quarta-feira" },
  { value: 4, label: "Q", title: "Quinta-feira" },
  { value: 5, label: "S", title: "Sexta-feira" },
  { value: 6, label: "S", title: "Sábado" }
];

export default function ScheduleScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPointId, setSelectedPointId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const { data: points = [], isLoading: isLoadingPoints } = useQuery({
    queryKey: ["collectionPoints"],
    queryFn: listOperationalCollectionPoints,
  });

  const selectedPoint = points.find(p => String(p.id) === selectedPointId);

  useEffect(() => {
    if (selectedPoint && selectedPoint.horarios) {
      const grouped = {};
      selectedPoint.horarios.forEach(h => {
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
      // Sort days for consistent display
      const newSchedules = Object.values(grouped).map(s => ({
        ...s,
        dias_semana: s.dias_semana.sort((a, b) => a - b)
      }));
      setSchedules(newSchedules);
    } else {
      setSchedules([]);
    }
    setFeedback(null);
  }, [selectedPointId, selectedPoint]);

  const saveMutation = useMutation({
    mutationFn: (payload) => updatePointHours(selectedPointId, payload),
    onSuccess: () => {
      setFeedback({ tone: "success", message: "Horários atualizados com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["collectionPoints"] });
    },
    onError: (err) => {
      setFeedback({ tone: "error", message: err.message });
    }
  });

  const handleAddSchedule = () => {
    setSchedules([...schedules, { dias_semana: [1, 2, 3, 4, 5], hora_abertura: "08:00", hora_fechamento: "18:00" }]);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedPointId) {
      setFeedback({ tone: "error", message: "Selecione um ponto de coleta." });
      return;
    }
    
    const payload = [];
    for (const s of schedules) {
      if (s.dias_semana.length === 0) continue;
      if (s.hora_abertura >= s.hora_fechamento) {
        setFeedback({ tone: "error", message: "A hora de fechamento deve ser maior que a hora de abertura." });
        return;
      }
      for (const d of s.dias_semana) {
        payload.push({
          dia_semana: d,
          hora_abertura: s.hora_abertura + ":00",
          hora_fechamento: s.hora_fechamento + ":00"
        });
      }
    }
    saveMutation.mutate(payload);
  };

  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]">
      <div className="space-y-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 shadow-sm sm:p-6 lg:min-h-[calc(100vh-4rem)]">
        <PageHeader
          eyebrow="Configuração"
          title="Horários de Funcionamento"
          description="Configure os dias e horários que seus pontos de coleta recebem resíduos."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button type="button" onClick={handleSave} disabled={!selectedPointId || saveMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {saveMutation.isPending ? "Salvando..." : "Salvar Horários"}
              </Button>
            </div>
          }
        />

        {feedback && (
          <InlineAlert variant={feedback.tone}>
            {feedback.message}
          </InlineAlert>
        )}

        <section className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-4">
            <SectionCard title="Selecione o Ponto">
              {isLoadingPoints ? (
                <div className="text-sm text-slate-500">Carregando locais...</div>
              ) : (
                <Select value={selectedPointId} onValueChange={setSelectedPointId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {points.map(pt => (
                      <SelectItem key={pt.id} value={String(pt.id)}>{pt.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </SectionCard>
            
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm shadow-slate-200/70">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--color-primary)]">
                  <CalendarClock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[var(--color-primary)]">
                    Dica de Operação
                  </h2>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Lembre-se de configurar janelas reais onde haverá um responsável para confirmar os descartes via aplicativo.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <SectionCard 
              title={selectedPoint ? `Grade de horários: ${selectedPoint.nome}` : "Grade de horários"} 
              description={selectedPoint ? "Adicione os dias e os intervalos de funcionamento." : "Selecione um ponto de coleta para configurar os horários."}
            >
              {!selectedPointId ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                  Nenhum ponto selecionado.
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                      Nenhum horário configurado para este local. Adicione um clicando no botão abaixo.
                    </div>
                  ) : (
                    schedules.map((schedule, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-end gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="w-full sm:flex-1">
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Dias da Semana</label>
                          <div className="flex gap-1">
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
                                  className={`h-9 w-9 flex items-center justify-center rounded-full text-xs font-bold transition ${isSelected ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                >
                                  {d.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="w-full sm:w-32">
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Abertura</label>
                          <input 
                            type="time" 
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm outline-none focus:border-[var(--color-primary)]"
                            value={schedule.hora_abertura}
                            onChange={(e) => handleChange(index, "hora_abertura", e.target.value)}
                          />
                        </div>

                        <div className="w-full sm:w-32">
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Fechamento</label>
                          <input 
                            type="time" 
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm outline-none focus:border-[var(--color-primary)]"
                            value={schedule.hora_fechamento}
                            onChange={(e) => handleChange(index, "hora_fechamento", e.target.value)}
                          />
                        </div>

                        <button 
                          type="button" 
                          onClick={() => handleRemoveSchedule(index)}
                          className="h-10 w-10 sm:shrink-0 flex items-center justify-center rounded-md border border-red-200 bg-white text-red-500 hover:bg-red-50 transition"
                          title="Remover horário"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}

                  <div className="pt-2">
                    <Button type="button" variant="brandOutline" onClick={handleAddSchedule} className="w-full sm:w-auto text-sm border-dashed">
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Horário
                    </Button>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
