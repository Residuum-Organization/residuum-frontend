import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schemas/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getRoleHome } from "../../utils/roles";
import Label from "../ui/Label";
import Input from "../ui/Input";
import InputPassword from "../ui/InputPassword";
import InlineAlert from "../ui/InlineAlert";
import LoadingButton from "../ui/LoadingButton";
import GoogleIcon from "../../../assets/icons/GoogleIcon";
import FacebookIcon from "../../../assets/icons/FacebookIcon";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const [authError, setAuthError] = React.useState("");
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      const result = await login(data.email, data.password, data.rememberMe);
      navigate(getRoleHome(result.user?.role), { replace: true });
    } catch (e) {
      setAuthError(e.message || "Credenciais inválidas");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 sm:space-y-5"
      noValidate
    >
      <div>
        <Label
          as="label"
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-slate-600"
        >
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm font-medium text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label
          as="label"
          htmlFor="password"
          className="mb-1.5 block text-sm font-semibold text-slate-600"
        >
          Senha
        </Label>
        <InputPassword
          id="password"
          placeholder="Sua senha"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-sm font-medium text-red-600">
            {errors.password.message}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
              defaultChecked={true}
              {...register("rememberMe")}
            />
            Lembrar-me
          </label>
          <Link
            to="/recuperar-senha"
            className="text-sm font-semibold text-[var(--color-welcome-muted)] underline-offset-2 hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      <LoadingButton
        type="submit"
        variant="brandPrimary"
        isLoading={isSubmitting}
        loadingText="Entrando..."
        className="h-14 w-full rounded-full text-lg font-semibold"
      >
        Entrar
      </LoadingButton>

      {authError ? <InlineAlert variant="error" description={authError} /> : null}

      <div className="flex w-full items-center gap-2.5 text-[var(--color-welcome-muted)] sm:gap-3">
        <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
        <span className="shrink-0 text-base font-semibold leading-none">
          ou entre com
        </span>
        <hr className="m-0 h-px basis-0 grow border-0 bg-current" />
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">
        <button
          type="button"
          disabled
          className="rounded-full p-1 opacity-45 grayscale"
          aria-label="Login com Google indisponível"
          title="Login com Google indisponível"
        >
          <GoogleIcon />
        </button>
        <button
          type="button"
          disabled
          className="rounded-full p-1 opacity-45 grayscale"
          aria-label="Login com Facebook indisponível"
          title="Login com Facebook indisponível"
        >
          <FacebookIcon />
        </button>
      </div>
      <p className="-mt-2 text-center text-xs font-medium text-[var(--color-welcome-muted)]">
        Login social indisponível no momento.
      </p>

      <p className="pt-1 text-center text-sm text-[var(--color-welcome-muted)]">
        Não tem conta?{" "}
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
