import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const listUsers = async ({
  page = 1,
  pageSize = 20,
  nome,
  email,
  role,
} = {}) => {
  try {
    const params = { page, page_size: pageSize };
    if (nome) params.nome = nome;
    if (email) params.email = email;
    if (role) params.role = role;

    const res = await api.get("/admin/usuarios", { params });
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao listar usuários"));
  }
};

export const getUserDetails = async (usuarioId) => {
  try {
    const res = await api.get(`/admin/usuarios/${usuarioId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao buscar detalhes do usuário")
    );
  }
};

export const updateUser = async (usuarioId, data) => {
  try {
    const res = await api.patch(`/admin/usuarios/${usuarioId}`, data);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao atualizar usuário"));
  }
};

export const updateUserRole = async (usuarioId, role) => {
  try {
    const res = await api.patch(`/admin/usuarios/${usuarioId}/role`, { role });
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao alterar nível de acesso")
    );
  }
};

export const deleteUser = async (usuarioId) => {
  try {
    await api.delete(`/admin/usuarios/${usuarioId}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao excluir usuário"));
  }
};

export const adjustUserPoints = async (usuarioId, delta, motivo) => {
  try {
    const res = await api.post(`/admin/usuarios/${usuarioId}/ajuste-pontuacao`, { delta, motivo });
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao ajustar pontuacao"));
  }
};

export const getAdminPoints = async () => {
  try {
    const res = await api.get("/admin/metrics/ocupacao-pontos");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao buscar ocupação dos pontos")
    );
  }
};

export const getAdminDashboard = async () => {
  try {
    const res = await api.get("/admin/metrics/resumo");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao buscar resumo do dashboard")
    );
  }
};

export const listPendingCollectionPoints = async () => {
  try {
    const res = await api.get(
      "/admin/solicitacoes-pontos-coleta?status=pendente"
    );
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao buscar pontos pendentes")
    );
  }
};

export const approveCollectionPoint = async (id, observacao = "") => {
  try {
    const res = await api.post(
      `/admin/solicitacoes-pontos-coleta/${id}/aprovar`,
      { observacao }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao aprovar ponto de coleta")
    );
  }
};

export const rejectCollectionPoint = async (id, motivo) => {
  try {
    const res = await api.post(
      `/admin/solicitacoes-pontos-coleta/${id}/rejeitar`,
      { motivo }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Erro ao rejeitar ponto de coleta")
    );
  }
};

export const listCampanhas = async () => {
  try {
    const res = await api.get("/campanhas/admin");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao buscar campanhas"));
  }
};

export const createCampanha = async (payload) => {
  try {
    const res = await api.post("/campanhas", payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao criar campanha"));
  }
};

export const deactivateCollectionPoint = async (id) => {
  try {
    await api.delete(`/admin/pontos-coleta/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao desativar ponto de coleta"));
  }
};

export const updateCampanha = async (id, payload) => {
  try {
    const res = await api.put(`/campanhas/${id}`, payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao atualizar campanha"));
  }
};

export const deleteCampanha = async (id) => {
  try {
    await api.delete(`/campanhas/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao deletar campanha"));
  }
};

export const listAgendas = async () => {
  try {
    const res = await api.get("/admin/agenda");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao buscar agendas"));
  }
};

export const createAgenda = async (payload) => {
  try {
    const res = await api.post("/admin/agenda", payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao agendar coleta"));
  }
};

export const updateAgenda = async (id, payload) => {
  try {
    const res = await api.put(`/admin/agenda/${id}`, payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao atualizar agendamento"));
  }
};

export const deleteAgenda = async (id) => {
  try {
    await api.delete(`/admin/agenda/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao deletar agendamento"));
  }
};

export const listAuditEntries = async () => {
  try {
    const res = await api.get("/admin/auditoria", { params: { page_size: 50 } });
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao carregar auditoria"));
  }
};

export const downloadAdminReport = async (report) => {
  try {
    const res = await api.get(`/admin/relatorios/${report}.csv`, { responseType: "blob" });
    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao gerar relatorio"));
  }
};
