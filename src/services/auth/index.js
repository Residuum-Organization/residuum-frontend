import api from '../../api/client'
import { getAccessToken } from '../../api/token'

const getMeWithToken = async (accessToken) => {
  const res = await api.get('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return res.data
}

export const login = async (email, password) => {
  const res = await api.post('/login', { email, senha: password })
  const accessToken = res.data?.access_token
  const user = accessToken ? await getMeWithToken(accessToken) : null

  return {
    accessToken,
    user,
    usuarioId: res.data?.usuario_id,
    tokenType: res.data?.token_type,
  }
}

export const logout = async () => {
  return null
}

export const refresh = async () => {
  const accessToken = getAccessToken()

  if (!accessToken) {
    throw new Error('Sem sessão ativa')
  }

  const user = await getMeWithToken(accessToken)

  return {
    accessToken,
    user,
  }
}
