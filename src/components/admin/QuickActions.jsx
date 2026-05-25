import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <section className="mt-5">
      <h2 className="text-[#1F4E79] text-[16px] font-bold mb-3">Ações rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="bg-[#1F4E79] text-white rounded-2xl p-3 text-left shadow-md"
          onClick={() => navigate("/admin-pontos")}
        >
          <p className="text-xl">✅</p>
          <h3 className="font-bold text-[13px] mt-2">Gestão de pontos</h3>
          <p className="text-[10px] opacity-80">painel de coleta</p>
        </button>
        <button
          className="bg-white text-[#1F4E79] rounded-2xl p-3 text-left shadow-sm border border-[#DDE5EE]"
          onClick={() => navigate("/usuarios")}
        >
          <p className="text-xl">👥</p>
          <h3 className="font-bold text-[13px] mt-2">Usuários</h3>
          <p className="text-[10px] text-gray-500">gerenciar perfis</p>
        </button>
      </div>
    </section>
  );
}
