import React from "react";

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#1F4E79] opacity-80">
          Painel Administrativo
        </p>

        <h1 className="mt-1 text-[34px] font-bold leading-none text-[#1F4E79]">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">Visão geral do sistema</p>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.lMsrniFpgibNNL_T3pNjqwHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Residuum"
          className="w-10 object-contain"
        />
      </div>
    </header>
  );
}
