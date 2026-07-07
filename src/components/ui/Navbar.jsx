import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, QrCode, Recycle, Star, User } from 'lucide-react';

const navItems = [
  { to: '/inicio', label: 'Inicio', Icon: Home },
  { to: '/mapa', label: 'Mapa', Icon: MapPin },
  { to: '/meu-estoque', label: 'Estoque', Icon: Recycle },
  { to: '/escanear-qr', label: 'QR Code', Icon: QrCode },
  { to: '/sorteios', label: 'Sorteios', Icon: Star },
  { to: '/perfil', label: 'Perfil', Icon: User },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Navegacao principal do morador"
      className="fixed inset-x-2 bottom-2 z-[999] mx-auto grid max-w-[30rem] grid-cols-6 gap-1 rounded-2xl bg-[var(--color-primary)] px-2 py-2 text-white shadow-lg shadow-slate-900/20 sm:inset-x-4 sm:bottom-4 sm:px-3 lg:left-[calc(50%+9rem)] lg:right-auto lg:w-[min(30rem,calc(100vw-20rem))] lg:-translate-x-1/2"
    >
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            `flex min-h-12 min-w-0 items-center justify-center rounded-xl transition focus-visible:ring-2 focus-visible:ring-white/70 ${
              isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'
            }`
          }
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
