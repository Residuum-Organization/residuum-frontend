import React from "react";

export default function QuickActions() {
  return (
    <section className="mt-5">
      <h2 className="text-[#1F4E79] text-[16px] font-bold mb-3">
        Ações rápidas
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button className="bg-[#1F4E79] text-white rounded-2xl p-3 text-left shadow-md">
          <p className="text-xl">✅</p>

          <h3 className="font-bold text-[13px] mt-2">Aprovar pontos</h3>

          <p className="text-[10px] opacity-80">4 solicitações</p>
        </button>

        <button className="bg-white text-[#1F4E79] rounded-2xl p-3 text-left shadow-sm border border-[#DDE5EE]">
          <p className="text-xl">👥</p>

          <h3 className="font-bold text-[13px] mt-2">Usuários</h3>

          <p className="text-[10px] text-gray-500">gerenciar perfis</p>
        </button>
      </div>
    </section>
  );
}
