import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

export default function WelcomeOnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-900/5">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1FA34A]/10 text-[#1FA34A]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-extrabold text-[#1F4E79]">Conta criada com sucesso!</h1>
        <p className="mb-8 text-sm leading-relaxed text-[var(--color-text-muted)]">
          Bem-vindo ao Residuum. Agora você faz parte de uma rede comprometida com o meio ambiente e a reciclagem.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate("/login")}
          className="w-full py-4 text-base"
        >
          Fazer Login para começar
          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
