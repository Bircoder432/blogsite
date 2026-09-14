import { computed, ref } from 'vue'

const TOKEN_KEY = 'auth_token'
const token = ref(localStorage.getItem(TOKEN_KEY) || '')

export function useAuth() {
  const isAuthed = computed(() => token.value !== '')

  function setToken(value) {
    token.value = value
    localStorage.setItem(TOKEN_KEY, value)
  }

  function clearToken() {
    token.value = ''
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, isAuthed, setToken, clearToken }
}
