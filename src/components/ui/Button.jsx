import React from "react";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-dark)]",
  secondary:
    "border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-sm hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface)]",
  ghost: "bg-white/20 text-white hover:bg-white/30",
  brandPrimary:
    "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-dark)]",
  brandOutline:
    "border border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
  danger: "bg-[var(--color-error)] text-white shadow-sm hover:bg-red-800",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2.5 text-center text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-2 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
