import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import InlineAlert from "../components/ui/InlineAlert";
import {
  listOperationalCollectionPoints,
  updateOperationalCollectionPoint,
} from "../services/collectionPoints";

export default function OperationalPointsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = React.useState("");
  const [form, setForm] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);
  const pointsQuery = useQuery({ queryKey: ["operational-points"], queryFn: listOperationalCollectionPoints });
  const points = pointsQuery.data || [];
  const selected = points.find((point) => String(point.id) === String(selectedId)) || points[0];

  React.useEffect(() => {
    if (!selected) return;
    setSelectedId(String(selected.id));
    setForm({
      nome: selected.nome || "",
      endereco: selected.endereco || "",
      capacidade_maxima: selected.capacidade_maxima ?? "",
      raio_operacao: selected.raio_operacao ?? 1000,
      horario_funcionamento: selected.horario_funcionamento || "",
      tipos_residuos_aceitos: (selected.tipos_residuos_aceitos || []).join(", "),
      status: selected.status || "ativo",
    });
  }, [selected?.id]);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) => updateOperationalCollectionPoint(id, payload),
    onSuccess: () => {
      setFeedback({ type: "success", text: "Dados do ponto atualizados." });
      queryClient.invalidateQueries({ queryKey: ["operational-points"] });
      queryClient.invalidateQueries({ queryKey: ["collectionPoints"] });
    },
    onError: (error) => setFeedback({ type: "error", text: error.message }),
  });

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    setFeedback(null);
    saveMutation.mutate({
      id: selected.id,
      payload: {
        ...form,
        capacidade_maxima: Number(form.capacidade_maxima),
        raio_operacao: Number(form.raio_operacao),
        tipos_residuos_aceitos: form.tipos_residuos_aceitos.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean),
      },
    });
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
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <SectionCard title="Locais de coleta">
              <div className="space-y-2">
                {points.map((point) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedId(String(point.id))}
                    className={`w-full rounded-2xl border p-3 text-left font-bold ${String(point.id) === String(selected.id) ? "border-[#0B6B53] bg-emerald-50 text-[#0B6B53]" : "border-slate-200 text-slate-600"}`}
                  >
                    {point.nome}
                    <span className="mt-1 block text-xs font-medium opacity-70">{point.status || "ativo"}</span>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Dados do local" description="As alterações ficam visíveis no mapa e nos fluxos de descarte.">
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" value={form.nome} onChange={(value) => updateField("nome", value)} />
                <Field label="Status" as="select" value={form.status} onChange={(value) => updateField("status", value)} options={["ativo", "cheio", "inativo"]} />
                <div className="sm:col-span-2"><Field label="Endereço" value={form.endereco} onChange={(value) => updateField("endereco", value)} /></div>
                <Field label="Capacidade máxima (kg)" type="number" value={form.capacidade_maxima} onChange={(value) => updateField("capacidade_maxima", value)} />
                <Field label="Raio de operação (m)" type="number" value={form.raio_operacao} onChange={(value) => updateField("raio_operacao", value)} />
                <div className="sm:col-span-2"><Field label="Materiais aceitos, separados por vírgula" placeholder="Ex.: Plástico, Papel, Vidro" value={form.tipos_residuos_aceitos} onChange={(value) => updateField("tipos_residuos_aceitos", value)} /></div>
                <div className="sm:col-span-2"><Field label="Horário de funcionamento" value={form.horario_funcionamento} onChange={(value) => updateField("horario_funcionamento", value)} /></div>
                {feedback ? <div className="sm:col-span-2"><InlineAlert variant={feedback.type} description={feedback.text} /></div> : null}
                <Button type="submit" disabled={saveMutation.isPending} className="sm:col-span-2 sm:justify-self-end"><Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? "Salvando..." : "Salvar alterações"}</Button>
              </form>
            </SectionCard>
          </div>
        ) : null}
      </div>
    </RoleShell>
  );
}

function Field({ label, value, onChange, type = "text", as, options = [], placeholder }) {
  const className = "min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[var(--color-primary)] outline-none focus:border-[#0B6B53]";
  return <label className="block text-sm font-bold text-[var(--color-primary)]">{label}{as === "select" ? <select className={`${className} mt-1.5`} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input className={`${className} mt-1.5`} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}</label>;
}
