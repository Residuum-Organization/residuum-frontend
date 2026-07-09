import api from '../../api/client'
import { getApiErrorMessage } from '../http/getApiErrorMessage'

export const listUsers = async ({ page = 1, pageSize = 20, nome, email, role } = {}) => {
  try {
    const params = { page, page_size: pageSize }
    if (nome) params.nome = nome
    if (email) params.email = email
    if (role) params.role = role

    const res = await api.get('/admin/usuarios', { params })
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao listar usuários'))
  }
}

export const getUserDetails = async (usuarioId) => {
  try {
    const res = await api.get(`/admin/usuarios/${usuarioId}`)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao buscar detalhes do usuário'))
  }
}

export const updateUser = async (usuarioId, data) => {
  try {
    const res = await api.patch(`/admin/usuarios/${usuarioId}`, data)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao atualizar usuário'))
  }
}

export const updateUserRole = async (usuarioId, role) => {
  try {
    const res = await api.patch(`/admin/usuarios/${usuarioId}/role`, { role })
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao alterar nível de acesso'))
  }
}

export const deleteUser = async (usuarioId) => {
  try {
    await api.delete(`/admin/usuarios/${usuarioId}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao excluir usuário'))
  }
}

export const getAdminPoints = async () => {
  try {
    const res = await api.get('/admin/metrics/ocupacao-pontos')
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao buscar ocupação dos pontos'))
  }
}

export const getAdminDashboard = async () => {
  try {
    const res = await api.get('/admin/metrics/resumo')
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Erro ao buscar resumo do dashboard'))
  }
}