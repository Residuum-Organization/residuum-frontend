import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <section className="mt-5">
      <h2 className="mb-3 text-lg font-bold text-[#1F4E79]">Ações rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="rounded-2xl bg-[#1F4E79] p-4 text-left text-white shadow-md"
          onClick={() => navigate("/admin-pontos")}
        >
          <p className="text-2xl">✅</p>
          <h3 className="mt-3 text-[15px] font-bold">Gestão de pontos</h3>
          <p className="mt-1 text-xs opacity-80">painel de coleta</p>
        </button>
        <button
          className="rounded-2xl border border-[#DDE5EE] bg-white p-4 text-left text-[#1F4E79] shadow-sm"
          onClick={() => navigate("/usuarios")}
        >
          <p className="text-2xl">👥</p>
          <h3 className="mt-3 text-[15px] font-bold">Usuários</h3>
          <p className="mt-1 text-xs text-gray-500">gerenciar perfis</p>
        </button>
      </div>
    </section>
  );
}
