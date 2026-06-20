import React, { useState, useEffect, useCallback } from "react";
import { Search, X, Check, ChevronLeft, ChevronRight, Shield, ShieldOff, Trash2, Pencil, Loader2 } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import { listUsers, updateUserRole, deleteUser, updateUser } from "../services/admin";

export default function PageUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchNome, setSearchNome] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal de edição
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "", email: "", telefone: "" });

  // Modal de confirmação de exclusão
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listUsers({
        page,
        pageSize,
        nome: searchNome || undefined,
        email: searchEmail || undefined,
        role: filterRole || undefined,
      });
      setUsers(data.itens || []);
      setTotal(data.total || 0);
    } catch (error) {
      alert(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchNome, searchEmail, filterRole]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "usuario" : "admin";
    if (!confirm(`Tem certeza que deseja ${newRole === "admin" ? "promover" : "rebaixar"} "${user.nome}"?`)) return;

    setActionLoading(user.id);
    try {
      await updateUserRole(user.id, newRole);
      await loadUsers();
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user) => {
    setDeleteConfirm(null);
    setActionLoading(user.id);
    try {
      await deleteUser(user.id);
      await loadUsers();
      if (users.length === 1 && page > 1) setPage(page - 1);
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (user) => {
    setEditForm({ nome: user.nome, email: user.email, telefone: user.telefone || "" });
    setEditModal(user);
  };

  const handleEditSave = async () => {
    if (!editModal) return;
    setActionLoading(editModal.id);
    try {
      await updateUser(editModal.id, editForm);
      setEditModal(null);
      await loadUsers();
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  return (
    <AdminShell contentClassName="px-5 py-5">
      <div className="rounded-[28px] bg-white p-6 shadow-lg">
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center">
          <div className="mr-3 rounded-lg bg-blue-100 p-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="#2B4B6F"
                d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6Zm0 2h12v16H6V4Zm2 2v2h8V6H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z"
              />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-800">Usuários</div>
            <div className="text-xs text-gray-500">{total} cadastrados</div>
          </div>
        </div>

        {/* Busca */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Buscar por nome..."
              value={searchNome}
              onChange={(e) => { setSearchNome(e.target.value); setPage(1); }}
            />
          </div>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Buscar por e-mail..."
              value={searchEmail}
              onChange={(e) => { setSearchEmail(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Filtros de role */}
        <div className="mb-4 flex gap-2">
          {["", "usuario", "admin"].map((role) => (
            <button
              key={role}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filterRole === role
                  ? role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500 hover:bg-blue-50"
              }`}
              onClick={() => { setFilterRole(role); setPage(1); }}
            >
              {role === "" ? "Todos" : role === "admin" ? "Admins" : "Usuários"}
            </button>
          ))}
        </div>

        {/* Lista de usuários */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[var(--color-welcome-blue)]" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
                    style={{
                      backgroundColor: user.role === "admin" ? "#7C3AED" : "#2B4B6F",
                    }}
                  >
                    {getInitials(user.nome)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-base font-semibold text-gray-800">
                            {user.nome}
                          </span>
                          {user.role === "admin" && (
                            <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="mt-1 text-xs text-gray-400">
                          {user.telefone || "Sem telefone"}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
                      >
                        <Pencil size={14} /> Editar
                      </button>

                      <button
                        onClick={() => handleRoleToggle(user)}
                        disabled={actionLoading === user.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                          user.role === "admin"
                            ? "border-orange-200 text-orange-700 hover:bg-orange-50"
                            : "border-purple-200 text-purple-700 hover:bg-purple-50"
                        }`}
                      >
                        {actionLoading === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : user.role === "admin" ? (
                          <ShieldOff size={14} />
                        ) : (
                          <Shield size={14} />
                        )}
                        {user.role === "admin" ? "Rebaixar" : "Tornar admin"}
                      </button>

                      <button
                        onClick={() => setDeleteConfirm(user)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className="text-sm font-semibold text-gray-600">
              {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
            >
              Próximo <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-welcome-blue)]">
                Editar usuário
              </h3>
              <button onClick={() => setEditModal(null)} className="rounded-full p-1 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Nome
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  E-mail
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Telefone
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={editForm.telefone}
                  onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSave}
                disabled={actionLoading === editModal.id}
                className="flex-1 rounded-full bg-[var(--color-welcome-blue)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {actionLoading === editModal.id ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">Remover usuário</h3>
            <p className="mt-2 text-sm text-gray-500">
              Tem certeza que deseja remover <strong>{deleteConfirm.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}