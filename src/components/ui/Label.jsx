import React from "react";

export default function Label({
  as: Component = "span",
  children,
  className = "",
  ...props
}) {
  return (
    <Component className={`text-sm font-semibold text-[var(--color-text-muted)] ${className}`} {...props}>
      {children}
    </Component>
  );
}
