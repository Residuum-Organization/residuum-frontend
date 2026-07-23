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

export const listOperationalCollectionPoints = async () => {
  try {
    const res = await api.get('/cooperativa/pontos-coleta')
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel listar os pontos da operacao."))
  }
}

export const updateOperationalCollectionPoint = async (pointId, payload) => {
  try {
    const res = await api.put(`/pontos-coleta/${pointId}`, payload)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel atualizar o ponto."))
  }
}

export const updatePointHours = async (pointId, payload) => {
  try {
    const res = await api.put(`/pontos-coleta/${pointId}/horarios`, payload)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível atualizar os horários."))
  }
}

export const registrarPesagemAvulsa = async (payload) => {
  try {
    const res = await api.post('/cooperativa/lancamento-avulso', payload)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível registrar a pesagem."))
  }
}
