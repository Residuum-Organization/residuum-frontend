import React from "react";
import { Bell, Database, Server, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { SYSTEM_SERVICES } from "../../constants/schedule";
import SectionCard from "../ui/SectionCard";
import InlineAlert from "../ui/InlineAlert";

const ICON_MAP = { Server, Truck, Smartphone, Database, Bell };

export default function SystemStatus() {
  return (
    <SectionCard
      title="Status do sistema e serviços"
      description="Leitura demonstrativa dos serviços exibidos na agenda."
      action={
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          Demo
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-2">
        {SYSTEM_SERVICES.map((s) => {
          const Icon = ICON_MAP[s.icon];
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center"
            >
              <div className="mb-2 flex justify-center">
                {Icon && <Icon size={24} className="text-green-600" aria-hidden="true" />}
              </div>
              <div className="text-xs font-semibold leading-tight text-slate-600">
                {s.label}
              </div>
              <div className="mt-1 text-xs font-black text-green-600">ONLINE</div>
            </div>
          );
        })}
      </div>

    </SectionCard>
  );
}
