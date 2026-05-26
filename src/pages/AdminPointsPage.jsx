import React from "react";
import BottomNav from "../components/admin/BottomNav";
import {
  MapPin,
  AlertTriangle,
} from "lucide-react";

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
    <>
      <div className="min-h-screen bg-[#ECECEC] flex justify-center px-4 py-6 pb-28">
      <div className="w-full max-w-[350px] bg-white rounded-[32px] p-5 shadow-sm">
        <div className="w-full max-w-[350px]">

          {/* TOPO */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-[#2B248C] font-semibold text-sm">
                Painel Geral
              </p>

              <h1 className="text-[36px] leading-none font-bold text-[#2B248C] mt-1">
                Pontos de coleta
              </h1>
            </div>

            <img
              src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
              className="w-20 object-contain"
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-wrap gap-3 mb-6">

            <div className="flex items-center gap-2 bg-[#E5F5E8] border border-[#A7C7AE] rounded-full px-3 py-2">
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-[2px] rounded-full">
                70%
              </span>

              <span className="text-[13px] font-medium text-[#1E1E1E] leading-tight">
                Média geral
                <br />
                de preenchimento
              </span>
            </div>

            <div className="flex items-center gap-2 border border-[#9A87E8] rounded-full px-4 py-2 bg-white">
              <MapPin size={16} className="text-green-700" />

              <span className="text-[13px] font-semibold leading-tight">
                3 de 4
                <br />
                Pontos ativos
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#FF3A3A] rounded-full px-4 py-2 text-white font-semibold text-sm">
              <AlertTriangle size={16} fill="yellow" color="yellow" />
              1 ponto crítico
            </div>

            <div className="flex items-center gap-2 bg-[#F5D4A4] rounded-full px-4 py-2 text-black text-sm">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                !
              </div>

              1 ponto requer atenção
            </div>
          </div>

          {/* CARD */}
          <div className="border-2 border-[#8B7AE6] rounded-[28px] overflow-hidden bg-white">

            {points.map((point, idx) => (
              <div
                key={idx}
                className={`
                  px-6 py-6
                  ${idx !== points.length - 1
                    ? "border-b border-[#8B7AE6]"
                    : ""
                  }
                `}
              >
                <div className="flex items-start justify-between">

                  <div className="flex-1">

                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${colorMap[point.color].dot}`}
                      />

                      <h2 className="text-[20px] font-bold text-[#27466B]">
                        {point.name}
                      </h2>
                    </div>

                    <p className="text-black text-[15px] mt-1 ml-5">
                      {point.address}
                    </p>

                    <div className="w-[155px] h-[7px] bg-[#D9D9D9] rounded-full mt-4 ml-5">
                      <div
                        className={`h-[7px] rounded-full ${colorMap[point.color].bar}`}
                        style={{ width: `${point.percent}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`font-bold text-[34px] ${colorMap[point.color].text}`}
                  >
                    {point.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      </div>
      <BottomNav />
    </>
  );
}
