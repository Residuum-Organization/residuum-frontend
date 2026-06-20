const ACCESS_TOKEN_STORAGE_KEY = 'residuum:access-token'

const readStoredToken = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  } catch (_error) {
    return null
  }
}

let accessToken = readStoredToken()

export const setAccessToken = (token) => {
  accessToken = token

  if (typeof window === 'undefined') {
    return
  }

  try {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
      return
    }

    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  } catch (_error) {
    // ignore storage failures and keep in-memory token
  }
}

export const getAccessToken = () => accessToken

export const clearAccessToken = () => {
  setAccessToken(null)
}
