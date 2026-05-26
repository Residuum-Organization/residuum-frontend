import React from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";

const points = [
  {
    name: "Ponto Oeste",
    address: "Rua Oeste, 101 - bairro",
    percent: 72,
    color: "green",
  },
  {
    name: "Ponto Sul",
    address: "Rua Sul, 789 - bairro",
    percent: 45,
    color: "green",
  },
  {
    name: "Ponto Norte",
    address: "Rua Norte, 456 - bairro",
    percent: 88,
    color: "orange",
  },
  {
    name: "Ponto Leste",
    address: "Av. Leste, 123 - bairro",
    percent: 100,
    color: "red",
  },
];

const colorMap = {
  green: {
    dot: "bg-green-700",
    bar: "bg-green-700",
    text: "text-green-700",
  },
  orange: {
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    text: "text-orange-500",
  },
  red: {
    dot: "bg-red-500",
    bar: "bg-red-500",
    text: "text-red-500",
  },
};

export default function AdminPoints() {
  return (
    <AdminShell contentClassName="px-5 py-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2B248C]">Painel Geral</p>

          <h1 className="mt-1 text-[36px] font-bold leading-none text-[#2B248C]">
            Pontos de coleta
          </h1>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Logo Residuum"
            className="w-10 object-contain"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#A7C7AE] bg-[#E5F5E8] px-3 py-2">
          <span className="rounded-full bg-green-500 px-2 py-[2px] text-[10px] font-bold text-white">
            70%
          </span>

          <span className="text-[13px] font-medium leading-tight text-[#1E1E1E]">
            Média geral
            <br />
            de preenchimento
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#9A87E8] bg-white px-4 py-2">
          <MapPin size={16} className="text-green-700" />

          <span className="text-[13px] font-semibold leading-tight">
            3 de 4
            <br />
            Pontos ativos
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-[#FF3A3A] px-4 py-2 text-sm font-semibold text-white">
          <AlertTriangle size={16} fill="yellow" color="yellow" />
          1 ponto crítico
        </div>

        <div className="flex items-center gap-2 rounded-full bg-[#F5D4A4] px-4 py-2 text-sm text-black">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            !
          </div>

          1 ponto requer atenção
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border-2 border-[#8B7AE6] bg-white">
        {points.map((point, idx) => (
          <div
            key={idx}
            className={`px-6 py-6 ${
              idx !== points.length - 1 ? "border-b border-[#8B7AE6]" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${colorMap[point.color].dot}`}
                  />

                  <h2 className="text-[20px] font-bold text-[#27466B]">
                    {point.name}
                  </h2>
                </div>

                <p className="ml-5 mt-1 text-[15px] text-black">
                  {point.address}
                </p>

                <div className="ml-5 mt-4 h-[7px] w-[155px] rounded-full bg-[#D9D9D9]">
                  <div
                    className={`h-[7px] rounded-full ${colorMap[point.color].bar}`}
                    style={{ width: `${point.percent}%` }}
                  />
                </div>
              </div>

              <span
                className={`text-[34px] font-bold ${colorMap[point.color].text}`}
              >
                {point.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
