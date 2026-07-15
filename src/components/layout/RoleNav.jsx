import React from "react";
import { NavLink } from "react-router-dom";
import { roleNavigation } from "../../constants/roleNavigation";
import { LogOut } from "lucide-react";

export default function RoleNav({ variant = "morador", mode = "desktop", className = "" }) {
  const items = roleNavigation[variant] || roleNavigation.morador;
  const mobileGridClass = items.length === 3
    ? 'grid-cols-3'
    : items.length === 4
      ? 'grid-cols-4'
      : items.length === 6
        ? 'grid-cols-6'
        : items.length === 7
          ? 'grid-cols-7'
        : 'grid-cols-5'

  if (mode === "mobile") {
    return (
      <nav
        aria-label={`Navegação ${variant}`}
        className={`fixed inset-x-0 bottom-0 z-[1200] grid border-t border-[var(--color-border)] bg-white px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-lg shadow-slate-900/10 lg:hidden ${mobileGridClass} ${className}`}
      >
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="max-w-full truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    );
  }

  if (mode === "sidebar") {
    return (
      <aside className={`hidden w-64 flex-col border-r border-[var(--color-border)] bg-white p-4 lg:flex ${className}`}>
        <div className="mb-8 flex flex-col items-center justify-center">
          <img src="/logo.jpeg" alt="Logo Residuum" className="mb-2 h-16 w-16 object-contain" />
          <h1 className="text-xl font-black text-[var(--color-primary)]">Residuum</h1>
        </div>

        <nav aria-label={`Navegação ${variant}`} className="flex flex-1 flex-col gap-2">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          <NavLink
            to="/logout"
            className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/30"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span>Sair</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  return null;
}
