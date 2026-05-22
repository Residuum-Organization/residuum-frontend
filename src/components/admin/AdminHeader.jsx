import React from "react";

export default function AdminHeader() {
  return (
    <header className="flex justify-between items-center">
      <div>
        <p className="text-[#1F4E79] text-[12px] font-semibold opacity-80">
          Painel Administrativo
        </p>

        <h1 className="text-[#1F4E79] text-[24px] font-bold leading-7 mt-1">
          Dashboard
        </h1>

        <p className="text-gray-500 text-[11px] mt-1">Visão geral do sistema</p>
      </div>

      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Residuum"
          className="w-10 object-contain"
        />
      </div>
    </header>
  );
}
