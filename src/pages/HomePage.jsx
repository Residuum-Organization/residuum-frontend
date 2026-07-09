import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Recycle,
  Warehouse,
  TrendingUp,
  Package,
} from "lucide-react";
import RoleShell from "../components/layout/RoleShell";
import SectionCard from "../components/ui/SectionCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Label from "../components/ui/Label";
import { useProfile } from "../hooks/useProfile";
import LoadingState from "../components/ui/LoadingState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data para o gráfico, até integrarmos isso com a API real futuramente
const chartData = [
  { name: "Jan", entregas: 4 },
  { name: "Fev", entregas: 3 },
  { name: "Mar", entregas: 2 },
  { name: "Abr", entregas: 6 },
  { name: "Mai", entregas: 8 },
  { name: "Jun", entregas: 5 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]">
        <LoadingState title="Carregando painel..." className="mx-auto mt-10" />
      </RoleShell>
    );
  }

  const userName = profile?.nome || profile?.usuario?.nome || "Usuário";
  const firstName = userName.split(" ")[0];
  const currentPoints = Number(profile?.pontuacao_total || 0);
  const totalInventoryKg = Number(profile?.resumo?.quantidade_total_inventario || 0);
  const pendingDiscards = Number(profile?.resumo?.total_descartes_pendentes || 0);

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-6">
        
        {/* Welcome Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 shadow-sm border border-[var(--color-border)]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79]">
              Bem-vindo(a), {firstName}! 👋
            </h1>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Aqui está o resumo da sua jornada sustentável de hoje.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0 mt-4 sm:mt-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/mapa")}
              className="w-full sm:w-auto font-bold border-2"
            >
              <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
              Ver mapa
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/cadastrar-residuo")}
              className="w-full sm:w-auto font-bold"
            >
              <Recycle className="mr-2 h-5 w-5" aria-hidden="true" />
              Reciclar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1F4E79]">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <Label className="text-slate-600 text-sm font-semibold">Pontuação Total</Label>
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#1F4E79]">
              {currentPoints.toLocaleString("pt-BR")}
            </h2>
            <p className="mt-1 text-slate-500 text-sm font-medium">pts acumulados</p>
          </Card>

          <Card className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1F4E79]">
                <Warehouse className="h-5 w-5" aria-hidden="true" />
              </div>
              <Label className="text-slate-600 text-sm font-semibold">Volume no Estoque</Label>
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#1F4E79]">
              {totalInventoryKg.toLocaleString("pt-BR")} <span className="text-xl text-slate-400 font-bold">kg</span>
            </h2>
            <p className="mt-1 text-slate-500 text-sm font-medium">esperando descarte</p>
          </Card>

          <Card className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1F4E79]">
                <Package className="h-5 w-5" aria-hidden="true" />
              </div>
              <Label className="text-slate-600 text-sm font-semibold">Entregas Pendentes</Label>
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#1F4E79]">
              {pendingDiscards}
            </h2>
            <p className="mt-1 text-slate-500 text-sm font-medium">aguardando validação</p>
          </Card>
        </div>

        {/* Chart Area */}
        <SectionCard title="Suas entregas este ano" description="Acompanhe a frequência que você utiliza os pontos de coleta mês a mês.">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 14 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 14 }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="entregas" fill="#1F4E79" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

      </div>
    </RoleShell>
  );
}
