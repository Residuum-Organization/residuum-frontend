import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

      <div className="flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-red-50"
          title="Sair"
        >
          <LogOut size={22} className="text-red-500" />
        </button>
      </div>
    </header>
  );
}
