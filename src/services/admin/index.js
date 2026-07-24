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

export const downloadAdminReportPDF = async (report, title) => {
  try {
    const res = await api.get(`/admin/relatorios/${report}.csv`, { responseType: "blob" });
    const text = await res.data.text();
    
    // Parse CSV
    const result = [];
    let row = [];
    let inQuotes = false;
    let currentVal = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < text.length && text[i + 1] === '"') {
            currentVal += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          currentVal += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(currentVal);
          currentVal = '';
        } else if (char === '\n') {
          row.push(currentVal);
          result.push(row);
          row = [];
          currentVal = '';
        } else if (char === '\r') {
          // ignore
        } else {
          currentVal += char;
        }
      }
    }
    if (row.length > 0 || currentVal) {
      row.push(currentVal);
      result.push(row);
    }

    const filtered = result.filter(r => r.length > 1);
    if (filtered.length < 1) return;

    let head = filtered[0];
    let body = filtered.slice(1);

    // Humanize headers and data for non-dev admins
    if (report === 'usuarios') {
      head = ['ID', 'Nome Completo', 'E-mail', 'Telefone', 'Perfil de Acesso', 'Pontuação Total'];
      body = body.map(row => {
        const [id, nome, email, telefone, role, pts] = row;
        const roleLabel = role === 'admin' ? 'Administrador' : role === 'cooperativa' ? 'Cooperativa' : 'Usuário / Morador';
        return [id, nome, email, telefone, roleLabel, pts];
      });
    } else if (report === 'auditoria') {
      head = ['Data e Hora', 'Ação Realizada', 'ID do Alvo', 'Motivo', 'Detalhes Técnicos'];
      body = body.map(row => {
        // CSV original: id, admin_id, action, target_type, target_id, motivo, payload, created_at
        const [id, admin_id, action, target_type, target_id, motivo, payload, created_at] = row;
        
        // Formatar a data
        let dateFormatted = created_at;
        try {
          dateFormatted = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(created_at));
        } catch(e) {}
        
        // Traduzir a ação
        const acoes = {
          'usuario.atualizar': 'Atualizou cadastro de usuário',
          'usuario.alterar_role': 'Alterou permissão de acesso',
          'usuario.ajuste_pontuacao': 'Ajustou saldo de pontos',
          'usuario.remover': 'Removeu usuário',
          'descarte.reverter': 'Reverteu descarte de morador',
          'descarte.rejeitar': 'Rejeitou descarte de morador',
          'ponto_coleta.desativar': 'Desativou ponto de coleta',
          'solicitacao_ponto_coleta.aprovar': 'Aprovou novo ponto de coleta',
          'solicitacao_ponto_coleta.rejeitar': 'Rejeitou novo ponto de coleta',
          'sorteio.apurar': 'Apurou resultado de sorteio'
        };
        const actionLabel = acoes[action] || action;

        return [dateFormatted, actionLabel, `${target_type} #${target_id}`, motivo || '-', payload];
      });
    } else if (report === 'descartes') {
      head = ['Data', 'Morador (ID)', 'Ponto de Coleta (ID)', 'Material', 'Qtd Estimada', 'Qtd Final', 'Status'];
      body = body.map(row => {
        // Backend CSV: id_descarte, data_desc, status, tipo_residuo, quantidade, quantidade_confirmada, usuario_id, ponto_coleta_id
        const [id, dataDesc, status, tipo, qtdEst, qtdConf, uId, pId] = row;
        
        let dateFormatted = dataDesc;
        try {
          dateFormatted = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(dataDesc));
        } catch(e) {}
        
        const statusLabel = status === 'confirmado' ? 'Confirmado' : status === 'pendente' ? 'Pendente' : status === 'revertido' ? 'Revertido' : 'Rejeitado';
        const matLabel = tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : '-';
        return [dateFormatted, `#${uId || '-'}`, `#${pId || '-'}`, matLabel, qtdEst || '0', qtdConf || '-', statusLabel];
      });
    }

    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(18);
    doc.text(`Relatório - ${title}`, 14, 22);
    
    autoTable(doc, {
      startY: 30,
      head: [head],
      body: body,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 44, 113] } // #1A2C71
    });

    doc.save(`${report}.pdf`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao gerar relatorio PDF"));
  }
};
