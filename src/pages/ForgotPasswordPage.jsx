import React from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { forgotPasswordSchema } from "../schemas/auth";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("forgot-password", data);
  };

  return (
    <main className="h-dvh overflow-hidden bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8">
      <Card className="mx-auto flex h-full w-full max-w-sm flex-col border-0 p-6 shadow-xl sm:p-8">
        <div>
          <img
            src="/logo.jpeg"
            alt="Logo Residuum"
            className="mx-auto h-16 w-16 object-contain sm:h-20 sm:w-20"
          />

          <div className="mt-6 text-center sm:mt-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 sm:h-14 sm:w-14">
              <Lock size={22} />
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-[var(--color-welcome-blue)] sm:mt-6 sm:text-4xl">
              Esqueceu sua senha?
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-[var(--color-welcome-muted)]">
              Digite seu e-mail para receber um link de redefinição de senha
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4 sm:space-y-5"
            noValidate
          >
            <div>
              <Label
                as="label"
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-600"
              >
                E-mail Cadastrado
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                invalid={Boolean(errors.email)}
                className="h-14 rounded-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="brandPrimary"
                disabled={isSubmitting}
                className="h-12 w-full max-w-[13rem] rounded-full text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-80 sm:h-14 sm:max-w-[14rem] sm:text-xl"
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting ? "Enviando..." : "Enviar link"}{" "}
                  <ArrowRight size={18} />
                </span>
              </Button>
            </div>
          </form>
        </div>

        <Link
          to="/login"
          className="mt-auto inline-flex items-center justify-center gap-2 pb-4 text-center text-lg font-semibold text-[var(--color-welcome-blue)] sm:text-xl"
        >
          <ArrowLeft size={18} /> Voltar para login
        </Link>
      </Card>
    </main>
  );
}
