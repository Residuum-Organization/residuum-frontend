import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Card from "../components/ui/Card";
import LoginForm from "../components/forms/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { getRoleHome } from "../utils/roles";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleHome(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-5 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <div className="mx-auto w-full max-w-md">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="mb-4 inline-flex items-center text-sm font-semibold text-[var(--color-primary)] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </button>
        <Card className="border-0 p-5 text-slate-900 shadow-sm sm:p-8">
          <section>
            <div className="mx-auto mb-5 flex w-full max-w-xs flex-col items-center text-center sm:mb-7">
              <img
                src="/logo.jpeg"
                alt="Logo Residuum"
                className="h-16 w-16 object-contain"
              />
              <p className="mt-3 text-3xl font-bold text-[var(--color-primary)]">
                Residuum
              </p>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
                Entrar
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-welcome-muted)]">
                Acesse sua conta para continuar.
              </p>
            </div>

            <LoginForm />
          </section>
        </Card>
      </div>
    </main>
  );
}
