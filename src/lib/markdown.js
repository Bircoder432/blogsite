import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'
import DOMPurify from 'dompurify'

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    // Поддерживаем и новый API marked (объект-токен), и старый (строка)
    code(a, b) {
      const isToken = a && typeof a === 'object'
      const text = isToken ? a.text : String(a)
      const lang = ((isToken ? a.lang : b) || '').trim().split(/\s+/)[0] || ''

      let highlighted
      if (lang && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(text, { language: lang, ignoreIllegals: true }).value
      } else {
        highlighted = escapeHtml(text)
      }
      return `<pre><code class="hljs${lang ? ' language-' + lang : ''}">${highlighted}</code></pre>`
    },
  },
})

// Все внешние ссылки открываем в новой вкладке
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function renderMarkdown(source) {
  const raw = marked.parse(source || '')
  return DOMPurify.sanitize(raw, { ADD_ATTR: ['target'] })
}
