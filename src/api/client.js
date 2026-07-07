import axios from 'axios'
import { getAccessToken } from './token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080',
  withCredentials: false,
})

// Request interceptor: attach access token from in-memory token service
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
