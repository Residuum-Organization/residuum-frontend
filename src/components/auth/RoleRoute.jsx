import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { canAccessRole } from "../../utils/roles";
import LoadingState from "../ui/LoadingState";

export default function RoleRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-surface)] px-4">
        <LoadingState title="Verificando permissoes..." size="md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!canAccessRole(user?.role, allowedRoles)) {
    return (
      <Navigate
        to="/acesso-negado"
        replace
        state={{ from: location, allowedRoles }}
      />
    );
  }

  return children;
}
