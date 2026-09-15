import { reactive, ref } from 'vue'
import { api } from './api'

export const site = reactive({
  settings: null,
  links: [],
})

export const appReady = ref(false)

let inflight = null

export function loadSite(force = false) {
  if (!force && site.settings) return Promise.resolve()
  if (!force && inflight) return inflight

  const run = (async () => {
    try {
      const [settings, links] = await Promise.all([
        api('GET', '/settings').catch(() => null),
        api('GET', '/links').catch(() => []),
      ])
      site.settings = settings
      site.links = links || []
    } finally {
      if (!force) inflight = null
      appReady.value = true
    }
  })()

  if (!force) inflight = run
  return run
}
