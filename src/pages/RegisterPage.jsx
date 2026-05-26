import React from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import RegisterForm from "../components/forms/RegisterForm";
import RegisterConfirmation from "../components/forms/RegisterConfirmation";
import AuthShell from "../components/auth/AuthShell";
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
    <AuthShell
      title="Cadastro"
      subtitle="Preencha seus dados para continuar."
      description="Transforme descarte em impacto positivo. O Residuum conecta você aos pontos de coleta e simplifica a reciclagem no dia a dia."
      highlights={[
        "Encontre pontos de coleta próximos em segundos",
        "Registre seus descartes com poucos cliques",
        "Acompanhe seu impacto ambiental ao longo do tempo",
      ]}
      footer='"Pequenas escolhas diárias geram grandes transformações para a cidade e para o planeta."'
    >
      <div className="mb-7">
        <div className="mx-auto flex w-full max-w-[220px] items-center">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-welcome-blue)] bg-[var(--color-welcome-blue)] text-white" />

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
          <p>Confirmação</p>
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
        Já tem conta?{" "}
        <Link
          to="/login"
          className="font-semibold text-[var(--color-welcome-blue)] underline underline-offset-2"
        >
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
