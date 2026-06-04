import React from "react";
import { Server, Truck, Smartphone, Database, Bell, ShieldCheck } from "lucide-react";
import { SYSTEM_SERVICES } from "../../constants/schedule";

const ICON_MAP = { Server, Truck, Smartphone, Database, Bell };

export default function SystemStatus() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="text-base font-extrabold text-[#1e3a5f] mb-4">
        Status do Sistema e Serviços
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {SYSTEM_SERVICES.map((s) => {
          const Icon = ICON_MAP[s.icon];
          return (
            <div
              key={s.id}
              className="flex-1 min-w-[60px] bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center"
            >
              <div className="flex justify-center mb-1">
                {Icon && <Icon size={26} className="text-green-500" />}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold leading-tight mb-1">
                {s.label}
              </div>
              <div className="text-[10px] font-black text-green-500">ONLINE</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 bg-green-50 rounded-xl px-3 py-2.5">
        <ShieldCheck size={20} className="text-green-600 shrink-0" />
        <span className="text-xs font-semibold text-green-700">
          Todos os sistemas estão funcionando normalmente
        </span>
      </div>
    </div>
  );
}
