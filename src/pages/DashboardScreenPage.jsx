import React from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import PieChart from "../components/dashboard/PieChart";
import { getCollectionPointDashboard } from "../services/collectionPointDashboard";
import { queryKeys } from "../services/queryKeys";

export default function DashboardScreen() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.collectionPointDashboard,
    queryFn: getCollectionPointDashboard,
  });

  const statCards = data?.statCards || [];
  const row1 = statCards.slice(0, 2);
  const row2 = statCards.slice(2, 4);

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#f7faf9] shadow-2xl">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {isLoading ? <p className="text-sm text-slate-500">Carregando painel do ponto...</p> : null}

          <div className="flex gap-3">
            {row1.map((card) => (
              <StatCard key={card.id} {...card} />
            ))}
          </div>

          <div className="flex gap-3">
            {row2.map((card) => (
              <StatCard key={card.id} {...card} />
            ))}
          </div>

          <LineChart data={data?.chartData} />
          <PieChart data={data?.materialData} />
        </div>
      </section>
    </main>
  );
}
