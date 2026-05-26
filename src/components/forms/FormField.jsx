import React from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import InputPassword from "../ui/InputPassword";

export default function FormField({
  id,
  label,
  type = "text",
  as = "input",
  error,
  className = "",
  ...props
}) {
  const invalid = Boolean(error);
  const fieldClasses = `w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-800 outline-none transition focus:ring-2 focus:ring-[var(--color-welcome-blue)]/20 ${
    invalid
      ? "border-red-400 focus:border-red-500"
      : "border-slate-200 focus:border-[var(--color-welcome-blue)]"
  }`;

  return (
    <div className={className}>
      <Label
        as="label"
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-[var(--color-welcome-blue)]"
      >
        {label}
      </Label>

      {type === "password" ? (
        <InputPassword id={id} invalid={invalid} {...props} />
      ) : as === "textarea" ? (
        <textarea
          id={id}
          className={`${fieldClasses} min-h-28 resize-none`}
          {...props}
        />
      ) : (
        <Input id={id} type={type} invalid={invalid} {...props} />
      )}

      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
