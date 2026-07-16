import axios from 'axios'

export function getApiErrorMessage(error, fallbackMessage = 'Não foi possível concluir a operação.') {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail

    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg).filter(Boolean).join(', ') || fallbackMessage
    }

    if (typeof detail === 'string' && detail.trim()) {
      return detail
    }

    if (error.request && !error.response) {
      return 'Não foi possível conectar à API. Verifique se o servidor está disponível e tente novamente.'
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
