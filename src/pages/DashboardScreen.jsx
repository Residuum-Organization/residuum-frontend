import React from "react";
import { STAT_CARDS } from "../constants/dashboard";
import StatCard from "../components/dashboard/StatCard";
import LineChart from "../components/dashboard/LineChart";
import PieChart from "../components/dashboard/PieChart";

export default function DashboardScreen() {
  const row1 = STAT_CARDS.slice(0, 2);
  const row2 = STAT_CARDS.slice(2, 4);

  return (
    <div className="flex flex-col gap-3">
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
  );
}
