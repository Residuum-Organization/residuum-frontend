import React, { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatKg = (value) =>
  `${Number(value || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} kg`;

export default function LineChart({ data = [], embedded = false }) {
  const gradientId = `collection-area-${useId().replace(/:/g, "")}`;
  const chartData = data.map((item) => ({
    ...item,
    val: Number(item.val || 0),
  }));

  if (!chartData.length) {
    return (
      <div
        className={
          embedded
            ? "rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center text-sm font-semibold text-[var(--color-text-muted)]"
            : "rounded-2xl bg-white p-4 text-center text-sm font-semibold text-[var(--color-text-muted)] shadow-sm"
        }
      >
        Sem série histórica disponível.
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
      <div
        className="mt-4 h-[300px] w-full"
        role="img"
        aria-label="Evolução mensal do volume de resíduos coletados"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A2C71" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#1A2C71" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 14 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 14 }}
              tickFormatter={(value) =>
                Number(value).toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })
              }
              width={58}
              allowDecimals={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value) => [formatKg(value), "Volume coletado"]}
              labelFormatter={(label) => `Mês: ${label}`}
              cursor={{
                stroke: "#CBD5E1",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "#64748B", fontWeight: 600 }}
              itemStyle={{ color: "#1A2C71", fontWeight: 700 }}
            />
            <Area
              type="monotone"
              dataKey="val"
              name="Volume coletado"
              stroke="#1A2C71"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{
                r: 4,
                fill: "#FFFFFF",
                stroke: "#1A2C71",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#1A2C71",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
