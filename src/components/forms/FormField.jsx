import React from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import InputPassword from "../ui/InputPassword";

const FormField = React.forwardRef(function FormField(
  {
    id,
    label,
    type = "text",
    as = "input",
    error,
    className = "",
    ...props
  },
  ref
) {
  const invalid = Boolean(error);
  const fieldClasses = `min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
    invalid
      ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
      : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
  }`;

  return (
    <div className={className}>
      <Label
        as="label"
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-[var(--color-primary)]"
      >
        {label}
      </Label>

      {type === "password" ? (
        <InputPassword ref={ref} id={id} invalid={invalid} {...props} />
      ) : as === "textarea" ? (
        <textarea
          ref={ref}
          id={id}
          className={`${fieldClasses} min-h-28 resize-none`}
          {...props}
        />
      ) : (
        <Input ref={ref} id={id} type={type} invalid={invalid} {...props} />
      )}

      {error ? (
        <p className="mt-1.5 text-sm font-medium text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default FormField;
