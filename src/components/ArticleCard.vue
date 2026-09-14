<script setup>
import { formatDate } from '../lib/format'

defineProps({
  article: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
</script>

<template>
  <RouterLink
    :to="`/blog/${encodeURIComponent(article.slug)}`"
    class="article-card card"
    :style="{ animationDelay: `${Math.min(index, 7) * 55}ms` }"
  >
    <span class="article-card-date"><i class="ri-calendar-line"></i>{{ formatDate(article.date) }}</span>
    <h3 class="article-card-title">{{ article.title }}</h3>
    <p class="article-card-excerpt">{{ article.excerpt }}</p>
    <span class="article-card-more">Читать <i class="ri-arrow-right-line"></i></span>
  </RouterLink>
</template>
