import React from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "Nenhum item encontrado.",
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className = "",
}) {
  const iconNode =
    typeof Icon === "function" ? <Icon className="h-6 w-6" /> : Icon;

  return (
    <div
      className={`rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-8 text-center ${className}`}
    >
      {iconNode ? (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
          {iconNode}
        </div>
      ) : null}
      <p className="text-base font-bold text-[var(--color-primary)]">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button type="button" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
