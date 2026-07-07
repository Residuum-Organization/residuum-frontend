import React from "react";
import { FaHome, FaUser, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

export default function BottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex w-full items-center justify-between border-t border-[var(--color-border)] bg-white px-5 py-3 shadow-lg shadow-slate-900/10 md:hidden">
      <button className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl text-gray-600 transition hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30">
        <FaHome size={24} />
      </button>
      <button className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl text-gray-600 transition hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30">
        <FaUser size={24} />
      </button>
      <button className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl text-gray-600 transition hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30">
        <FaBriefcase size={24} />
      </button>
      <button className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl text-gray-600 transition hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30">
        <FaMapMarkerAlt size={24} />
      </button>
    </div>
  );
}
