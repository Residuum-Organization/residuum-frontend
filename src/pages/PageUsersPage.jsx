import React, { useState } from "react";
import AdminShell from "../components/admin/AdminShell";

const users = [
  {
    initials: "MC",
    name: "Mariana Costa",
    email: "mariana.costa@email.com",
    status: "Ativo",
    score: 1280,
  },
  {
    initials: "FA",
    name: "Felipe Andrade",
    email: "felipe.andrade@email.com",
    status: "Ativo",
    score: 945,
  },
  {
    initials: "JM",
    name: "Juliana Mendes",
    email: "juliana.m@email.com",
    status: "Suspenso",
    score: 320,
  },
  {
    initials: "RL",
    name: "Ricardo Lima",
    email: "ricardo.l@email.com",
    status: "Ativo",
    score: 500,
  },
];

const statusMap = {
  Ativo: {
    dot: "bg-green-400",
    text: "text-green-600",
  },
  Suspenso: {
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
    <AdminShell contentClassName="px-5 py-5">
      <div className="rounded-[28px] bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center">
          <div className="mr-3 rounded-lg bg-blue-100 p-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="#2B4B6F"
                d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6Zm0 2h12v16H6V4Zm2 2v2h8V6H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z"
              />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-800">Usuários</div>
            <div className="text-xs text-gray-500">7 cadastrados</div>
          </div>
          <div className="ml-auto">
            <button className="rounded-full p-2 hover:bg-gray-100">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path
                  fill="#2B4B6F"
                  d="M12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Buscar por nome ou e-mail..."
          />
        </div>

        <div className="mb-4 flex gap-2">
          <button
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === "Todos"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500 hover:bg-blue-50"
            }`}
            onClick={() => setFilter("Todos")}
          >
            Todos
          </button>
          <button
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === "Ativos"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500 hover:bg-green-50"
            }`}
            onClick={() => setFilter("Ativos")}
          >
            Ativos
          </button>
          <button
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === "Suspensos"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-500 hover:bg-yellow-50"
            }`}
            onClick={() => setFilter("Suspensos")}
          >
            Suspensos
          </button>
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="min-w-[64px] flex flex-col items-center gap-2">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
                    style={{
                      backgroundColor:
                        user.status === "Ativo" ? "#2B4B6F" : "#334155",
                    }}
                  >
                    {user.initials}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${statusMap[user.status].dot}`}
                    ></span>
                    <span
                      className={`text-[11px] font-semibold ${statusMap[user.status].text}`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 items-start justify-between pt-1">
                  <div>
                    <div className="text-base font-semibold text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <button className="rounded-full p-1.5 hover:bg-gray-100">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" fill="#A3A3A3" />
                      <circle cx="12" cy="12" r="2" fill="#A3A3A3" />
                      <circle cx="12" cy="19" r="2" fill="#A3A3A3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-2">
                <div className="mb-1 text-[10px] font-bold tracking-wider text-gray-400">
                  PONTUAÇÃO
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        user.status === "Ativo" ? "bg-green-400" : "bg-yellow-400"
                      }`}
                      style={{ width: `${Math.min(user.score / 13, 100)}%` }}
                    ></div>
                  </div>
                  <span className="min-w-[35px] text-right text-sm font-bold text-green-700">
                    {user.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
