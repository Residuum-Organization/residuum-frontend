import React, { useState } from "react";
import Navbar from "../components/ui/Navbar";

const users = [
  {
    initials: "MC",
    name: "Mariana Costa",
    email: "mariana.costa@email.com",
    status: "Ativo",
    statusColor: "green",
    score: 1280,
  },
  {
    initials: "FA",
    name: "Felipe Andrade",
    email: "felipe.andrade@email.com",
    status: "Ativo",
    statusColor: "green",
    score: 945,
  },
  {
    initials: "JM",
    name: "Juliana Mendes",
    email: "juliana.m@email.com",
    status: "Suspenso",
    statusColor: "yellow",
    score: 320,
  },
  {
    initials: "RL",
    name: "Ricardo Lima",
    email: "ricardo.l@email.com",
    status: "Ativo",
    statusColor: "green",
    score: 500,
  },
];

const statusMap = {
  Ativo: {
    color: "green-500",
    bg: "bg-green-100",
    dot: "bg-green-400",
    text: "text-green-600",
  },
  Suspenso: {
    color: "yellow-500",
    bg: "bg-yellow-100",
    dot: "bg-yellow-400",
    text: "text-yellow-600",
  },
};

export default function PageUsers() {
  const [filter, setFilter] = useState("Todos");
  const filteredUsers =
    filter === "Todos"
      ? users
      : users.filter((u) =>
          filter === "Ativos" ? u.status === "Ativo" : u.status === "Suspenso"
        );
        
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center py-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          
          {/* Cabeçalho do Card Principal */}
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#2B4B6F" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6Zm0 2h12v16H6V4Zm2 2v2h8V6H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z"/></svg>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-800">Usuários</div>
              <div className="text-xs text-gray-500">7 cadastrados</div>
            </div>
            <div className="ml-auto">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#2B4B6F" d="M12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>
              </button>
            </div>
          </div>

          {/* Input de Busca */}
          <div className="mb-4">
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Buscar por nome ou e-mail..."
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-4">
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === "Todos"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500 hover:bg-blue-50"
              }`}
              onClick={() => setFilter("Todos")}
            >
              Todos
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === "Ativos"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500 hover:bg-green-50"
              }`}
              onClick={() => setFilter("Ativos")}
            >
              Ativos
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === "Suspensos"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-500 hover:bg-yellow-50"
              }`}
              onClick={() => setFilter("Suspensos")}
            >
              Suspensos
            </button>
          </div>

          {/* Lista de Usuários */}
          <div className="space-y-4">
            {filteredUsers.map((user, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4">
                
                {/* Parte Superior: Bloco do Avatar/Status + Bloco do Nome */}
                <div className="flex items-start gap-4">
                  
                  {/* Coluna da Esquerda: Avatar e Status embaixo */}
                  <div className="flex flex-col items-center gap-2 min-w-[64px]">
                    <div
                      className="w-12 h-12 flex items-center justify-center text-white font-bold text-lg rounded-xl shadow-sm"
                      style={{ backgroundColor: user.status === 'Ativo' ? '#2B4B6F' : '#334155' }}
                    >
                      {user.initials}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusMap[user.status].dot}`}></span>
                      <span className={`text-[11px] font-semibold ${statusMap[user.status].text}`}>{user.status}</span>
                    </div>
                  </div>

                  {/* Coluna da Direita: Nome, E-mail e o Botão de Ações */}
                  <div className="flex-1 flex justify-between items-start pt-1">
                    <div>
                      <div className="font-semibold text-gray-800 text-base">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <button className="p-1.5 rounded-full hover:bg-gray-100 custom-action-btn">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" fill="#A3A3A3"/><circle cx="12" cy="12" r="2" fill="#A3A3A3"/><circle cx="12" cy="19" r="2" fill="#A3A3A3"/></svg>
                    </button>
                  </div>
                </div>

                {/* Parte Inferior: Barra de Pontuação (Fica embaixo de tudo, respeitando a ordem) */}
                <div className="pt-2 border-t border-gray-50">
                  <div className="text-[10px] text-gray-400 font-bold tracking-wider mb-1">PONTUAÇÃO</div>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${user.status === 'Ativo' ? 'bg-green-400' : 'bg-yellow-400'}`} 
                        style={{ width: `${Math.min(user.score / 13, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-green-700 font-bold text-sm min-w-[35px] text-right">{user.score}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
} 