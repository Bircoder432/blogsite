import { reactive } from 'vue'

const toasts = reactive([])
let uid = 0

export function useToast() {
  function push(message, type = 'success', timeout = 3500) {
    const id = ++uid
    toasts.push({ id, message, type })
    setTimeout(() => dismiss(id), timeout)
  }

  function dismiss(id) {
    const i = toasts.findIndex((t) => t.id === id)
    if (i !== -1) toasts.splice(i, 1)
  }

  return { toasts, push, dismiss }
}
