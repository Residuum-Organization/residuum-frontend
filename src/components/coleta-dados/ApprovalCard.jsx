import React from "react";
import {
  FaBox,
  FaBuilding,
  FaClipboardList,
  FaClock,
  FaMapMarkerAlt,
  FaRecycle,
  FaRegCalendarAlt,
  FaStar,
  FaSyncAlt,
} from "react-icons/fa";
import LoadingButton from "../ui/LoadingButton";

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="font-bold text-slate-700">{label}: </span>
        <span className="break-words">{value || "-"}</span>
      </span>
    </div>
  );
}

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
    <article className="mb-4 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm shadow-slate-200/70 transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-600">
          <FaBuilding aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="break-words text-xl font-extrabold leading-tight text-slate-800">
                {item.empresa || "-"}
              </h2>
              <p className="mt-1 break-words text-sm font-semibold text-[var(--color-primary)]">
                Solicitante{" "}
                <span className="text-slate-500">{item.cnpj || "-"}</span>
              </p>
            </div>
            <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              Pendente
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <InfoRow
              icon={<FaMapMarkerAlt className="text-[var(--color-primary)]" />}
              label="Endereço"
              value={item.endereco}
            />
            <InfoRow
              icon={<FaRecycle className="text-green-600" />}
              label="Material"
              value={item.material}
            />
            <InfoRow
              icon={<FaBox className="text-orange-500" />}
              label="Quantidade"
              value={item.quantidade}
            />
            <InfoRow
              icon={<FaRegCalendarAlt className="text-slate-500" />}
              label="Data"
              value={item.data}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-extrabold uppercase text-slate-700">
          Dados de conferência
        </h3>
        <div className="grid gap-2 lg:grid-cols-2">
          <InfoRow
            icon={<FaClock className="text-blue-500" />}
            label="Status"
            value={item.funcionamento}
          />
          <InfoRow
            icon={<FaSyncAlt className="text-purple-500" />}
            label="Contato"
            value={item.frequencia}
          />
          <InfoRow
            icon={<FaStar className="text-yellow-500" />}
            label="Conferência"
            value={item.confiabilidade}
          />
          <InfoRow
            icon={<FaClipboardList className="text-slate-500" />}
            label="Observações"
            value={item.observacoes}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end">
        <LoadingButton
          type="button"
          variant="brandOutline"
          onClick={onRejeitar}
          isLoading={isRejecting}
          loadingText="Rejeitando..."
          disabled={actionDisabled}
          className="w-full border-red-300 text-red-600 hover:bg-red-50 sm:w-auto"
        >
          Rejeitar
        </LoadingButton>
        <LoadingButton
          type="button"
          onClick={onAprovar}
          isLoading={isApproving}
          loadingText="Aprovando..."
          disabled={actionDisabled}
          className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
        >
          Aprovar
        </LoadingButton>
      </div>
    </article>
  );
}

export default ApprovalCard;
