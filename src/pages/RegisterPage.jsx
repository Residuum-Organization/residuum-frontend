import React from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Pencil } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import RegisterForm from "../components/forms/RegisterForm";
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
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8">
      <Card className="mx-auto w-full max-w-md border-0 p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <img
            src="/residuum-logo.png"
            alt="Logo Residuum"
            className="mx-auto h-14 w-14 object-contain"
          />
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-welcome-blue)]">
            Residuum
          </h1>
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
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={24} />
              </div>
              <h2 className="mt-3 text-3xl font-bold text-[var(--color-welcome-blue)]">
                Confirme seus dados
              </h2>
              <p className="mt-1 text-sm text-[var(--color-welcome-muted)]">
                Revise as informacoes antes de finalizar
              </p>
            </div>

            <div className="space-y-3">
              <DataRow label="Nome completo" value={values.name} />
              <DataRow label="E-mail" value={values.email} />
              <DataRow label="Telefone" value={values.phone} />
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 text-base font-semibold text-[var(--color-welcome-blue)] hover:opacity-80"
            >
              <Pencil size={16} /> Editar informacoes
            </button>

            <Button
              type="button"
              variant="brandPrimary"
              onClick={onFinalize}
              disabled={isFinalizing}
              className="mt-4 h-14 w-full rounded-full text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isFinalizing ? "Finalizando..." : "Finalizar cadastro"}
            </Button>
          </section>
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
      </Card>
    </main>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[var(--color-welcome-blue)]">
        {value || "-"}
      </p>
    </div>
  );
}
