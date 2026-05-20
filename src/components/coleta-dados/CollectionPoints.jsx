import React from "react";
import { MapPin } from "lucide-react";
import { COLLECTION_POINTS } from "../../constants/schedule";

function CapacityBar({ pct, barColor }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-600 w-9 text-right">{pct}%</span>
    </div>
  );
}

export default function CollectionPoints() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-base font-extrabold text-[#1e3a5f]">
          Disponibilidade dos pontos
        </span>
        <button className="text-sm font-bold text-green-500">Ver mapa</button>
      </div>

      <div className="space-y-4">
        {COLLECTION_POINTS.map((pt) => (
          <div key={pt.id} className="flex items-start gap-2.5">
            <MapPin size={18} className="text-[#1e3a5f] mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-sm text-[#1e3a5f]">{pt.name}</div>
              <div className="text-xs text-slate-500 mb-1.5">{pt.address}</div>
              {pt.pct !== null ? (
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-1">Capacidade</div>
                  <CapacityBar pct={pt.pct} barColor={pt.barColor} />
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-1">Indisponível</div>
                  <div className="h-2 bg-slate-200 rounded-full" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
