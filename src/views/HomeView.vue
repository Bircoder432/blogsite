<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { site } from '../store'
import { linkIcon } from '../lib/format'
import ArticleCard from '../components/ArticleCard.vue'

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
  <div class="home">
    <section class="hero card">
      <i class="ri-leaf-fill hero-leaf"></i>
      <div class="hero-content">
        <h1 class="hero-title">{{ site.settings?.title || 'Привет!' }}</h1>
        <p class="hero-text">{{ site.settings?.text || '' }}</p>
        <div class="hero-actions">
          <RouterLink to="/blog" class="btn btn-primary btn-lg">
            <i class="ri-article-line"></i> Читать блог
          </RouterLink>
        </div>
      </div>
      <div v-if="site.links.length" class="hero-links">
        <a
          v-for="l in site.links"
          :key="l.id"
          :href="l.url"
          target="_blank"
          rel="noopener"
          class="chip"
          :title="l.url"
        >
          <i :class="linkIcon(l.url)"></i><span>{{ l.name }}</span>
        </a>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="section-title"><i class="ri-flashlight-line"></i> Свежие записи</h2>
        <RouterLink to="/blog" class="link-more">Все статьи <i class="ri-arrow-right-line"></i></RouterLink>
      </div>

      <div v-if="articles === null" class="loading"><i class="ri-loader-4-line"></i></div>
      <div v-else-if="articles.length" class="grid">
        <ArticleCard v-for="(a, i) in articles.slice(0, 4)" :key="a.id" :article="a" :index="i" />
      </div>
      <div v-else class="empty">
        <i class="ri-quill-pen-line"></i>
        <p>Пока нет ни одной статьи. Загляните позже!</p>
      </div>
    </section>
  </div>
</template>
