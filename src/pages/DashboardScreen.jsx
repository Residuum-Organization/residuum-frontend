import React from "react";
import { STAT_CARDS } from "../constants/dashboard";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import PieChart from "../components/dashboard/PieChart";
import Navbar from "../components/ui/Navbar";

export default function DashboardScreen() {
  const row1 = STAT_CARDS.slice(0, 2);
  const row2 = STAT_CARDS.slice(2, 4);

  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#f7faf9] shadow-2xl">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-24">
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

          <LineChart />
          <PieChart />
        </div>

        <Navbar />
      </section>
    </main>
  );
}
