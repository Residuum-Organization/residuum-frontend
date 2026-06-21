import api from '../../api/client'

const pickList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.pontos)) return payload.pontos
  return []
}

const normalizeWasteTypes = (point) => {
  const values =
    point.wasteTypes ||
    point.tipos_residuos_aceitos ||
    point.tiposResiduosAceitos ||
    point.residuos_aceitos ||
    point.residuosAceitos ||
    []

  if (Array.isArray(values)) return values.filter(Boolean)
  if (typeof values === 'string') return values.split(',').map((type) => type.trim()).filter(Boolean)
  return []
}

export const normalizePoint = (point = {}) => {
  const latitude = Number(point.latitude ?? point.lat ?? point.usuario_lat ?? point.coordenadas?.lat)
  const longitude = Number(
    point.longitude ?? point.lng ?? point.long ?? point.usuario_long ?? point.coordenadas?.lng ?? point.coordenadas?.long
  )

  return {
    ...point,
    id: point.id ?? point._id ?? point.uuid,
    name: point.name ?? point.nome ?? point.razao_social ?? 'Ponto de coleta',
    address: point.address ?? point.endereco ?? point.logradouro ?? 'Endereço não informado',
    openingHours: point.openingHours ?? point.horario_funcionamento ?? point.funcionamento ?? 'Horário não informado',
    latitude,
    longitude,
    status: String(point.status ?? point.situacao ?? 'ativo').toLowerCase(),
    statusLabel: point.statusLabel ?? point.status_label ?? point.situacao_label,
    wasteTypes: normalizeWasteTypes(point),
    distanceKm: Number(point.distanceKm ?? point.distancia_km ?? point.distanciaKm ?? 0),
    currentVolumeKg: Number(point.currentVolumeKg ?? point.quantidade_atual_kg ?? point.volume_atual_kg ?? point.current_volume_kg ?? 0),
    capacityKg: Number(point.capacityKg ?? point.capacidade_kg ?? point.capacity_kg ?? 0),
    fillPercentage: Number(point.fillPercentage ?? point.nivel_ocupacao ?? point.percentual_ocupacao ?? point.fill_percentage ?? 0),
  }
}

export const listPoints = async ({ page = 1, perPage = 50, filters = {} } = {}) => {
  const params = { ...filters }

  if (params.lng) {
    params.long = params.lng
    delete params.lng
  }

  const res = await api.get('/pontos-coleta', { params })

  return pickList(res.data)
    .map(normalizePoint)
    .filter((point) => point.id && Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
}

export const getPoint = async (id) => {
  const res = await api.get(`/pontos-coleta/${id}`)
  return normalizePoint(res.data?.data ?? res.data)
}

export const listNearby = async ({ lat, lng, radius = 1000 }) => {
  const res = await api.get('/maps/points/nearby', { params: { lat, lng, radius } })
  return pickList(res.data).map(normalizePoint)
}

export default { listPoints, getPoint, listNearby }
