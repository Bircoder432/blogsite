const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

function parseDate(value) {
  if (!value) return null
  const d = new Date(String(value).trim().replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(value) {
  const d = parseDate(value)
  if (!d) return value || ''
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function dateParts(value) {
  const d = parseDate(value)
  if (!d) return { day: '', month: '', year: '' }
  return {
    day: String(d.getDate()),
    month: MONTHS_SHORT[d.getMonth()],
    year: String(d.getFullYear()),
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export function nowLocalInput() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// "2024-05-01 10:30" -> значение для input[type=datetime-local]
export function toLocalInput(value) {
  if (!value) return ''
  let s = String(value).trim().replace(' ', 'T')
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += 'T00:00'
  const d = parseDate(s)
  if (!d) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// значение datetime-local -> "2024-05-01 10:30" для БД
export function fromLocalInput(value) {
  return (value || '').replace('T', ' ')
}

export function readingTime(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 160))
}

export function plural(n, forms) {
  n = Math.abs(n) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return forms[2]
  if (n1 > 1 && n1 < 5) return forms[1]
  if (n1 === 1) return forms[0]
  return forms[2]
}

const SLUG_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}

export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .split('')
    .map((ch) => (SLUG_MAP[ch] !== undefined ? SLUG_MAP[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

// Подбираем иконку по домену ссылки
export function linkIcon(url) {
  const u = (url || '').toLowerCase()
  if (u.includes('github')) return 'ri-github-fill'
  if (u.includes('t.me') || u.includes('telegram')) return 'ri-telegram-fill'
  if (u.includes('vk.com')) return 'ri-vk-fill'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'ri-youtube-fill'
  if (u.includes('twitter.com') || u.includes('x.com')) return 'ri-twitter-x-fill'
  if (u.includes('linkedin')) return 'ri-linkedin-box-fill'
  if (u.includes('instagram')) return 'ri-instagram-line'
  if (u.includes('facebook')) return 'ri-facebook-fill'
  if (u.includes('gitlab')) return 'ri-gitlab-fill'
  if (u.includes('discord')) return 'ri-discord-fill'
  if (u.includes('mailto:') || u.includes('gmail')) return 'ri-mail-fill'
  if (u.includes('rss')) return 'ri-rss-fill'
  return 'ri-link'
}
