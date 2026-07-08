import React from "react";
import { LogOut, ShieldAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import SectionCard from "../components/ui/SectionCard";
import Button from "../components/ui/Button";
import { getRoleHome, getRoleLabel } from "../utils/roles";

export default function AcessoNegadoPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const allowedRoles = location.state?.allowedRoles || [];
  const currentRoleLabel = getRoleLabel(user?.role);
  const requiredRoleLabel = [...new Set(allowedRoles.map(getRoleLabel))].join(" ou ");

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <PageContainer className="bg-[var(--color-surface)]" innerClassName="flex min-h-screen items-center justify-center">
      <SectionCard className="w-full max-w-xl" title="Acesso negado">
        <div className="space-y-5 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-700">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </div>

          <div>
            <p className="text-base font-semibold text-[var(--color-text)]">
              {requiredRoleLabel
                ? `Voce esta logado como ${currentRoleLabel}, mas esta area e restrita a: ${requiredRoleLabel}.`
                : "Seu perfil nao tem permissao para acessar esta area."}
            </p>
            {allowedRoles.length ? (
              <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
                Perfil necessario: {requiredRoleLabel}.
              </p>
            ) : null}
            <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
              Perfil atual: {currentRoleLabel}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={() => navigate(getRoleHome(user?.role), { replace: true })}>
              Voltar ao meu inicio
            </Button>
            <Button type="button" variant="danger" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </Button>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
