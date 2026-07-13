import api from '../../api/client'
import { getApiErrorMessage } from '../http/getApiErrorMessage'

export const normalizePoint = (point) => {
  return {
    ...point,
    id: point.id,
    name: point.nome || 'Ponto de coleta',
    address: point.endereco || 'Endereço não informado',
    openingHours: point.horario_funcionamento || 'Horário não informado',
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
    status: String(point.status_calculado || point.status || 'ativo').toLowerCase(),
    statusLabel: point.status_calculado || point.status || 'ativo',
    wasteTypes: Array.isArray(point.tipos_residuos_aceitos) ? point.tipos_residuos_aceitos : [],
    distanceKm: Number(point.distancia_km || 0),
    currentVolumeKg: Number(point.total_inventario || 0),
    capacityKg: Number(point.capacidade_maxima || 0),
    fillPercentage: Number(point.percentual_ocupacao || 0),
  }
}

export const listPoints = async ({ page = 1, perPage = 50, filters = {} } = {}) => {
  try {
    const params = { ...filters }
    const res = await api.get('/pontos-coleta', { params })
    const dataList = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : []

    return dataList
      .map(normalizePoint)
      .filter((point) => point.id && Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível listar os pontos de coleta."))
  }
}

export const getPoint = async (id) => {
  try {
    const res = await api.get(`/pontos-coleta/${id}`)
    return normalizePoint(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível buscar os dados do ponto de coleta."))
  }
}

export const listNearby = async ({ lat, lng, radius = 1000 }) => {
  try {
    const res = await api.get('/maps/points/nearby', { params: { lat, lng, radius } })
    const dataList = Array.isArray(res.data) ? res.data : []
    return dataList.map(normalizePoint)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível buscar pontos próximos."))
  }
}

export default { listPoints, getPoint, listNearby }
