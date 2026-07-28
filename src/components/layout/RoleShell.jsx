import React from "react";
import RoleNav from "./RoleNav";
import { useAuth } from "../../contexts/AuthContext";

export default function RoleShell({
  variant,
  children,
  shellClassName = "bg-[var(--color-surface)]",
  contentClassName = "px-4 py-4 sm:px-6 sm:py-6 lg:px-8",
}) {
  const { user } = useAuth();
  const activeVariant = (user?.role === "ponto_coleta" ? "ponto_coleta" : user?.role === "cooperativa" ? "cooperativa" : variant) || user?.role || "morador";

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-0 py-0 sm:px-5 sm:py-5 lg:p-0">
      <section
        className={`mx-auto flex min-h-screen w-full flex-col overflow-hidden shadow-sm sm:min-h-[760px] sm:max-w-7xl sm:rounded-2xl lg:max-w-none lg:h-screen lg:max-h-screen lg:rounded-none lg:flex-row ${shellClassName}`}
      >
        <RoleNav variant={activeVariant} mode="sidebar" />

        <div className={`flex-1 overflow-y-auto pb-28 lg:pb-8 ${contentClassName}`}>{children}</div>

        <RoleNav variant={activeVariant} mode="mobile" />
      </section>
    </main>
  );
}
