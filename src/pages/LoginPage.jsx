import React from "react";
import Card from "../components/ui/Card";
import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <div className="mx-auto w-full max-w-sm">
        <Card className="border-0 p-6 text-slate-900 shadow-xl sm:p-8">
          <div>
            <section>
              <div className="mx-auto mb-6 flex w-full max-w-xs flex-col items-center text-center sm:mb-7">
                <img
                  src="/logo.jpeg"
                  alt="Logo Residuum"
                  className="h-16 w-16 object-contain"
                />
                <h1 className="mt-3 text-3xl font-bold text-[var(--color-welcome-blue)]">
                  Residuum
                </h1>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-welcome-blue)]">
                  Entrar
                </h1>
                <p className="mt-2 text-sm text-[var(--color-welcome-muted)]">
                  Acesse sua conta para continuar.
                </p>
              </div>

              <LoginForm />
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
