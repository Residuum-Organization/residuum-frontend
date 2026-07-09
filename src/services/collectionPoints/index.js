import api from '../../api/client'
import { getApiErrorMessage } from '../http/getApiErrorMessage'

export const listCollectionPoints = async (params = {}) => {
  try {
    const res = await api.get('/pontos-coleta', { params })
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível listar os pontos de coleta."))
  }
}
