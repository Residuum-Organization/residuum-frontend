import React from "react";
import { Check, Pencil } from "lucide-react";
import Button from "../ui/Button";

export default function RegisterConfirmation({
  values,
  isFinalizing,
  onEdit,
  onFinalize,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={24} />
        </div>
        <h2 className="mt-3 text-3xl font-bold text-[var(--color-welcome-blue)]">
          Confirme seus dados
        </h2>
        <p className="mt-1 text-sm text-[var(--color-welcome-muted)]">
          Revise as informacoes antes de finalizar
        </p>
      </div>

      <div className="space-y-3">
        <DataRow label="Nome completo" value={values.name} />
        <DataRow label="E-mail" value={values.email} />
        <DataRow label="Telefone" value={values.phone} />
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 text-base font-semibold text-[var(--color-welcome-blue)] hover:opacity-80"
      >
        <Pencil size={16} /> Editar informacoes
      </button>

      <Button
        type="button"
        variant="brandPrimary"
        onClick={onFinalize}
        disabled={isFinalizing}
        className="mt-4 h-14 w-full rounded-full text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isFinalizing ? "Finalizando..." : "Finalizar cadastro"}
      </Button>
    </section>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[var(--color-welcome-blue)]">
        {value || "-"}
      </p>
    </div>
  );
}
