import React from "react";
import { ChevronDown } from "lucide-react";

function PieSlices({ data }) {
  let cumulative = 0;
  const cx = 80;
  const cy = 80;
  const r = 70;

  function polarToCartesian(angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const slices = data.map((d) => {
    const startAngle = cumulative * 3.6;
    const endAngle = (cumulative + d.pct) * 3.6;
    const midAngle = (startAngle + endAngle) / 2;
    cumulative += d.pct;

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const large = d.pct > 50 ? 1 : 0;
    const mid = polarToCartesian(midAngle);

    return {
      ...d,
      path: `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${large},1 ${end.x},${end.y} Z`,
      mid,
    };
  });

  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      className="shrink-0"
      role="img"
      aria-label="Distribuição por tipo de material"
    >
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />
      ))}
      {slices.map((s, i) => (
        <text
          key={i}
          x={s.mid.x}
          y={s.mid.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="700"
        >
          {s.pct}%
        </text>
      ))}
    </svg>
  );
}

export default function PieChart({ data = [], embedded = false }) {
  const materialData = data;

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
    <div className={embedded ? "min-w-0" : "rounded-2xl bg-white p-4 shadow-sm"}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-extrabold text-slate-800">
          Estatística por tipo de material
        </span>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500"
        >
          Este mês
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <PieSlices data={materialData} />

        <div className="w-full min-w-0 flex-1 space-y-2">
          {materialData.map((item) => (
            <div key={item.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
              <span className="min-w-0 truncate text-sm text-slate-700">
                {item.label}
              </span>
              <span className="text-sm text-slate-500">{item.kg}</span>
              <span className="w-10 text-right text-sm text-slate-500">
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
