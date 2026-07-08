import api from '../../api/client'
import { getApiErrorMessage } from '../http/getApiErrorMessage'

const normalizeProfile = (profile = {}) => ({
  ...profile,
  pontuacao_total: profile.pontuacao_total ?? 0,
  extrato_pontos_resumido: profile.extrato_pontos_resumido ?? [],
  resumo: {
    quantidade_total_inventario: 0,
    total_itens_inventario: 0,
    total_descartes_pendentes: 0,
    ...(profile.resumo || {}),
  },
})

export const getProfile = async () => {
  try {
    const res = await api.get('/me')
    return normalizeProfile(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Não foi possível carregar o perfil.'))
  }
}

export const getCurrentUser = async () => {
  try {
    const res = await api.get('/me')
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Não foi possível carregar os dados do usuário.'))
  }
}

export const updateProfile = async (payload) => {
  try {
    const res = await api.put('/me', {
      nome: payload?.nome || '',
      telefone: payload?.telefone || '',
      email: payload?.email || '',
    })
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Não foi possível salvar as alterações do perfil.'))
  }
}
