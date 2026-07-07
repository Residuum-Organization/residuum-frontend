import React from "react";

export default function PageContainer({
  as: Component = "main",
  children,
  className = "",
  innerClassName = "",
  ...props
}) {
  return (
    <Component className={`residuum-page ${className}`} {...props}>
      <div className={`residuum-page-inner ${innerClassName}`}>
        {children}
      </div>
    </Component>
  );
}
