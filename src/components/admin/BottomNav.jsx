import React from "react";
import { NavLink } from "react-router-dom";
import { CheckCircle2, LayoutDashboard, MapPin, Megaphone, Users } from "lucide-react";

const adminNavItems = [
  { to: "/admin", label: "Painel", Icon: LayoutDashboard },
  { to: "/aprovacao", label: "Aprovação", Icon: CheckCircle2 },
  { to: "/admin-pontos", label: "Pontos", Icon: MapPin },
  { to: "/usuarios", label: "Usuários", Icon: Users },
  { to: "/campanha-heineken", label: "Campanha", Icon: Megaphone },
];

export default function BottomNav() {
  return (
    <nav className="grid w-full grid-cols-5 bg-[var(--color-primary)] px-3 py-3 text-white shadow-lg shadow-slate-900/10">
      {adminNavItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            `flex min-h-11 items-center justify-center rounded-xl transition focus-visible:ring-2 focus-visible:ring-white/70 ${
              isActive ? "bg-white/20 text-white" : "text-white/75 hover:text-white"
            }`
          }
        >
          <Icon size={27} strokeWidth={2.4} />
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
