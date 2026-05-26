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
    <form className="space-y-4 sm:space-y-5" noValidate>
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
