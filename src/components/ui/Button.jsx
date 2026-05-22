import React from "react";

const variants = {
  primary: "bg-[#0D2C8B] text-white shadow-lg",
  secondary: "bg-white border border-gray-100 text-[#0D2C8B] shadow-md",
  ghost: "bg-white/20 text-white",
  brandPrimary: "bg-[var(--color-welcome-blue)] text-white",
  brandOutline:
    "bg-transparent border border-[var(--color-welcome-blue)] text-[var(--color-welcome-blue)]",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`rounded-3xl font-bold transition-opacity hover:opacity-90 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
