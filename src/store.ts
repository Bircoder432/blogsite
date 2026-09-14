import { reactive } from 'vue'
import { api } from './api'

// Общие данные сайта (шапка, футер, главная)
export const site = reactive({
  settings: null,
  links: [],
})

export async function loadSite(force = false) {
  if (!force && site.settings) return
  const [settings, links] = await Promise.all([
    api('GET', '/settings').catch(() => null),
    api('GET', '/links').catch(() => []),
  ])
  site.settings = settings
  site.links = links || []
}
