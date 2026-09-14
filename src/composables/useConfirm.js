import { reactive } from 'vue'

const state = reactive({ open: false, title: '', message: '', _resolve: null })

export function useConfirm() {
  function confirm(title, message = '') {
    state.title = title
    state.message = message
    state.open = true
    return new Promise((resolve) => {
      state._resolve = resolve
    })
  }

  function accept() {
    state.open = false
    state._resolve?.(true)
  }

  function cancel() {
    state.open = false
    state._resolve?.(false)
  }

  return { state, confirm, accept, cancel }
}
