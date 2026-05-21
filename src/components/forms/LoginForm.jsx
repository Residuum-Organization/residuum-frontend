import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { loginSchema } from "../../schemas/auth";
import { useAuth } from "../../contexts/AuthContext";
import Label from "../ui/Label";
import Input from "../ui/Input";
import InputPassword from "../ui/InputPassword";
import Button from "../ui/Button";
import GoogleIcon from "../../../assets/icons/GoogleIcon";
import FacebookIcon from "../../../assets/icons/FacebookIcon";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const [authError, setAuthError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { login } = useAuth();

  //somente state, futuramente colocar com react query para gerenciar estado de autenticação globalmente
  const onSubmit = async (data) => {
    setAuthError("");
    try {
      await login(data.email, data.password);
    } catch (e) {
      setAuthError("Credenciais inválidas");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 sm:space-y-5"
      noValidate
    >
      <div>
        <label htmlFor="email" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-slate-600">E-mail</Label>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block">
          <Label className="text-sm font-semibold text-slate-600">Senha</Label>
        </label>
        <InputPassword
          id="password"
          placeholder="Sua senha"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
        <div className="mt-2 flex justify-end">
          <Link
            to="/recuperar-senha"
            className="text-sm text-[var(--color-welcome-muted)] hover:opacity-80"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="brandPrimary"
        disabled={isSubmitting}
        className="h-14 w-full rounded-full text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-80"
      >
        <span className="inline-flex items-center gap-2">
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Entrando..." : "Entrar"}
        </span>
      </Button>

      {authError && (
        <p className="text-center text-sm font-medium text-red-600">
          {authError}
        </p>
      )}

      <div className="flex w-full items-center gap-2.5 text-[var(--color-welcome-muted)] sm:gap-3">
        <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
        <span className="shrink-0 text-base font-semibold leading-none">
          ou
        </span>
        <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">
        <button
          type="button"
          className="rounded-full p-1 transition hover:scale-105"
          aria-label="Entrar com Google"
        >
          <GoogleIcon />
        </button>
        <button
          type="button"
          className="rounded-full p-1 transition hover:scale-105"
          aria-label="Entrar com Facebook"
        >
          <FacebookIcon />
        </button>
      </div>

      <p className="pt-1 text-center text-sm text-[var(--color-welcome-muted)]">
        Nao tem conta?{" "}
        <Link
          to="/cadastro"
          className="font-semibold text-[var(--color-welcome-blue)] underline underline-offset-2"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
