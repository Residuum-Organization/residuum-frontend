import api from '../../api/client'

export const getProfile = async () => {
  const res = await api.get('/users/me')
  return res.data
}

export const updateProfile = async (payload) => {
  const res = await api.put('/users/me', payload)
  return res.data
}
