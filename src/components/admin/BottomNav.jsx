import React from "react";
import { NavLink } from "react-router-dom";
import {
  CheckCircle2,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Users,
} from "lucide-react";

const adminNavItems = [
  { to: "/admin", label: "Painel", Icon: LayoutDashboard },
  { to: "/aprovacao", label: "Aprovacao", Icon: CheckCircle2 },
  { to: "/admin-pontos", label: "Pontos", Icon: MapPin },
  { to: "/usuarios", label: "Usuarios", Icon: Users },
  { to: "/campanhas", label: "Campanhas", Icon: Megaphone },
];

export default function BottomNav() {
  return (
    <nav
      className="sticky bottom-0 grid w-full grid-cols-5 gap-1 border-t border-white/10 bg-[var(--color-primary)] px-2 py-2 text-white shadow-lg shadow-slate-900/10 sm:px-4 lg:px-8"
      aria-label="Navegacao administrativa"
    >
      {adminNavItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            `flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-11 ${
              isActive
                ? "bg-white/20 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Icon className="h-5 w-5 shrink-0" strokeWidth={2.4} />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
