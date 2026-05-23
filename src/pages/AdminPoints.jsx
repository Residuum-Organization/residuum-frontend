import React from "react";
import Navbar from "../components/ui/Navbar";

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
    link: true,
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
    dot: "bg-green-600",
    bar: "bg-green-600",
    text: "text-green-700",
  },
  orange: {
    dot: "bg-orange-400",
    bar: "bg-orange-400",
    text: "text-orange-600",
  },
  red: {
    dot: "bg-red-600",
    bar: "bg-red-600",
    text: "text-red-700",
  },
};

export default function AdminPoints() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen flex flex-col items-center py-6">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-2">
            <img src="/assets/icons/logo.svg" alt="logo" className="h-8" />
          </div>
          <div className="text-blue-900 font-semibold text-sm mb-1">Painel Geral</div>
          <div className="text-2xl font-bold text-blue-800 mb-4">Pontos de coleta</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">70%</span>
              <span className="text-xs text-green-700 font-medium">Média geral de preenchimento</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#2B4B6F" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              <span className="text-xs text-blue-900 font-medium">3 de 4 Pontos ativos</span>
            </div>
            <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
              <span className="text-red-600 text-lg">⚠️</span>
              <span className="text-xs text-red-700 font-medium">1 ponto crítico</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-orange-500 text-lg">⚠️</span>
              <span className="text-xs text-orange-700 font-medium">1 ponto requer atenção</span>
            </div>
          </div>
          <div className="border-2 border-blue-200 rounded-xl p-4">
            {points.map((point, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full ${colorMap[point.color].dot}`}></span>
                  <span className={`font-semibold ${colorMap[point.color].text}`}>{point.name}</span>
                  {point.link && (
                    <a href="#" className="underline text-xs text-blue-800 ml-2">{point.address}</a>
                  )}
                  {!point.link && (
                    <span className="text-xs text-gray-600 ml-2">{point.address}</span>
                  )}
                  <span className={`ml-auto font-bold ${colorMap[point.color].text}`}>{point.percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className={`h-2 rounded-full ${colorMap[point.color].bar}`} style={{width: `${point.percent}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
