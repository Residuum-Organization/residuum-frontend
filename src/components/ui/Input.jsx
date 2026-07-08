import React from "react";

const Input = React.forwardRef(function Input(
  { className = "", invalid = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
        invalid
          ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
          : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
      } ${className}`}
      {...props}
    />
  );
});

export default Input;
