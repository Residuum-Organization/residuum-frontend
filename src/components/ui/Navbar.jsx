import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, QrCode, Recycle, Star, User } from 'lucide-react';

const navItems = [
  { to: '/mapa', label: 'Localizacao', Icon: MapPin },
  { to: '/meu-estoque', label: 'Estoque', Icon: Recycle },
  { to: '/welcome-residuum', label: 'Inicio', Icon: Home },
  { to: '/escanear-qr', label: 'QR Code', Icon: QrCode },
  { to: '/sorteios', label: 'Sorteios', Icon: Star },
  { to: '/perfil', label: 'Perfil', Icon: User },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-[999] grid w-[360px] -translate-x-1/2 grid-cols-6 bg-[#11527a] px-3 py-4 text-white shadow-xl lg:left-[calc(50%+9rem)]">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            `flex items-center justify-center rounded-2xl py-1 transition ${
              isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'
            }`
          }
        >
          <Icon size={28} strokeWidth={2.4} />
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
