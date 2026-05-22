import api from '../../api/client'

export const listPoints = async ({ page = 1, perPage = 50, filters = {} } = {}) => {
  const res = await api.get('/maps/points', { params: { page, perPage, ...filters } })
  return res.data
}

export const getPoint = async (id) => {
  const res = await api.get(`/maps/points/${id}`)
  return res.data
}

export const listNearby = async ({ lat, lng, radius = 1000 }) => {
  const res = await api.get('/maps/points/nearby', { params: { lat, lng, radius } })
  return res.data
}

export default { listPoints, getPoint, listNearby }
