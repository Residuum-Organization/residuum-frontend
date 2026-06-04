import React from "react";
import { TIME_SLOTS } from "../../constants/schedule";

export default function TimeSlots() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-base font-extrabold text-[#1e3a5f]">
          Horários de Coleta
        </span>
        <button className="text-sm font-bold text-green-500">Ver Agenda</button>
      </div>

      <div className="divide-y divide-slate-100">
        {TIME_SLOTS.map((slot) => (
          <div key={slot.id} className="flex items-center gap-4 py-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0">
              {slot.emoji}
            </div>

            <div className="flex-1">
              <div className="font-bold text-sm text-[#1e3a5f]">{slot.label}</div>
              <div className="text-xs text-slate-500">{slot.time}</div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${slot.statusBg} ${slot.statusText}`}
            >
              {slot.status}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-3.5 text-sm font-extrabold tracking-wide transition-colors">
        Agendar Coleta
      </button>
    </div>
  );
}
