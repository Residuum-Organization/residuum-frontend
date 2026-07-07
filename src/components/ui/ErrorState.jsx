import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Algo deu errado.",
  description,
  actionLabel,
  onAction,
  actionDisabled = false,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-red-200 bg-white p-5 shadow-sm ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-error)]" />
        <div className="min-w-0">
          <p className="text-base font-extrabold text-[var(--color-text)]">
            {title}
          </p>
          {description ? (
            <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actionLabel && onAction ? (
        <Button
          type="button"
          onClick={onAction}
          disabled={actionDisabled}
          className="mt-4"
          variant="danger"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
