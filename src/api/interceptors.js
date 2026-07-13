import api from './client'
import { setAccessToken, clearAccessToken } from './token'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch(e => Promise.reject(e))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { getRefreshToken, setRefreshToken } = require('./token')
        const r = await api.post('/auth/refresh', { refresh_token: getRefreshToken() })
        const { access_token, refresh_token } = r.data
        if (access_token) setAccessToken(access_token)
        if (refresh_token) setRefreshToken(refresh_token)
        processQueue(null, access_token)
        isRefreshing = false
        // retry original request with new token
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token
        return api(originalRequest)
      } catch (e) {
        processQueue(e, null)
        isRefreshing = false
        clearAccessToken()
        const { clearRefreshToken } = require('./token')
        clearRefreshToken()
        return Promise.reject(e)
      }
    }
    return Promise.reject(err)
  }
)
