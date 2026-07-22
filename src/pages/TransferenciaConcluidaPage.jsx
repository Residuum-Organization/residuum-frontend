import React, { useEffect, useState } from "react";
import { Check, Home, MapPin, PackageCheck, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import RoleShell from "../components/layout/RoleShell";
import Button from "../components/ui/Button";

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

export default function TransferenciaConcluidaPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => navigate("/inicio", { replace: true }), 5000);
    const countdownTimer = window.setInterval(
      () => setCountdown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8 pb-28 sm:px-6 lg:pb-8">
      <main className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 text-center shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-100/80 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            <Check size={48} strokeWidth={3} />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Envio concluído</p>
          <h1 className="mt-2 text-3xl font-black text-[#1F4E79] sm:text-4xl">Parabéns, seus resíduos estão a caminho.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
            O ponto de coleta fará a conferência dos produtos e da pesagem. Os pontos serão liberados após a aprovação.
          </p>

          <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <PackageCheck className="text-[#1F4E79]" size={22} />
              <small className="mt-3 block font-bold text-slate-500">Materiais</small>
              <strong className="mt-1 block text-[#1F4E79]">{state?.itemCount || 1} item(ns) · {formatQuantity(state?.totalWeight)} kg</strong>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <MapPin className="text-sky-700" size={22} />
              <small className="mt-3 block font-bold text-slate-500">Destino</small>
              <strong className="mt-1 block text-[#1F4E79]">{state?.pointName || "Ponto de coleta"}</strong>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <Sparkles className="text-emerald-700" size={22} />
              <small className="mt-3 block font-bold text-emerald-700">Pontos estimados</small>
              <strong className="mt-1 block text-emerald-700">+{state?.totalPoints || 0} pts</strong>
            </div>
          </div>

          <Button type="button" onClick={() => navigate("/inicio", { replace: true })} className="mt-7 w-full sm:w-auto sm:min-w-64">
            <Home className="mr-2 h-4 w-4" /> Voltar ao início
          </Button>
          <p className="mt-4 text-xs font-semibold text-slate-400" aria-live="polite">
            Retorno automático em {countdown} segundo{countdown === 1 ? "" : "s"}.
          </p>
        </div>
      </main>
    </RoleShell>
  );
}
