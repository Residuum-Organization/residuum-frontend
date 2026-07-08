import React from "react";
import { ChevronDown } from "lucide-react";

export default function LineChart({ data = [], embedded = false }) {
  const W = 520;
  const H = 200;
  const padL = 40;
  const padR = 16;
  const padT = 10;
  const padB = 40;
  const maxVal = 1500;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const chartData = data;

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

  const toX = (i) => padL + (i / Math.max(chartData.length - 1, 1)) * chartW;
  const toY = (v) => padT + chartH - (v / maxVal) * chartH;

  const points = chartData.map((d, i) => ({ x: toX(i), y: toY(d.val) }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    `M${points[0].x},${toY(0)} ` +
    points.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${points[points.length - 1].x},${toY(0)} Z`;

  const yLabels = [0, 300, 600, 900, 1200, 1500];

  return (
    <div className={embedded ? "min-w-0" : "rounded-2xl bg-white p-4 shadow-sm"}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-extrabold text-slate-800">
          Volume de Resíduos Coletados
        </span>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-xs font-bold text-green-600"
        >
          Últimos 6 meses
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-x-auto pb-1">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[420px] overflow-visible"
          role="img"
          aria-label="Volume de resíduos coletados"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yLabels.map((v) => (
            <g key={v}>
              <line
                x1={padL}
                x2={W - padR}
                y1={toY(v)}
                y2={toY(v)}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={padL - 6}
                y={toY(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="#94a3b8"
              >
                {v}
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#areaGrad)" />
          <polyline
            points={polyline}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#22c55e"
              stroke="#fff"
              strokeWidth="2"
            />
          ))}
          {chartData.map((d, i) => (
            <text
              key={i}
              x={toX(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
