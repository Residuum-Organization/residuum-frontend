import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const variants = {
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-[var(--color-primary)]",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

export default function InlineAlert({
  variant = "info",
  title,
  description,
  children,
  className = "",
}) {
  const current = variants[variant] || variants.info;
  const Icon = current.icon;
  const content = children || description;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${current.className} ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className="font-bold">{title}</p> : null}
        {content ? <div className={title ? "mt-1" : ""}>{content}</div> : null}
      </div>
    </div>
  );
}
