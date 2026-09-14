<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../api'
import { formatDate } from '../../lib/format'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const toast = useToast()
const { confirm } = useConfirm()

const articles = ref(null)
const query = ref('')

onMounted(load)

async function load() {
  try {
    articles.value = (await api('GET', '/articles')) || []
  } catch (e) {
    articles.value = []
    toast.push(e.message, 'error')
  }
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return articles.value || []
  return (articles.value || []).filter(
    (a) => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q)
  )
})

const editLink = (a) => `/apanel/articles/edit/${encodeURIComponent(a.slug)}`

async function remove(article) {
  const ok = await confirm('Удалить статью?', `«${article.title}» будет удалена безвозвратно.`)
  if (!ok) return
  try {
    await api('DELETE', `/admin/articles/${article.id}`)
    articles.value = articles.value.filter((a) => a.id !== article.id)
    toast.push('Статья удалена')
  } catch (e) {
    toast.push(e.message, 'error')
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-head">
      <h1><i class="ri-article-line"></i> Статьи</h1>
      <div class="spacer"></div>
      <div class="search">
        <i class="ri-search-line"></i>
        <input v-model="query" class="input" placeholder="Поиск…" />
      </div>
      <RouterLink to="/apanel/articles/new" class="btn btn-primary">
        <i class="ri-add-line"></i> Новая статья
      </RouterLink>
    </div>

    <div v-if="articles === null" class="loading"><i class="ri-loader-4-line"></i></div>

    <div v-else-if="!articles.length" class="empty">
      <i class="ri-file-list-3-line"></i>
      <p>Статей пока нет.</p>
      <RouterLink to="/apanel/articles/new" class="btn btn-primary">
        <i class="ri-quill-pen-line"></i> Написать первую
      </RouterLink>
    </div>

    <div v-else-if="!filtered.length" class="empty">
      <i class="ri-search-eye-line"></i>
      <p>По запросу ничего не найдено.</p>
    </div>

    <div v-else class="card card-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>Статья</th>
            <th class="th-date">Дата</th>
            <th class="th-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in filtered" :key="a.id">
            <td>
              <RouterLink :to="editLink(a)" class="table-title">{{ a.title }}</RouterLink>
              <div class="table-sub">/blog/{{ a.slug }}</div>
            </td>
            <td class="table-date">{{ formatDate(a.date) }}</td>
            <td>
              <div class="row-actions">
                <a
                  class="act-btn"
                  :href="`/blog/${encodeURIComponent(a.slug)}`"
                  target="_blank"
                  rel="noopener"
                  title="Открыть на сайте"
                >
                  <i class="ri-external-link-line"></i>
                </a>
                <RouterLink class="act-btn" :to="editLink(a)" title="Редактировать">
                  <i class="ri-edit-line"></i>
                </RouterLink>
                <button class="act-btn danger" type="button" title="Удалить" @click="remove(a)">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
