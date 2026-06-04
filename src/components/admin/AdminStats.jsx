import React from "react";

export default function AdminStats() {
  return (
    <div className="mt-5 grid grid-cols-4 gap-3">
      <div className="rounded-2xl border border-[#DDE5EE] bg-white p-3 text-center shadow-sm">
        <p className="text-xl">👤</p>
        <h2 className="text-[21px] font-bold leading-6 text-[#1F4E79]">2.8k</h2>
        <p className="mt-1 text-[11px] font-semibold text-[#1F4E79]">Usuários</p>
      </div>

      <div className="rounded-2xl border border-[#DDE5EE] bg-white p-3 text-center shadow-sm">
        <p className="text-xl">📍</p>
        <h2 className="text-[21px] font-bold leading-6 text-[#1F4E79]">12</h2>
        <p className="mt-1 text-[11px] font-semibold text-[#1F4E79]">Pontos</p>
      </div>

      <div className="rounded-2xl border border-[#DDE5EE] bg-white p-3 text-center shadow-sm">
        <p className="text-xl">♻️</p>
        <h2 className="text-[21px] font-bold leading-6 text-[#1F4E79]">35t</h2>
        <p className="mt-1 text-[11px] font-semibold text-[#1F4E79]">Volume</p>
      </div>

      <div className="rounded-2xl border border-[#DDE5EE] bg-white p-3 text-center shadow-sm">
        <p className="text-xl">💰</p>
        <h2 className="text-[21px] font-bold leading-6 text-[#1F4E79]">4.2k</h2>
        <p className="mt-1 text-[11px] font-semibold text-[#1F4E79]">Resgate</p>
      </div>
    </div>
  );
}
