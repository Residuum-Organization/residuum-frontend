import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../ui/PageHeader";
import Button from "../ui/Button";

export default function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <PageHeader
      eyebrow="Painel administrativo"
      title="Dashboard"
      description="Visao geral operacional do nucleo administrativo."
      action={
        <Button
          type="button"
          variant="secondary"
          onClick={handleLogout}
          className="w-full gap-2 sm:w-auto"
          title="Sair"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </Button>
      }
    />
  );
}
