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
    <nav className="grid w-full grid-cols-5 bg-[#1F4E79] px-3 py-4 text-white shadow-xl">
      {adminNavItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            `flex items-center justify-center rounded-2xl py-1 transition ${
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
