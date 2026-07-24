import React from "react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CHART_COLORS = [
  "#1A2C71",
  "#2EA44F",
  "#D99A2B",
  "#4D67B1",
  "#4CA6A8",
  "#7A869A",
];

const formatKg = (value) =>
  `${Number(value || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} kg`;

export default function PieChart({ data = [], embedded = false }) {
  const sourceData = data
    .map((item) => ({ ...item, val: Number(item.val || 0) }))
    .filter((item) => item.val > 0);
  const total = sourceData.reduce((sum, item) => sum + item.val, 0);
  const materialData = sourceData.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
    pct: total ? (item.val / total) * 100 : 0,
  }));

  if (!materialData.length) {
    return (
      <div
        className={
          embedded
            ? "rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center text-sm font-semibold text-[var(--color-text-muted)]"
            : "rounded-2xl bg-white p-4 text-center text-sm font-semibold text-[var(--color-text-muted)] shadow-sm"
        }
      >
        Sem distribuição por material disponível.
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "min-w-0"
          : "rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
      }
    >
      <div className="mt-4 flex flex-col items-center gap-5">
        <div
          className="relative h-[210px] w-full max-w-[260px]"
          role="img"
          aria-label="Distribuição do inventário por tipo de material"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={materialData}
                dataKey="val"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={84}
                paddingAngle={2}
                stroke="#FFFFFF"
                strokeWidth={3}
                animationDuration={700}
              >
                {materialData.map((item) => (
                  <Cell key={item.label} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [formatKg(value), name]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#1A2C71", fontWeight: 700 }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-xl font-black text-[#1A2C71]">
              {formatKg(total)}
            </strong>
            <span className="mt-1 text-xs font-medium text-slate-500">
              total em estoque
            </span>
          </div>
        </div>

        <div className="w-full space-y-2.5">
          {materialData.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 truncate text-sm text-slate-700">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {item.pct.toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })}
                %
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
