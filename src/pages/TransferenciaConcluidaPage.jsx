import React, { useEffect, useState } from "react";
import { Check, Home, MapPin, PackageCheck, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import RoleShell from "../components/layout/RoleShell";
import Button from "../components/ui/Button";

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

const SUCCESS_PHRASES = [
  "Parabéns, você ajudou a salvar o planeta!",
  "Mandou bem! O meio ambiente agradece.",
  "Incrível! Mais um passo rumo à sustentabilidade."
];

export default function TransferenciaConcluidaPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [phrase] = useState(() => SUCCESS_PHRASES[Math.floor(Math.random() * SUCCESS_PHRASES.length)]);

  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={120}
        gravity={0.15}
        initialVelocityY={20}
        colors={['#059669', '#10b981', '#34d399', '#0284c7', '#38bdf8', '#1A2C71']}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, pointerEvents: 'none' }}
      />
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8 pb-28 sm:px-6 lg:pb-8">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      <main className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 text-center shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-100/80 blur-3xl" />

        <div className="relative">
          <div className="animate-pop-in mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            <Check size={40} strokeWidth={3} />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Descarte validado</p>
          <h1 className="mt-1 text-2xl font-black text-[#1A2C71] sm:text-3xl leading-tight">{phrase}</h1>
          <p className="mx-auto mt-2 max-w-xl text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
            O resíduo foi descartado e os pontos creditados na sua conta.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200/50">
                <PackageCheck className="text-[#1A2C71]" size={20} />
              </div>
              <div className="min-w-0">
                <small className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Materiais</small>
                <strong className="block truncate text-sm text-[#1A2C71]">{state?.itemCount || 1} tipo(s) · {formatQuantity(state?.totalWeight)} un.</strong>
              </div>
            </div>
            
            <div className="flex items-center gap-3 rounded-2xl bg-sky-50 p-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-200/50">
                <MapPin className="text-sky-700" size={20} />
              </div>
              <div className="min-w-0">
                <small className="block text-[10px] font-bold text-sky-700/70 uppercase tracking-wider">Destino</small>
                <strong className="block truncate text-sm text-[#1A2C71]">{state?.pointName || "Ponto parceiro"}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-200/50">
                <Sparkles className="text-emerald-700" size={20} />
              </div>
              <div className="min-w-0">
                <small className="block text-[10px] font-bold text-emerald-700/70 uppercase tracking-wider">Pontos</small>
                <strong className="block truncate text-sm text-emerald-700">+{state?.totalPoints || 0} pontos</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" variant="primary" onClick={() => navigate("/admin/sorteios", { replace: true })} className="w-full sm:w-auto py-3 bg-emerald-600 hover:bg-emerald-700">
              <Sparkles className="mr-2 h-4 w-4" /> Usar meus pontos
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/inicio", { replace: true })} className="w-full sm:w-auto py-3">
              <Home className="mr-2 h-4 w-4" /> Voltar ao início
            </Button>
          </div>

        </div>
      </main>
    </RoleShell>
    </>
  );
}
