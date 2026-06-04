import React from "react";

import SectionTitle from "./SectionTitle";
import StatusBadge from "./StatusBadge";

export default function PendingPoints() {
  return (
    <section className="mt-5">
      <SectionTitle title="Pontos pendentes" buttonText="Ver todos" />

      <div className="overflow-hidden rounded-2xl border border-[#DDE5EE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EEF2F6] px-4 py-4">
          <div>
            <h3 className="text-[17px] font-bold text-[#1F4E79]">
              Eco Ponto Centro
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Plástico • Metal • Papel
            </p>
          </div>

          <StatusBadge
            text="Pendente"
            bgColor="bg-[#FFF4D8]"
            textColor="text-[#A36A00]"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h3 className="text-[17px] font-bold text-[#1F4E79]">
              Coleta Norte
            </h3>
            <p className="mt-1 text-xs text-gray-500">Vidro • Alumínio</p>
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
