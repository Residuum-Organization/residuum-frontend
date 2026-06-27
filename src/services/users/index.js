import api from '../../api/client'
import { getApiErrorMessage } from '../http/getApiErrorMessage'

export const getProfile = async () => {
  try {
    const res = await api.get('/perfil')
    return res.data
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
    const res = await api.put('/me', payload)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Não foi possível salvar as alterações do perfil.'))
  }
}
