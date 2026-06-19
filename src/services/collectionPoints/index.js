import api from '../../api/client'

export const listCollectionPoints = async (params = {}) => {
  const res = await api.get('/pontos-coleta', { params })
  return res.data
}
