import React from "react";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Recycle, ShoppingBag, User } from "lucide-react";

const items = [
  { to: "/inicio", label: "Inicio", Icon: Home },
  { to: "/mapa", label: "Mapa", Icon: MapPin },
  { to: "/meu-estoque", label: "Estoque", Icon: Recycle },
  { to: "/loja", label: "Loja", Icon: ShoppingBag },
  { to: "/perfil", label: "Perfil", Icon: User },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="Navegacao inferior do morador"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[var(--color-border)] bg-white px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-lg shadow-slate-900/10 md:hidden"
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
