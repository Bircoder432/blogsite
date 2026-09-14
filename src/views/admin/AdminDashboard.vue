<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../api'
import { formatDate, plural } from '../../lib/format'

const articles = ref([])
const links = ref([])
const loaded = ref(false)

onMounted(async () => {
  const [a, l] = await Promise.all([
    api('GET', '/articles').catch(() => []),
    api('GET', '/links').catch(() => []),
  ])
  articles.value = a || []
  links.value = l || []
  loaded.value = true
})

const recent = computed(() => articles.value.slice(0, 5))
const editLink = (a) => `/apanel/articles/edit/${encodeURIComponent(a.slug)}`
</script>

<template>
  <div class="admin-page">
    <div class="admin-head">
      <h1><i class="ri-dashboard-2-line"></i> Дашборд</h1>
    </div>

    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-icon"><i class="ri-article-line"></i></div>
        <div>
          <div class="stat-value">{{ articles.length }}</div>
          <div class="stat-label">{{ plural(articles.length, ['статья', 'статьи', 'статей']) }}</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon"><i class="ri-links-line"></i></div>
        <div>
          <div class="stat-value">{{ links.length }}</div>
          <div class="stat-label">{{ plural(links.length, ['ссылка', 'ссылки', 'ссылок']) }}</div>
        </div>
      </div>
    </div>

    <div class="quick-grid">
      <RouterLink class="quick-card card" to="/apanel/articles/new">
        <i class="ri-quill-pen-line"></i><span>Написать статью</span>
      </RouterLink>
      <RouterLink class="quick-card card" to="/apanel/articles">
        <i class="ri-file-list-3-line"></i><span>Управление статьями</span>
      </RouterLink>
      <RouterLink class="quick-card card" to="/apanel/links">
        <i class="ri-links-line"></i><span>Ссылки</span>
      </RouterLink>
      <RouterLink class="quick-card card" to="/apanel/settings">
        <i class="ri-settings-4-line"></i><span>Настройки сайта</span>
      </RouterLink>
    </div>

    <div class="card">
      <div class="card-head">
        <span><i class="ri-history-line"></i> Последние статьи</span>
        <RouterLink to="/apanel/articles" class="link-more">Все статьи <i class="ri-arrow-right-line"></i></RouterLink>
      </div>

      <div v-if="!loaded" class="loading"><i class="ri-loader-4-line"></i></div>

      <div v-else-if="recent.length" class="simple-list">
        <div v-for="a in recent" :key="a.id" class="simple-row">
          <div class="row-main">
            <RouterLink class="table-title" :to="editLink(a)">{{ a.title }}</RouterLink>
            <span class="table-sub">{{ formatDate(a.date) }} · /blog/{{ a.slug }}</span>
          </div>
          <RouterLink class="act-btn" :to="editLink(a)" title="Редактировать">
            <i class="ri-edit-line"></i>
          </RouterLink>
        </div>
      </div>

      <div v-else class="empty empty-flat">
        <i class="ri-file-list-3-line"></i>
        <p>Статей пока нет. Напишите первую!</p>
      </div>
    </div>
  </div>
</template>
