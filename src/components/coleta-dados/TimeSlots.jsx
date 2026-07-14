import React from "react";
import { Clock3 } from "lucide-react";
import { TIME_SLOTS } from "../../constants/schedule";
import SectionCard from "../ui/SectionCard";

export default function TimeSlots() {
  return (
    <SectionCard
      title="Horários de coleta"
      description="Janelas operacionais exibidas para planejamento."
    >
      <div className="divide-y divide-slate-100">
        {TIME_SLOTS.map((slot) => (
          <div
            key={slot.id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-[var(--color-primary)]">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="font-bold text-[#1e3a5f]">{slot.label}</div>
              <div className="text-sm font-medium text-slate-500">{slot.time}</div>
            </div>

            <span
              className={`col-start-2 w-fit rounded-full px-3 py-1 text-xs font-bold sm:col-start-auto ${slot.statusBg} ${slot.statusText}`}
            >
              {slot.status}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
