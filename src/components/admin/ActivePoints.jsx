import React from "react";
import SectionTitle from "./SectionTitle";

export default function ActivePoints() {
  return (
    <section className="mt-5">
      <SectionTitle title="Pontos mais ativos" buttonText="Ver todos" />

      <div className="flex gap-3 overflow-hidden">
        <div className="w-[145px] bg-white rounded-2xl border border-[#DDE5EE] shadow-sm p-3 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#EAF7EE] flex items-center justify-center text-lg">
              🏅
            </div>

            <span className="text-[#2FA84F] text-xs font-bold">#1</span>
          </div>

          <h3 className="text-[#1F4E79] text-[13px] font-bold mt-3">
            Ponto Leste
          </h3>

          <p className="text-gray-500 text-[10px] mt-1">
            316 entregas realizadas
          </p>
        </div>

        <div className="w-[145px] bg-white rounded-2xl border border-[#DDE5EE] shadow-sm p-3 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#EAF7EE] flex items-center justify-center text-lg">
              🏅
            </div>

            <span className="text-[#2FA84F] text-xs font-bold">#2</span>
          </div>

          <h3 className="text-[#1F4E79] text-[13px] font-bold mt-3">
            Ponto Norte
          </h3>

          <p className="text-gray-500 text-[10px] mt-1">
            151 entregas realizadas
          </p>
        </div>
      </div>
    </section>
  );
}
