import api from '../../api/client'

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export const logout = async () => {
  const res = await api.post('/auth/logout')
  return res.data
}

export const refresh = async () => {
  const res = await api.post('/auth/refresh')
  return res.data
}
