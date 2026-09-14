<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'
import { renderMarkdown } from '../lib/markdown'
import { formatDate, readingTime } from '../lib/format'

const route = useRoute()
const article = ref(null)
const loading = ref(true)
const notFound = ref(false)
const contentEl = ref(null)

const html = computed(() => renderMarkdown(article.value?.content || ''))

onMounted(load)

async function load() {
  loading.value = true
  notFound.value = false
  article.value = null
  try {
    article.value = await api('GET', `/articles/${encodeURIComponent(route.params.slug)}`)
    document.title = `${article.value.title} — Блог`
  } catch (e) {
    if (e.status === 404) notFound.value = true
  } finally {
    loading.value = false
  }
  await nextTick()
  if (contentEl.value) enhanceContent(contentEl.value)
}

// Облагораживаем отрендеренный markdown: кнопка «копировать» у кода, lazy-картинки, скролл таблиц
function enhanceContent(root) {
  root.querySelectorAll('pre > code').forEach((code) => {
    if (code.closest('.code-block')) return
    const pre = code.parentElement
    const lang = (code.className.match(/language-([\w#+.-]+)/) || [])[1]

    const wrap = document.createElement('div')
    wrap.className = 'code-block'
    pre.replaceWith(wrap)

    const head = document.createElement('div')
    head.className = 'code-head'
    const label = document.createElement('span')
    label.className = 'code-lang'
    label.textContent = lang || 'code'

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'code-copy'
    btn.innerHTML = '<i class="ri-file-copy-line"></i><span>Копировать</span>'
    head.append(label, btn)
    wrap.append(head, pre)

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent)
        btn.classList.add('copied')
        btn.innerHTML = '<i class="ri-check-line"></i><span>Скопировано</span>'
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = '<i class="ri-file-copy-line"></i><span>Копировать</span>'
        }, 1800)
      } catch {
        /* нет доступа к буферу обмена */
      }
    })
  })

  root.querySelectorAll('img').forEach((img) => {
    img.loading = 'lazy'
    img.decoding = 'async'
  })

  root.querySelectorAll('table').forEach((table) => {
    if (table.parentElement.classList.contains('table-wrap')) return
    const wrap = document.createElement('div')
    wrap.className = 'table-wrap'
    table.replaceWith(wrap)
    wrap.append(table)
  })
}
</script>

<template>
  <div class="article-page">
    <div v-if="loading" class="loading"><i class="ri-loader-4-line"></i></div>

    <div v-else-if="notFound" class="empty">
      <i class="ri-file-search-line"></i>
      <p>Статья не найдена. Возможно, она была удалена или перемещена.</p>
      <RouterLink to="/blog" class="btn btn-primary"><i class="ri-arrow-left-line"></i> Ко всем статьям</RouterLink>
    </div>

    <article v-else-if="article">
      <RouterLink to="/blog" class="backlink"><i class="ri-arrow-left-line"></i> Все статьи</RouterLink>
      <header class="article-head">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span><i class="ri-calendar-line"></i>{{ formatDate(article.date) }}</span>
          <span><i class="ri-time-line"></i>{{ readingTime(article.content) }} мин чтения</span>
        </div>
      </header>
      <div ref="contentEl" class="markdown" v-html="html"></div>
    </article>
  </div>
</template>
