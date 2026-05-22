import React from "react";

import SectionTitle from "./SectionTitle";
import StatusBadge from "./StatusBadge";

export default function PendingPoints() {
  return (
    <section className="mt-5">
      <SectionTitle title="Pontos pendentes" buttonText="Ver todos" />

      <div className="bg-white rounded-2xl border border-[#DDE5EE] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#EEF2F6] flex justify-between items-center">
          <div>
            <h3 className="text-[#1F4E79] text-[13px] font-bold">
              Eco Ponto Centro
            </h3>
            <p className="text-gray-500 text-[10px]">
              Plástico • Metal • Papel
            </p>
          </div>

          <StatusBadge
            text="Pendente"
            bgColor="bg-[#FFF4D8]"
            textColor="text-[#A36A00]"
          />
        </div>

        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h3 className="text-[#1F4E79] text-[13px] font-bold">
              Coleta Norte
            </h3>
            <p className="text-gray-500 text-[10px]">Vidro • Alumínio</p>
          </div>

          <StatusBadge
            text="Revisar"
            bgColor="bg-[#EAF7EE]"
            textColor="text-[#2FA84F]"
          />
        </div>
      </div>
    </section>
  );
}
