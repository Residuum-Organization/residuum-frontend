import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import RegisterForm from "../components/forms/RegisterForm";
import RegisterConfirmation from "../components/forms/RegisterConfirmation";
import AuthShell from "../components/auth/AuthShell";
import InlineAlert from "../components/ui/InlineAlert";
import { registerSchema } from "../schemas/auth";
import { applyPhoneMask } from "../utils/inputMasks";
import { registerUser } from "../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

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
    setSubmitError("");
    await handleSubmit(() => setStep(2))();
  };

  const onFinalize = async () => {
    setIsFinalizing(true);
    setSubmitError("");
    try {
      const payload = getValues();
      await registerUser({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
      });
      setShowSuccess(true);
    } catch (error) {
      setSubmitError(error.message || "Nao foi possivel finalizar o cadastro.");
    } finally {
      setIsFinalizing(false);
    }
  };

  const values = getValues();

  React.useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-welcome-blue)] bg-opacity-90 px-4">
          <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-6 py-10 text-center shadow-2xl sm:px-8 sm:py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[var(--color-welcome-blue)]">
              Cadastro realizado!
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Sua conta foi criada com sucesso. Redirecionando para o login...
            </p>
            <div className="mt-8 h-2 w-full animate-pulse rounded-full bg-slate-200">
              <div className="h-full w-full origin-left animate-[progress_2s_ease-in-out] rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      )}

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
          <div className="space-y-4">
            {submitError ? (
              <InlineAlert variant="error" description={submitError} />
            ) : null}

            <RegisterConfirmation
              values={values}
              isFinalizing={isFinalizing}
              onEdit={() => {
                setSubmitError("");
                setStep(1);
              }}
              onFinalize={onFinalize}
            />
          </div>
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
    </>
  );
}
