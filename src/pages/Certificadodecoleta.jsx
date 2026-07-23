import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Award, Download, Leaf, Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { getDiscardHistory } from "../services/discards";
import { queryKeys } from "../services/queryKeys";
import { useAuth } from "../contexts/AuthContext";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("pt-BR") : "Data nao informada";

export default function CertificadoDeColeta() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = React.useState("");
  const historyQuery = useQuery({ queryKey: queryKeys.discardHistory, queryFn: getDiscardHistory });
  const confirmed = (historyQuery.data || []).filter((item) => item.status === "confirmado");
  const selected = confirmed.find((item) => String(item.id_descarte) === String(selectedId)) || confirmed[0];

  React.useEffect(() => {
    if (!selectedId && confirmed[0]) setSelectedId(String(confirmed[0].id_descarte));
  }, [confirmed, selectedId]);

  return (
    <RoleShell variant="morador" contentClassName="px-4 py-4 pb-36 sm:px-6 sm:py-6 lg:px-8 lg:pb-32">
      <style>{`@media print { body * { visibility: hidden; } #certificate, #certificate * { visibility: visible; } #certificate { position: fixed; inset: 0; width: 100%; border: 0 !important; box-shadow: none !important; } }`}</style>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Comprovacao ambiental"
          title="Certificado de coleta"
          description="Gere um comprovante para cada descarte validado pela rede Residuum."
          action={<Button type="button" variant="secondary" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>}
        />

        {historyQuery.isLoading ? <LoadingState title="Carregando coletas confirmadas..." /> : null}
        {historyQuery.isError ? <ErrorState title="Nao foi possivel carregar suas coletas." /> : null}
        {!historyQuery.isLoading && !historyQuery.isError && !confirmed.length ? (
          <EmptyState title="Nenhuma coleta disponivel para certificado." description="O certificado e liberado apos a confirmacao presencial do descarte." icon={Award} />
        ) : null}

        {selected ? (
          <>
            <SectionCard title="Escolha a coleta" description="Cada documento corresponde a uma validacao confirmada.">
              <Select
                value={selectedId}
                onValueChange={setSelectedId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma coleta" />
                </SelectTrigger>
                <SelectContent>
                  {confirmed.map((item) => (
                    <SelectItem key={item.id_descarte} value={String(item.id_descarte)}>
                      {formatDate(item.data_desc)} - {item.ponto_coleta_nome || "Ponto Residuum"} - {Number(item.quantidade_confirmada ?? item.quantidade ?? 0).toLocaleString("pt-BR")} kg
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SectionCard>

            <article id="certificate" className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-xl shadow-emerald-950/10">
              <div className="h-4 bg-[#0B6B53]" />
              <div className="relative overflow-hidden p-6 sm:p-10">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-50" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0B6B53]">Residuum</p>
                      <h2 className="mt-2 text-3xl font-black text-[#17324d] sm:text-4xl">Certificado ambiental</h2>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0B6B53] text-white"><Leaf size={32} /></div>
                  </div>

                  <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-600">
                    A Residuum certifica que <strong className="text-[#17324d]">{user?.nome || user?.name || "Cidadao Residuum"}</strong> realizou a destinacao ambientalmente adequada do material descrito abaixo, com validacao do ponto de coleta credenciado.
                  </p>

                  <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DataBox label="Data da coleta" value={formatDate(selected.data_desc)} />
                    <DataBox label="Ponto de coleta" value={selected.ponto_coleta_nome || "Ponto Residuum"} />
                    <DataBox label="Material" value={String(selected.tipo_residuo || "Reciclavel").replaceAll("_", " ")} />
                    <DataBox label="Peso validado" value={`${Number(selected.quantidade_confirmada ?? selected.quantidade ?? 0).toLocaleString("pt-BR")} kg`} />
                  </dl>

                  <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3"><Recycle className="text-[#0B6B53]" /><div><p className="text-xs font-black uppercase text-emerald-700">Pontos concedidos</p><p className="text-2xl font-black text-[#0B6B53]">+{selected.pontos_recebidos || selected.pontos || 0} pontos</p></div></div>
                    <p className="font-mono text-xs font-bold text-slate-500">CERT-RSD-{String(selected.id_descarte).padStart(8, "0")}</p>
                  </div>

                  <p className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">Documento gerado pela plataforma Residuum com base em um descarte confirmado.</p>
                </div>
              </div>
            </article>

            <Button type="button" className="w-full sm:w-auto" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" /> Imprimir ou salvar em PDF
            </Button>
          </>
        ) : null}
      </div>
    </RoleShell>
  );
}

function DataBox({ label, value }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><dt className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-2 break-words text-base font-extrabold capitalize text-[#17324d]">{value}</dd></div>;
}
