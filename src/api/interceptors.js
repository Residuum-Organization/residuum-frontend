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
        const r = await api.post('/auth/refresh')
        const { accessToken } = r.data
        if (accessToken) setAccessToken(accessToken)
        processQueue(null, accessToken)
        isRefreshing = false
        // retry original request with new token
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
        return api(originalRequest)
      } catch (e) {
        processQueue(e, null)
        isRefreshing = false
        clearAccessToken()
        return Promise.reject(e)
      }
    }
    return Promise.reject(err)
  }
)
