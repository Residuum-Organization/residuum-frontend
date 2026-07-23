import React from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import FormField from "./FormField";

export default function RegisterForm({
  register,
  errors,
  isSubmitting,
  onContinue,
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
      className="space-y-4 sm:space-y-5"
      noValidate
    >
      <FormField
        id="name"
        label="Nome completo"
        placeholder="Digite seu nome"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        id="email"
        label="E-mail"
        type="email"
        placeholder="Digite o e-mail"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        id="phone"
        label="Telefone"
        placeholder="(00) 00000-0000"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormField
        id="password"
        label="Senha"
        type="password"
        placeholder="Crie uma senha"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormField
        id="confirmPassword"
        label="Confirmar senha"
        type="password"
        placeholder="Repita a senha"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="lgpd"
            {...register("lgpd")}
            className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-[var(--color-welcome-blue)] focus:ring-[var(--color-welcome-blue)]"
          />
          <label htmlFor="lgpd" className="text-sm font-medium leading-relaxed text-slate-600">
            Li e aceito os <span className="font-semibold text-[var(--color-welcome-blue)] underline">Termos de Uso</span> e a <span className="font-semibold text-[var(--color-welcome-blue)] underline">Política de Privacidade</span>.
          </label>
        </div>
        {errors.lgpd && <p className="text-sm font-semibold text-red-600">{errors.lgpd.message}</p>}
      </div>

      <Button
        type="submit"
        variant="brandPrimary"
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
