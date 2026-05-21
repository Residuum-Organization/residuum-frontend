import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import RegisterForm from "../components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--color-welcome-surface)] px-4 py-6 sm:px-6 sm:py-8">
      <Card className="mx-auto w-full max-w-md border-0 p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <img
            src="/residuum-logo.png"
            alt="Logo Residuum"
            className="mx-auto h-14 w-14 object-contain"
          />
          <h1 className="mt-3 text-3xl font-bold text-[var(--color-welcome-blue)]">
            Cadastre-se
          </h1>
        </div>
        <RegisterForm />
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
