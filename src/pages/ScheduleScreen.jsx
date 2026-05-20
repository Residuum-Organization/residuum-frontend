import React from "react";
import { Truck } from "lucide-react";
import TimeSlots from "../components/coleta-dados/TimeSlots";
import CollectionPoints from "../components/coleta-dados/CollectionPoints";
import SystemStatus from "../components/coleta-dados/SystemStatus";

export default function ScheduleScreen() {
  return (
    <div className="flex flex-col gap-3">
      <TimeSlots />
      <CollectionPoints />
      <SystemStatus />

      {/* FAB */}
      <div className="fixed bottom-20 right-5 z-10">
        <button className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex flex-col items-center justify-center shadow-lg shadow-green-300 transition-colors">
          <Truck size={24} className="text-white" />
          <span className="text-white text-[8px] font-black leading-tight text-center mt-0.5">
            NOVA{"\n"}COLETA
          </span>
        </button>
      </div>
    </div>
  );
}
