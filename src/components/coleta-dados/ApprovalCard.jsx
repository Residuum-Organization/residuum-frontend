import React, { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Box,
  Clock,
  Recycle,
  MapPin,
  ClipboardCheck,
  Scale,
  ScanBarcode,
  Sticker,
} from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import BarcodeScanner from "../BarcodeScanner";

function ApprovalCard({
  item,
  onAprovar,
  onRejeitar,
  isApproving = false,
  isRejecting = false,
  disabled = false,
  requiresIdentification = true,
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [withoutLabel, setWithoutLabel] = useState(false);
  const [manualIdentification, setManualIdentification] = useState("");
  const actionDisabled = disabled || isApproving || isRejecting;
  const identificationReady = !requiresIdentification || Boolean(barcode || (withoutLabel && manualIdentification.trim()));

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

      <div className="mt-6 shrink-0 border-t pt-5 lg:mt-0 lg:w-64 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        {requiresIdentification ? <p className="text-xs font-black uppercase tracking-wider text-slate-400">Identificação do produto</p> : null}
        {requiresIdentification ? (
          <>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className={`rounded-xl border p-3 text-left text-xs font-bold transition ${barcode ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 text-[#1F4E79] hover:border-[#1F4E79]"}`}
          >
            <ScanBarcode className="mb-2" size={20} />
            {barcode ? "Código lido" : "Escanear"}
          </button>
          <button
            type="button"
            onClick={() => {
              setWithoutLabel(true);
              setBarcode("");
            }}
            className={`rounded-xl border p-3 text-left text-xs font-bold transition ${withoutLabel ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-200 text-slate-600 hover:border-amber-300"}`}
          >
            <Sticker className="mb-2" size={20} />
            Sem rótulo
          </button>
        </div>
        {barcode ? <p className="mt-2 break-all rounded-xl bg-slate-50 p-2 font-mono text-xs text-slate-600">{barcode}</p> : null}
        {withoutLabel ? (
          <label className="mt-3 block text-xs font-bold text-slate-600">
            Identificação manual
            <input
              type="text"
              value={manualIdentification}
              onChange={(event) => setManualIdentification(event.target.value)}
              placeholder="Ex.: garrafa PET transparente"
              className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium outline-none focus:border-[#1F4E79]"
            />
          </label>
        ) : null}
          </>
        ) : (
          <p className="rounded-xl bg-sky-50 p-3 text-xs font-semibold text-[#1F4E79]">Acesso administrativo para auditoria e apoio operacional.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
        <LoadingButton
          type="button"
          onClick={() => onAprovar({
            codigo_barras_validado: barcode || undefined,
            sem_rotulo: withoutLabel,
            identificacao_manual: manualIdentification.trim() || undefined,
          })}
          isLoading={isApproving}
          loadingText="Aprovando..."
          disabled={actionDisabled || !identificationReady}
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
        </div>
        {!identificationReady ? <p className="mt-2 text-center text-[11px] font-medium text-amber-700">Escaneie o código ou identifique o item sem rótulo.</p> : null}
        <p className="mt-2 text-center text-xs text-slate-400">Criado em: {item.data}</p>
      </div>
      {requiresIdentification && showScanner ? (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onScan={(value) => {
            setBarcode(value);
            setWithoutLabel(false);
            setManualIdentification("");
            setShowScanner(false);
          }}
        />
      ) : null}
    </article>
  );
}

export default ApprovalCard;
