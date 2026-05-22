import React from "react";

export default function AdminStats() {
  return (
    <div className="grid grid-cols-4 gap-2 mt-5">
      <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#DDE5EE] text-center">
        <p className="text-lg">👤</p>
        <h2 className="text-[#1F4E79] text-[20px] font-bold leading-6">2.8k</h2>
        <p className="text-[#1F4E79] text-[9px] font-semibold">Usuários</p>
      </div>

      <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#DDE5EE] text-center">
        <p className="text-lg">📍</p>
        <h2 className="text-[#1F4E79] text-[20px] font-bold leading-6">12</h2>
        <p className="text-[#1F4E79] text-[9px] font-semibold">Pontos</p>
      </div>

      <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#DDE5EE] text-center">
        <p className="text-lg">♻️</p>
        <h2 className="text-[#1F4E79] text-[20px] font-bold leading-6">35t</h2>
        <p className="text-[#1F4E79] text-[9px] font-semibold">Volume</p>
      </div>

      <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#DDE5EE] text-center">
        <p className="text-lg">💰</p>
        <h2 className="text-[#1F4E79] text-[20px] font-bold leading-6">4.2k</h2>
        <p className="text-[#1F4E79] text-[9px] font-semibold">Resgate</p>
      </div>
    </div>
  );
}
