import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Coins,
  Pencil,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import AdminShell from "../components/admin/AdminShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import InlineAlert from "../components/ui/InlineAlert";
import LoadingButton from "../components/ui/LoadingButton";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import { adjustUserPoints, deleteUser, listUsers, updateUser, updateUserRole } from "../services/admin";
import { getRoleLabel } from "../utils/roles";

const roles = [
  { value: "", label: "Todos" },
  { value: "usuario", label: "Morador" },
  { value: "cooperativa", label: "Ponto de Coleta" },
  { value: "admin", label: "Administrador" },
];

export default function PageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "", email: "", telefone: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [pointsModal, setPointsModal] = useState(null);
  const [pointsForm, setPointsForm] = useState({ delta: "", motivo: "" });

  const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      // Como a busca precisa ignorar acentos e case e buscar em dois campos,
      // trazemos uma página maior do backend e filtramos no frontend se houver busca.
      // Se não houver busca, respeitamos a paginação normal.
      const isSearching = searchQuery.trim().length > 0;
      const data = await listUsers({
        page: isSearching ? 1 : page,
        pageSize: isSearching ? 100 : pageSize,
        role: filterRole || undefined,
      });
      
      let fetchedUsers = data.itens || [];
      let totalFetched = data.total || 0;

      if (isSearching) {
        const queryClean = removeAccents(searchQuery);
        fetchedUsers = fetchedUsers.filter(u => {
          const nomeMatch = u.nome && removeAccents(u.nome).includes(queryClean);
          const emailMatch = u.email && removeAccents(u.email).includes(queryClean);
          return nomeMatch || emailMatch;
        });
        totalFetched = fetchedUsers.length;
        
        // Paginação manual no frontend
        const startIndex = (page - 1) * pageSize;
        fetchedUsers = fetchedUsers.slice(startIndex, startIndex + pageSize);
      }

      setUsers(fetchedUsers);
      setTotal(totalFetched);
    } catch (error) {
      setLoadError("Não foi possível carregar ou buscar os usuários no momento. Tente novamente mais tarde.");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, filterRole]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const clearFeedback = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "usuario" : "admin";
    if (
      !confirm(
        `Tem certeza que deseja ${
          newRole === "admin" ? "promover" : "rebaixar"
        } "${user.nome}"?`
      )
    ) {
      return;
    }

    clearFeedback();
    setActionLoading(user.id);
    try {
      await updateUserRole(user.id, newRole);
      await loadUsers();
      setSuccessMessage("Permissao atualizada com sucesso.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user) => {
    setDeleteConfirm(null);
    clearFeedback();
    setActionLoading(user.id);
    try {
      await deleteUser(user.id);
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadUsers();
      }
      setSuccessMessage("Usuario removido com sucesso.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (user) => {
    clearFeedback();
    setEditForm({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || "",
    });
    setEditModal(user);
  };

  const handleEditSave = async () => {
    if (!editModal) return;
    clearFeedback();
    setActionLoading(editModal.id);
    try {
      await updateUser(editModal.id, editForm);
      setEditModal(null);
      await loadUsers();
      setSuccessMessage("Usuario atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePointsSave = async () => {
    if (!pointsModal) return;
    const delta = Number(pointsForm.delta);
    if (!Number.isInteger(delta) || delta === 0 || !pointsForm.motivo.trim()) {
      setErrorMessage("Informe um valor inteiro diferente de zero e o motivo do ajuste.");
      return;
    }
    clearFeedback();
    setActionLoading(pointsModal.id);
    try {
      await adjustUserPoints(pointsModal.id, delta, pointsForm.motivo.trim());
      setPointsModal(null);
      setPointsForm({ delta: "", motivo: "" });
      await loadUsers();
      setSuccessMessage("Pontuação ajustada e registrada na auditoria.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Administracao"
        title="Usuários"
        description="Gerencie os moradores e administradores da plataforma, edite informações e controle permissões de acesso."
        action={
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />

      <SectionCard
        className="mt-5"
        title="Busca e filtros"
        description={`${total} usuario(s) encontrados conforme os filtros atuais.`}
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <SearchField
            label="Buscar usuário"
            placeholder="Buscar por nome ou e-mail..."
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
          />
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase text-[var(--color-text-muted)]">
              Perfil
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 ${
                    filterRole === role.value
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40"
                  }`}
                  onClick={() => {
                    setFilterRole(role.value);
                    setPage(1);
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>


      {successMessage ? (
        <InlineAlert
          className="mt-4"
          variant="success"
          title="Acao concluida"
          description={successMessage}
        />
      ) : null}

      {errorMessage ? (
        <InlineAlert
          className="mt-4"
          variant="error"
          title="Acao nao concluida"
          description={errorMessage}
        />
      ) : null}

      <SectionCard className="mt-5" title="Lista de usuários">
        {loading ? (
          <LoadingState
            title="Carregando usuários..."
            description="Consultando a API administrativa."
            size="lg"
          />
        ) : loadError ? (
          <ErrorState
            title="Nao foi possivel carregar usuários."
            description={loadError}
            actionLabel="Tentar novamente"
            onAction={loadUsers}
          />
        ) : users.length === 0 ? (
          <EmptyState
            title="Nenhum usuario encontrado."
            description="Revise a busca ou altere o filtro de perfil."
            icon={UserRound}
          />
        ) : (
          <>
            <div className="grid gap-3 xl:grid-cols-2">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  initials={getInitials(user.nome)}
                  loading={actionLoading === user.id}
                  onEdit={() => openEditModal(user)}
                  onAdjustPoints={() => {
                    clearFeedback();
                    setPointsForm({ delta: "", motivo: "" });
                    setPointsModal(user);
                  }}
                  onToggleRole={() => handleRoleToggle(user)}
                  onDelete={() => setDeleteConfirm(user)}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrevious={() => setPage((current) => Math.max(1, current - 1))}
                onNext={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              />
            ) : null}
          </>
        )}
      </SectionCard>

      {editModal ? (
        <EditDialog
          form={editForm}
          setForm={setEditForm}
          loading={actionLoading === editModal.id}
          onClose={() => setEditModal(null)}
          onSave={handleEditSave}
        />
      ) : null}

      {deleteConfirm ? (
        <DeleteDialog
          user={deleteConfirm}
          loading={actionLoading === deleteConfirm.id}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      ) : null}

      {pointsModal ? (
        <PointsDialog
          user={pointsModal}
          form={pointsForm}
          setForm={setPointsForm}
          loading={actionLoading === pointsModal.id}
          onClose={() => setPointsModal(null)}
          onSave={handlePointsSave}
        />
      ) : null}
    </AdminShell>
  );
}

function SearchField({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="relative block">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
          aria-hidden="true"
        />
        <input
          className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white py-2 pl-10 pr-3 text-sm font-semibold text-[var(--color-text)] transition focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function UserCard({ user, initials, loading, onEdit, onAdjustPoints, onToggleRole, onDelete }) {
  const isAdmin = user.role === "admin";

  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold text-white ${
            isAdmin ? "bg-violet-700" : "bg-[var(--color-primary)]"
          }`}
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 truncate text-base font-extrabold text-[var(--color-text)]">
              {user.nome}
            </h3>
            <Badge variant={isAdmin ? "primary" : "neutral"}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
          <p className="mt-1 break-words text-sm font-medium text-[var(--color-text-muted)]">
            {user.email}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            {user.telefone || "Sem telefone"}
          </p>
          <p className="mt-1 text-sm font-extrabold text-emerald-700">{user.pontuacao_total || 0} pontos</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 border-t border-[var(--color-border)] pt-4">
        <button
          type="button"
          onClick={onAdjustPoints}
          disabled={loading}
          title="Ajustar pontuação"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
        >
          <Coins className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onEdit}
          disabled={loading}
          title="Editar usuário"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-gray-100 hover:text-[var(--color-primary)] disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onToggleRole}
          disabled={loading}
          title={isAdmin ? "Rebaixar para morador" : "Tornar Administrador"}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors disabled:opacity-50 ${
            isAdmin
              ? "hover:bg-amber-50 hover:text-amber-600"
              : "hover:bg-violet-50 hover:text-violet-600"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : isAdmin ? (
            <ShieldOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Shield className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          title="Remover usuário"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </article>
  );
}

function Pagination({ page, totalPages, onPrevious, onNext }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <Button
        type="button"
        variant="secondary"
        onClick={onPrevious}
        disabled={page <= 1}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Anterior
      </Button>
      <span className="text-center text-sm font-extrabold text-[var(--color-text-muted)]">
        Pagina {page} de {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        onClick={onNext}
        disabled={page >= totalPages}
        className="gap-2"
      >
        Proximo
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function EditDialog({ form, setForm, loading, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[var(--color-primary)]">
              Editar usuario
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
              Atualize apenas os dados exibidos nesta tela.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface)]"
            aria-label="Fechar edicao"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <DialogInput
            label="Nome"
            value={form.nome}
            onChange={(value) => setForm({ ...form, nome: value })}
          />
          <DialogInput
            label="E-mail"
            value={form.email}
            onChange={(value) => setForm({ ...form, email: value })}
          />
          <DialogInput
            label="Telefone"
            value={form.telefone}
            onChange={(value) => setForm({ ...form, telefone: value })}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <LoadingButton type="button" onClick={onSave} isLoading={loading}>
            Salvar
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

function DialogInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function PointsDialog({ user, form, setForm, loading, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[var(--color-primary)]">Ajustar pontuação</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{user.nome} possui {user.pontuacao_total || 0} pontos.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-bold text-[var(--color-primary)]">Valor do ajuste<input type="number" step="1" value={form.delta} onChange={(event) => setForm({ ...form, delta: event.target.value })} placeholder="Ex.: 50 ou -20" className="mt-1.5 min-h-11 w-full rounded-2xl border border-slate-200 px-4" /></label>
          <label className="block text-sm font-bold text-[var(--color-primary)]">Motivo<textarea value={form.motivo} onChange={(event) => setForm({ ...form, motivo: event.target.value })} placeholder="Descreva por que o saldo sera alterado" className="mt-1.5 min-h-24 w-full rounded-2xl border border-slate-200 p-4" /></label>
        </div>
        <InlineAlert className="mt-4" variant="info" description="Valores negativos debitam pontos. O sistema nao permite saldo abaixo de zero." />
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button><LoadingButton type="button" onClick={onSave} isLoading={loading}>Aplicar ajuste</LoadingButton></div>
      </div>
    </div>
  );
}

function DeleteDialog({ user, loading, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[var(--color-error)]">
          <Trash2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-[var(--color-text)]">
          Remover usuario
        </h3>
        <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
          Tem certeza que deseja remover <strong>{user.nome}</strong>? Esta acao
          nao pode ser desfeita.
        </p>
        <InlineAlert className="mt-4 text-left" variant="error">
          A exclusao so sera confirmada apos resposta real da API.
        </InlineAlert>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <LoadingButton
            type="button"
            onClick={onConfirm}
            isLoading={loading}
            className="bg-[var(--color-error)] hover:bg-red-800"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Remover
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
