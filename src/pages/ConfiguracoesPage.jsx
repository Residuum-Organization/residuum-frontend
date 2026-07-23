import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Label from "../components/ui/Label";
import RoleShell from "../components/layout/RoleShell";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingButton from "../components/ui/LoadingButton";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import { updateAddress, updateProfile } from "../services/users";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";

export default function ConfiguracoesPage() {
  const { data: profile, isLoading, isError, error } = useProfile();
  const [form, setForm] = React.useState({
    nome: "",
    email: "",
    telefone: "",
    rua: "",
    bairro: "",
    numero: "",
    cep: "",
    cidade: "",
  });
  const [feedback, setFeedback] = React.useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!profile) return;

    setForm({
      nome: profile.nome || profile.usuario?.nome || "",
      email: profile.email || profile.usuario?.email || "",
      telefone: profile.telefone || profile.usuario?.telefone || "",
      rua: profile.endereco?.rua || "",
      bairro: profile.endereco?.bairro || "",
      numero: profile.endereco?.numero || "",
      cep: profile.endereco?.cep || "",
      cidade: profile.endereco?.cidade || "",
    });
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      await updateProfile(payload);
      const hasAddress = ["rua", "bairro", "numero", "cep", "cidade"].some((field) =>
        String(payload[field] || "").trim()
      );
      if (hasAddress) {
        await updateAddress(payload);
      }
    },
    onSuccess: () => {
      setFeedback({ tone: "success", message: "Alterações salvas com sucesso." });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
    onError: (mutationError) => {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(mutationError, "Não foi possível salvar as alterações."),
      });
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <LoadingState title="Carregando configurações..." className="mx-auto mt-10 max-w-md" />
      </RoleShell>
    );
  }

  if (isError) {
    return (
      <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
        <ErrorState
          title={getApiErrorMessage(error, "Erro ao carregar dados.")}
          className="mx-auto mt-10 max-w-md"
        />
      </RoleShell>
    );
  }

  return (
    <RoleShell variant="morador" shellClassName="bg-[var(--color-surface)]" contentClassName="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-28">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Configurações"
          title="Editar perfil"
          description="Mantenha seus dados sempre atualizados."
          action={
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Voltar
            </Button>
          }
        />

        <div className="max-w-2xl">
          <SectionCard title="Seus dados" description="Estas informações são usadas para contato e entregas.">
            <div className="space-y-4">
              <Field label="Nome" value={form.nome} onChange={(val) => setForm((curr) => ({ ...curr, nome: val }))} />
              <Field label="E-mail" value={form.email} onChange={(val) => setForm((curr) => ({ ...curr, email: val }))} />
              <Field label="Telefone" value={form.telefone} onChange={(val) => setForm((curr) => ({ ...curr, telefone: val }))} />

              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-extrabold text-[#1A2C71]">Endereço residencial</h3>
                <p className="mt-1 text-sm text-slate-500">Usado para manter seu cadastro completo.</p>
              </div>
              <Field label="Rua" value={form.rua} onChange={(val) => setForm((curr) => ({ ...curr, rua: val }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Número" type="number" value={form.numero} onChange={(val) => setForm((curr) => ({ ...curr, numero: val }))} />
                <Field label="Bairro" value={form.bairro} onChange={(val) => setForm((curr) => ({ ...curr, bairro: val }))} />
                <Field label="CEP" value={form.cep} onChange={(val) => setForm((curr) => ({ ...curr, cep: val }))} />
                <Field label="Cidade" value={form.cidade} onChange={(val) => setForm((curr) => ({ ...curr, cidade: val }))} />
              </div>

              {feedback ? <InlineAlert variant={feedback.tone}>{feedback.message}</InlineAlert> : null}

              <LoadingButton
                type="button"
                variant="primary"
                className="w-full py-4"
                isLoading={saveMutation.isPending}
                loadingText="Salvando..."
                onClick={() => saveMutation.mutate(form)}
              >
                Salvar alterações
              </LoadingButton>
            </div>
          </SectionCard>

          <div className="mt-6">
            <SectionCard title="Sua Conta">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-slate-600">Sair do aplicativo com segurança.</p>
                <Button type="button" variant="danger" onClick={handleLogout} className="w-full gap-2 sm:w-auto">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sair da conta
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-semibold text-[#1A2C71]">{label}</Label>
      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition focus:border-[#1A2C71] focus:ring-2 focus:ring-[#1A2C71]/20"
      />
    </div>
  );
}
