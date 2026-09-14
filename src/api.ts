import { useAuth } from './composables/useAuth'
import { useToast } from './composables/useToast'

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function api(method, path, body) {
  const token = localStorage.getItem('auth_token')

    const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!res.ok) {
    let message = `Ошибка ${res.status}`
    try {
      const data = await res.json()
      if (data && data.error) message = data.error
    } catch {
      /* тело не в формате JSON */
    }
    // Сессия истекла (сервер перезапущен) — сбрасываем токен
    if (res.status === 401 && path.startsWith('/admin')) {
      useAuth().clearToken()
      useToast().push('Сессия истекла, войдите заново', 'error')
    }
    throw new ApiError(message, res.status)
  }

  return res.json()
}
