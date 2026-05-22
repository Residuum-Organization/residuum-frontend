import React from "react";

export default function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 w-full bg-[#1F4E79] py-3 px-8 flex justify-between items-center">
      <button className="text-white text-xl">🏠</button>
      <button className="text-white text-xl opacity-75">✅</button>
      <button className="text-white text-xl opacity-75">📍</button>
      <button className="text-white text-xl opacity-75">👤</button>
    </nav>
  );
}
