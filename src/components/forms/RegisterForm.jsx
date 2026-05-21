import React from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RegisterForm({
  register,
  errors,
  isSubmitting,
  onContinue,
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <form className="space-y-4 sm:space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-[var(--color-welcome-blue)]">
            Nome completo
          </Label>
        </label>
        <Input
          id="name"
          placeholder="Digite seu nome"
          invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-[var(--color-welcome-blue)]">
            E-mail
          </Label>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Digite o e-mail"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-[var(--color-welcome-blue)]">
            Telefone
          </Label>
        </label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-[var(--color-welcome-blue)]">
            Senha
          </Label>
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Crie uma senha"
            invalid={Boolean(errors.password)}
            className="pr-12"
            {...register("password")}
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
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-[var(--color-welcome-blue)]">
            Confirmar senha
          </Label>
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repita a senha"
            invalid={Boolean(errors.confirmPassword)}
            className="pr-12"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 hover:text-slate-700"
            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="brandPrimary"
        onClick={onContinue}
        disabled={isSubmitting}
        className="mt-2 h-14 w-full rounded-full text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-80"
      >
        <span className="inline-flex items-center gap-2">
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Continuando..." : "Continuar"}
        </span>
      </Button>
    </form>
  );
}
