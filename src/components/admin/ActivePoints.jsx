import React from "react";
import SectionTitle from "./SectionTitle";

export default function ActivePoints() {
  return (
    <section className="mt-5">
      <SectionTitle title="Pontos mais ativos" buttonText="Ver todos" />

      <div className="flex gap-3 overflow-hidden">
        <div className="w-[145px] flex-shrink-0 rounded-2xl border border-[#DDE5EE] bg-white p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF7EE] text-xl">
              🏅
            </div>

            <span className="text-sm font-bold text-[#2FA84F]">#1</span>
          </div>

          <h3 className="mt-4 text-[17px] font-bold text-[#1F4E79]">
            Ponto Leste
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            316 entregas realizadas
          </p>
        </div>

        <div className="w-[145px] flex-shrink-0 rounded-2xl border border-[#DDE5EE] bg-white p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF7EE] text-xl">
              🏅
            </div>

            <span className="text-sm font-bold text-[#2FA84F]">#2</span>
          </div>

          <h3 className="mt-4 text-[17px] font-bold text-[#1F4E79]">
            Ponto Norte
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            151 entregas realizadas
          </p>
        </div>
      </div>
    </section>
  );
}
