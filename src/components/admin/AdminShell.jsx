import React from "react";
import RoleShell from "../layout/RoleShell";

export default function AdminShell({
  children,
  environmentVariant = "admin",
  shellClassName = "bg-[var(--color-surface)]",
  contentClassName = "px-4 py-4 sm:px-6 sm:py-6 lg:px-8",
}) {
  return (
    <RoleShell
      variant={environmentVariant}
      shellClassName={shellClassName}
      contentClassName={contentClassName}
    >
      {children}
    </RoleShell>
  );
}
