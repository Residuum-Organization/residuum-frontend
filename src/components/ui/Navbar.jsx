import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-[999] grid w-[360px] -translate-x-1/2 grid-cols-5 bg-[#11527a] px-3 py-4 text-white shadow-xl">
      <button
        type="button"
        aria-label="Localização"
        className="flex items-center justify-center"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Reciclagem"
        className="flex items-center justify-center text-[28px] leading-none"
      >
        ♻
      </button>
      <button
        type="button"
        aria-label="Início"
        className="flex items-center justify-center"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1V10.8z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="QR Code"
        className="flex items-center justify-center"
      >
        <svg
          width="31"
          height="31"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <path d="M4 4h5v5H4z" />
          <path d="M15 4h5v5h-5z" />
          <path d="M4 15h5v5H4z" />
          <path d="M15 15h2v2h-2z" />
          <path d="M19 15h1v5h-5v-1" />
          <path d="M12 4v16" />
          <path d="M2 7v10" />
          <path d="M22 7v10" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Favoritos"
        className="flex items-center justify-center"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.45 1.08 6.28L12 17.15l-5.63 2.98 1.08-6.28L2.9 9.4l6.3-.9L12 2.8z" />
        </svg>
      </button>
    </nav>
  );
}
