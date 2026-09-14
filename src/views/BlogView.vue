<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { formatDate, dateParts, plural } from '../lib/format'

const articles = ref(null)

onMounted(async () => {
  try {
    articles.value = (await api('GET', '/articles')) || []
  } catch {
    articles.value = []
  }
})
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1 class="page-title"><i class="ri-article-line"></i> Блог</h1>
      <p v-if="articles" class="page-sub">
        {{ articles.length }} {{ plural(articles.length, ['статья', 'статьи', 'статей']) }}
      </p>
    </header>

    <div v-if="articles === null" class="loading"><i class="ri-loader-4-line"></i></div>

    <div v-else-if="articles.length" class="post-list">
      <RouterLink
        v-for="(a, i) in articles"
        :key="a.id"
        :to="`/blog/${encodeURIComponent(a.slug)}`"
        class="post-row card"
        :style="{ animationDelay: `${Math.min(i, 8) * 45}ms` }"
      >
        <div class="post-date-badge">
          <b>{{ dateParts(a.date).day }}</b>
          <span>{{ dateParts(a.date).month }}</span>
        </div>
        <div class="post-main">
          <h2 class="post-title">{{ a.title }}</h2>
          <p class="post-excerpt">{{ a.excerpt }}</p>
          <span class="post-date-inline">{{ formatDate(a.date) }}</span>
        </div>
        <i class="ri-arrow-right-up-line post-arrow"></i>
      </RouterLink>
    </div>

    <div v-else class="empty">
      <i class="ri-quill-pen-line"></i>
      <p>Здесь пока пусто — ни одна статья ещё не написана.</p>
    </div>
  </div>
</template>
