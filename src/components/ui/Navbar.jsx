import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, QrCode, Recycle, Star, User } from 'lucide-react';

const navItems = [
  { to: '/mapa', label: 'Localizacao', Icon: MapPin },
  { to: '/meu-estoque', label: 'Estoque', Icon: Recycle },
  { to: '/inicio', label: 'Inicio', Icon: Home },
  { to: '/escanear-qr', label: 'QR Code', Icon: QrCode },
  { to: '/sorteios', label: 'Sorteios', Icon: Star },
  { to: '/perfil', label: 'Perfil', Icon: User },
];

export default function Navbar() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-[999] mx-auto grid max-w-[28rem] grid-cols-6 rounded-2xl bg-[var(--color-primary)] px-2 py-3 text-white shadow-lg shadow-slate-900/20 sm:bottom-4 sm:px-3 lg:left-[calc(50%+9rem)] lg:right-auto lg:w-[min(28rem,calc(100vw-20rem))] lg:-translate-x-1/2">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            `flex min-h-11 items-center justify-center rounded-xl transition focus-visible:ring-2 focus-visible:ring-white/70 ${
              isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'
            }`
          }
        >
          <Icon size={24} strokeWidth={2.4} />
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
