import React from "react";
import Card from "./Card";

export default function SectionCard({
  title,
  description,
  action,
  children,
  className = "",
  ...props
}) {
  return (
    <Card className={className} {...props}>
      {(title || description || action) ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-base font-extrabold text-[var(--color-primary)]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </Card>
  );
}
