import React from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

export default React.forwardRef(function InputPassword(
  { className = "", invalid = false, ...props },
  ref
) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        invalid={invalid}
        className={`pr-12 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 hover:text-slate-700"
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});
