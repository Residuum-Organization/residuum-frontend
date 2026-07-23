import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Recycle,
  Warehouse,
  TrendingUp,
  Package,
  Gift,
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

import { useQuery } from "@tanstack/react-query";
import { getUserMetrics } from "../services/users";
import { listInventory } from "../services/inventory";

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: () => getUserMetrics(),
  });

  const { data: inventoryItems = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => listInventory(),
    select: (items) =>
      items.filter(
        (item) =>
          item.status !== "cancelado" &&
          (Number(item.quantidade || 0) > 0 ||
            Number(item.quantidade_reservada || 0) > 0)
      ),
  });

  if (isLoading || isLoadingMetrics || isLoadingInventory) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]">
        <LoadingState title="Carregando painel..." className="mx-auto mt-10" />
      </RoleShell>
    );
  }

  const chartData = metricsData?.por_mes?.map((m) => ({
    name: MONTH_NAMES[m.mes - 1] || String(m.mes),
    entregas: m.kg || 0,
  })) || [];

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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2C71]">
              Bem-vindo(a), {firstName}! 👋
            </h1>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Aqui está o resumo da sua jornada sustentável de hoje.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0 mt-4 sm:mt-0">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/cadastrar-residuo")}
              className="w-full sm:w-auto font-bold"
            >
              <Recycle className="mr-2 h-5 w-5" aria-hidden="true" />
              Adicionar resíduo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/loja")}
              className="w-full sm:w-auto font-bold"
            >
              <Gift className="mr-2 h-5 w-5" aria-hidden="true" />
              Sorteios
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1A2C71]">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <Label className="text-slate-600 text-sm font-semibold">Meus pontos</Label>
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#1A2C71]">
              {currentPoints.toLocaleString("pt-BR")} <span className="text-xl text-slate-400 font-bold">pontos</span>
            </h2>
            <p className="mt-1 text-slate-500 text-sm font-medium">pontos acumulados</p>
          </Card>

          <Card className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1A2C71]">
                <Warehouse className="h-5 w-5" aria-hidden="true" />
              </div>
              <Label className="text-slate-600 text-sm font-semibold">Meus resíduos guardados</Label>
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#1A2C71]">
              {inventoryItems.length} <span className="text-xl text-slate-400 font-bold">{inventoryItems.length === 1 ? 'resíduo' : 'resíduos'}</span>
            </h2>
            <p className="mt-1 text-slate-500 text-sm font-medium">guardados no seu estoque</p>
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
                <Bar dataKey="entregas" fill="#1A2C71" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

      </div>
    </RoleShell>
  );
}
