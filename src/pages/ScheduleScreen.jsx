import React from "react";
import { Truck } from "lucide-react";
import TimeSlots from "../components/coleta-dados/TimeSlots";
import CollectionPoints from "../components/coleta-dados/CollectionPoints";
import SystemStatus from "../components/coleta-dados/SystemStatus";
import Navbar from "../components/ui/Navbar";

export default function ScheduleScreen() {
  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#f7faf9] shadow-2xl">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-24">
          <TimeSlots />
          <CollectionPoints />
          <SystemStatus />
        </div>

        <div className="fixed bottom-24 left-1/2 z-[1000] ml-[132px] -translate-x-1/2">
          <button className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-300 transition-colors hover:bg-green-600">
            <Truck size={24} className="text-white" />
            <span className="mt-0.5 text-center text-[8px] font-black leading-tight text-white">
              NOVA{"\n"}COLETA
            </span>
          </button>
        </div>
        <Navbar />
      </section>
    </main>
  );
}
