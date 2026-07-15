import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, ArrowLeft, CheckCircle2, Calendar, MapPin, Plus, Trash2 } from "lucide-react";
import TimeSlots from "../components/coleta-dados/TimeSlots";
import CollectionPoints from "../components/coleta-dados/CollectionPoints";
import SystemStatus from "../components/coleta-dados/SystemStatus";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import { TIME_SLOTS } from "../constants/schedule";
import { listOperationalCollectionPoints } from "../services/collectionPoints";
import { listAgendas, createAgenda, deleteAgenda } from "../services/admin";

export default function ScheduleScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    pontoId: "",
    data: new Date().toISOString().split("T")[0],
    turnoId: ""
  });
  const [feedback, setFeedback] = useState(null);

  const { data: points = [], isLoading: isLoadingPoints } = useQuery({
    queryKey: ["collectionPoints"],
    queryFn: listOperationalCollectionPoints,
  });

  const { data: agendas = [], isLoading: isLoadingAgendas } = useQuery({
    queryKey: ["agendas"],
    queryFn: listAgendas,
  });

  const scheduleMutation = useMutation({
    mutationFn: createAgenda,
    onSuccess: () => {
      setFeedback({ tone: "success", message: "Coleta agendada com sucesso!" });
      setIsModalOpen(false);
      setForm({ pontoId: "", data: new Date().toISOString().split("T")[0], turnoId: "" });
      queryClient.invalidateQueries(["agendas"]);
    },
    onError: (err) => {
      setFeedback({ tone: "error", message: err.message });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAgenda,
    onSuccess: () => {
      setFeedback({ tone: "success", message: "Coleta cancelada." });
      queryClient.invalidateQueries(["agendas"]);
    },
    onError: (err) => {
      setFeedback({ tone: "error", message: err.message });
    }
  });

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!form.pontoId || !form.data || !form.turnoId) {
      setFeedback({ tone: "error", message: "Preencha todos os campos." });
      return;
    }
    
    scheduleMutation.mutate({
      ponto_coleta_id: parseInt(form.pontoId),
      data: form.data,
      turno_id: form.turnoId
    });
  };

  const handleCancel = (id) => {
    if (window.confirm("Deseja cancelar esta coleta agendada?")) {
      deleteMutation.mutate(id);
    }
  };

  const scheduledItems = agendas.map(agenda => {
    const point = points.find(p => p.id === agenda.ponto_coleta_id);
    const slot = TIME_SLOTS.find(s => s.id === agenda.turno_id);
    return {
      id: agenda.id,
      pointName: point?.nome || "Ponto desconhecido",
      date: agenda.data,
      slotName: slot?.label || "Desconhecido",
      slotTime: slot?.time || ""
    };
  });

  return (
    <RoleShell variant="operacional" shellClassName="bg-[var(--color-surface)]">
      <div className="space-y-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 shadow-sm sm:p-6 lg:min-h-[calc(100vh-4rem)]">
        <PageHeader
          eyebrow="Cooperativa / Empresa de coleta"
          title="Agenda de coletas"
          description="Organize horários, disponibilidade dos pontos e leitura operacional da agenda."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                type="button"
                className="w-full gap-2 sm:w-auto"
                aria-label="Agendar coleta"
                onClick={() => {
                  setFeedback(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Agendar coleta
              </Button>
            </div>
          }
        />

        {feedback && (
          <InlineAlert variant={feedback.tone}>
            {feedback.message}
          </InlineAlert>
        )}

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-4">
            
            <SectionCard title="Coletas agendadas" description="Próximas visitas aos pontos de coleta.">
              {scheduledItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                  Nenhuma coleta agendada.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {scheduledItems.map(item => (
                    <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                        <span className="text-sm font-bold text-[#1e3a5f]">{item.date.split("-").reverse().join("/")}</span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{item.slotName} ({item.slotTime})</span>
                      </div>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-600 line-clamp-2">{item.pointName}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs font-bold text-green-600">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Confirmado
                        </span>
                        <button type="button" onClick={() => handleCancel(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg flex items-center gap-1 transition">
                          <Trash2 className="h-3 w-3" /> Cancelar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <TimeSlots />
            {isLoadingPoints ? (
              <div className="p-4 text-center">Carregando pontos...</div>
            ) : (
              <CollectionPoints points={points} />
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm shadow-slate-200/70">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--color-primary)]">
                  <CalendarClock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[var(--color-primary)]">
                    Operação do dia
                  </h2>
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">
                    Resumo visual para acompanhamento da agenda.
                  </p>
                </div>
              </div>
              <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                  <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    Agendadas
                  </dt>
                  <dd className="mt-1 text-2xl font-black text-[var(--color-primary)]">
                    {scheduledItems.length}
                  </dd>
                </div>
                <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                  <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    Janelas
                  </dt>
                  <dd className="mt-1 text-2xl font-black text-[var(--color-primary)]">
                    {TIME_SLOTS.length}
                  </dd>
                </div>
                <div className="rounded-2xl bg-[var(--color-surface)] p-3">
                  <dt className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    Pontos disponíveis
                  </dt>
                  <dd className="mt-1 text-2xl font-black text-[var(--color-primary)]">
                    {points.length}
                  </dd>
                </div>
              </dl>
            </div>

            <SystemStatus />
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-extrabold text-[#1a3a4a] mb-1">Agendar Nova Coleta</h3>
            <p className="text-sm text-slate-500 mb-5">Planeje uma retirada em um ponto de coleta específico.</p>
            
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1a3a4a] mb-1.5">Ponto de Coleta</label>
                <select
                  value={form.pontoId}
                  onChange={(e) => setForm({...form, pontoId: e.target.value})}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-sm text-[#1a3a4a] outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Selecione um ponto...</option>
                  {points.map(pt => (
                    <option key={pt.id} value={pt.id}>{pt.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a3a4a] mb-1.5">Data da Coleta</label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({...form, data: e.target.value})}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-sm text-[#1a3a4a] outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a3a4a] mb-1.5">Turno / Janela</label>
                <select
                  value={form.turnoId}
                  onChange={(e) => setForm({...form, turnoId: e.target.value})}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-sm text-[#1a3a4a] outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Selecione uma janela...</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.label} ({slot.time})</option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Agendar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleShell>
  );
}
