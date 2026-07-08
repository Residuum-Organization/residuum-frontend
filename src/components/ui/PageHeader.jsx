import React from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <header
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-extrabold uppercase text-[var(--color-text-muted)]">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
