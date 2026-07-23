import React from "react";
import { ChevronDown } from "lucide-react";

export function Select({ className = "", children, ...props }) {
  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-[#1F4E79] focus-within:ring-2 focus-within:ring-[#1F4E79]/20 ${className}`}
    >
      <select
        className="w-full appearance-none rounded-2xl bg-transparent py-4 pl-5 pr-10 text-base font-extrabold text-[#1F4E79] outline-none"
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDown size={20} />
      </div>
    </div>
  );
}

export default Select;
