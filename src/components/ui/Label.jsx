import React from "react";

export default function Label({
  as: Component = "span",
  children,
  className = "",
  ...props
}) {
  return (
    <Component className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </Component>
  );
}
