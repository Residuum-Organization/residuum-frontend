import React from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Card from "../components/ui/Card";
import RegisterForm from "../components/forms/RegisterForm";
import RegisterConfirmation from "../components/forms/RegisterConfirmation";
import CardResiduum from "../components/auth/CardResiduum";
import { registerSchema } from "../schemas/auth";
import { applyPhoneMask } from "../utils/inputMasks";

export default function RegisterPage() {
  const [step, setStep] = React.useState(1);
  const [isFinalizing, setIsFinalizing] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const phoneValue = watch("phone");

  React.useEffect(() => {
    if (step === 1 && phoneValue) {
      const masked = applyPhoneMask(phoneValue);
      if (masked !== phoneValue) {
        setValue("phone", masked, { shouldValidate: false });
      }
    }
  }, [phoneValue, setValue, step]);

  const onContinue = async () => {
    await handleSubmit(() => setStep(2))();
  };

  const onFinalize = async () => {
    setIsFinalizing(true);
    const payload = getValues();
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log("register-finalize", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    });
    setIsFinalizing(false);
  };

  const values = getValues();

  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <Card className="mx-auto w-full max-w-md border-0 p-6 shadow-xl sm:p-8 lg:max-w-6xl lg:p-0">
        <div className="lg:flex lg:min-h-[650px] lg:items-stretch">
          <CardResiduum
            description="Crie sua conta para acessar os pontos de coleta, cadastrar descartes e acompanhar seu impacto ambiental de forma simples."
            footer="Comece em minutos e faca parte da rede que transforma descarte em impacto positivo."
          />

          <div className="hidden lg:block lg:w-px lg:bg-slate-200" />

          <section className="lg:w-1/2 lg:p-10">
            <div className="mb-6 text-center lg:hidden">
              <img
                src="/residuum-logo.png"
                alt="Logo Residuum"
                className="mx-auto h-14 w-14 object-contain"
              />
              <h1 className="mt-2 text-3xl font-bold text-[var(--color-welcome-blue)]">
                Residuum
              </h1>
            </div>

            <div className="mb-6 hidden lg:block">
              <h1 className="text-3xl font-bold text-[var(--color-welcome-blue)]">
                Cadastro
              </h1>
              <p className="mt-2 text-sm text-[var(--color-welcome-muted)]">
                Preencha seus dados para continuar.
              </p>
            </div>

            <div className="mb-7">
              <div className="mx-auto flex w-full max-w-[220px] items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    step === 1
                      ? "border-[var(--color-welcome-blue)] bg-[var(--color-welcome-blue)] text-white"
                      : "border-[var(--color-welcome-blue)] bg-white text-[var(--color-welcome-blue)]"
                  }`}
                >
                  {step === 2 ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-welcome-blue)]" />
                  ) : null}
                </div>

                <div className="h-0.5 w-full bg-[var(--color-welcome-blue)]" />

                <div
                  className={`h-7 w-7 shrink-0 rounded-full border-2 ${
                    step === 2
                      ? "border-[var(--color-welcome-blue)] bg-[var(--color-welcome-blue)]"
                      : "border-[var(--color-welcome-blue)] bg-white"
                  }`}
                />
              </div>

              <div className="mx-auto mt-2 flex w-full max-w-[280px] items-start justify-between text-sm font-semibold text-[var(--color-welcome-blue)]">
                <p>Dados pessoais</p>
                <p>Confirmacao</p>
              </div>
            </div>

            {step === 1 ? (
              <RegisterForm
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                onContinue={onContinue}
              />
            ) : (
              <RegisterConfirmation
                values={values}
                isFinalizing={isFinalizing}
                onEdit={() => setStep(1)}
                onFinalize={onFinalize}
              />
            )}

            <p className="mt-5 text-center text-sm text-[var(--color-welcome-muted)]">
              Ja tem conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--color-welcome-blue)] underline underline-offset-2"
              >
                Entrar
              </Link>
            </p>
          </section>
        </div>
      </Card>
    </main>
  );
}
