import React from "react";
import { Loader2 } from "lucide-react";

const sizes = {
  sm: "py-4",
  md: "py-6",
  lg: "py-10",
};

export default function LoadingState({
  title = "Carregando...",
  description,
  className = "",
  size = "md",
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-[var(--color-primary)] shadow-sm ${sizes[size] || sizes.md} ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
