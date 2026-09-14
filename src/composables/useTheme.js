import { ref } from 'vue'

function initialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref(initialTheme())

function apply() {
  document.documentElement.dataset.theme = theme.value
}
apply()

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    apply()
  }
  return { theme, toggle }
}
