import React from "react";
import {
  Building2,
  User,
  Mail,
  Box,
  Clock,
  Recycle,
  MapPin,
  ClipboardCheck,
  Scale
} from "lucide-react";
import LoadingButton from "../ui/LoadingButton";

function ApprovalCard({
  item,
  onAprovar,
  onRejeitar,
  isApproving = false,
  isRejecting = false,
  disabled = false,
}) {
  const actionDisabled = disabled || isApproving || isRejecting;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 xl:col-span-2 2xl:col-span-1 lg:flex lg:items-start lg:gap-8">
      {/* Visual Icon */}
      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1F4E79]/10 text-[#1F4E79] lg:flex">
        <Recycle size={28} />
      </div>
      
      {/* Details Grid */}
      <div className="flex-1 space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#1F4E79]">{item.empresa || "Ponto de Coleta"}</h2>
            <p className="text-sm font-semibold text-slate-500">
              Solicitante: <span className="text-slate-700">{item.cnpj || "-"}</span>
            </p>
          </div>
          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            Pendente
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Entrega & Operação</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Box size={16} className="text-orange-500 shrink-0" />
                <span className="font-semibold">{item.quantidade || "0 kg"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Recycle size={16} className="text-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-700">{item.material || "Resíduo"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={16} className="text-rose-500 shrink-0" />
                <span className="truncate" title={item.endereco}>{item.endereco || "Endereço não informado"}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Conferência</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Scale size={16} className="text-blue-500 shrink-0" />
                <span className="font-semibold">{item.confiabilidade || "Aguardando peso"}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <ClipboardCheck size={16} className="mt-0.5 text-purple-500 shrink-0" />
                <span className="line-clamp-2" title={item.observacoes}>{item.observacoes || "Sem observações"}</span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Status & Contato</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <Clock size={16} className="mt-0.5 text-slate-400 shrink-0" />
                <span className="capitalize">{item.funcionamento || "Pendente"}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <Mail size={16} className="mt-0.5 text-slate-400 shrink-0" />
                <span className="truncate" title={item.frequencia}>{item.frequencia || "Sem e-mail"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex shrink-0 flex-col gap-3 border-t pt-5 lg:mt-0 lg:w-40 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <LoadingButton
          type="button"
          onClick={onAprovar}
          isLoading={isApproving}
          loadingText="Aprovando..."
          disabled={actionDisabled}
          className="w-full bg-[#2EA44F] hover:bg-[#258740] font-bold shadow-sm"
        >
          Aprovar
        </LoadingButton>
        <LoadingButton
          type="button"
          variant="brandOutline"
          onClick={onRejeitar}
          isLoading={isRejecting}
          loadingText="Rejeitando..."
          disabled={actionDisabled}
          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold"
        >
          Rejeitar
        </LoadingButton>
        <p className="mt-2 text-center text-xs text-slate-400">Criado em: {item.data}</p>
      </div>
    </article>
  );
}

export default ApprovalCard;
