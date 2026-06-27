import React from "react";
import { ChevronDown } from "lucide-react";
import { MATERIAL_DATA } from "../../constants/dashboard";

function PieSlices({ data }) {
  let cumulative = 0;
  const cx = 80, cy = 80, r = 70;

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
    <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />
      ))}
      {slices.map((s, i) => (
        <text
          key={i}
          x={s.mid.x} y={s.mid.y}
          textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize="11" fontWeight="700"
        >
          {s.pct}%
        </text>
      ))}
    </svg>
  );
}

export default function PieChart({ data = MATERIAL_DATA }) {
  const materialData = data.length ? data : MATERIAL_DATA;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-extrabold text-slate-800">
          Estatística por tipo de material
        </span>
        <button className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          Este mês
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <PieSlices data={materialData} />

        <div className="flex-1 space-y-2">
          {materialData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span className="flex-1 text-sm text-slate-700">{item.label}</span>
              <span className="text-sm text-slate-400 w-14">{item.kg}</span>
              <span className="text-sm text-slate-400 w-9 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
