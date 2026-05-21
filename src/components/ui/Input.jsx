import React from "react";

export default function Input({ className = "", invalid = false, ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-800 outline-none transition focus:ring-2 focus:ring-[var(--color-welcome-blue)]/20 ${
        invalid
          ? "border-red-400 focus:border-red-500"
          : "border-slate-200 focus:border-[var(--color-welcome-blue)]"
      } ${className}`}
      {...props}
    />
  );
}
