import React from "react";
import { NavLink } from "react-router-dom";
import { roleNavigation } from "../../constants/roleNavigation";

export default function RoleNav({ variant = "morador", mode = "desktop", className = "" }) {
  const items = roleNavigation[variant] || roleNavigation.morador;
  const mobileGridClass = items.length === 3 ? 'grid-cols-3' : items.length === 4 ? 'grid-cols-4' : 'grid-cols-5'

  if (mode === "mobile") {
    return (
      <nav
        aria-label={`Navegação ${variant}`}
        className={`fixed inset-x-0 bottom-0 z-[1200] grid border-t border-[var(--color-border)] bg-white px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-lg shadow-slate-900/10 lg:inset-x-6 lg:bottom-6 lg:mx-auto lg:max-w-5xl lg:rounded-2xl lg:border ${mobileGridClass} ${className}`}
      >
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
          className={({ isActive }) =>
              `flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 lg:min-h-14 lg:flex-row lg:gap-2 lg:px-3 lg:text-sm ${
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

  return (
    <nav
      aria-label={`Navegação ${variant}`}
      className={`hidden flex-wrap gap-2 lg:flex ${className}`}
    >
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `inline-flex min-h-11 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
              isActive
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] bg-white text-[var(--color-primary)] hover:border-[var(--color-primary)]/35 hover:bg-[var(--color-surface)]"
            }`
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
