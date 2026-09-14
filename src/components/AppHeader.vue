<script setup>
import { site } from '../store'
import { useTheme } from '../composables/useTheme'

const { theme, toggle } = useTheme()
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark"><i class="ri-leaf-line"></i></span>
        <span class="brand-name">{{ site.settings?.name || 'Блог' }}</span>
      </RouterLink>

      <nav class="nav">
        <RouterLink to="/" class="nav-link" exact-active-class="active">
          <i class="ri-home-4-line"></i><span>Главная</span>
        </RouterLink>
        <RouterLink to="/blog" class="nav-link" active-class="active">
          <i class="ri-article-line"></i><span>Блог</span>
        </RouterLink>
      </nav>

      <button
        class="icon-btn"
        type="button"
        :title="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
        @click="toggle"
      >
        <i :class="theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'"></i>
      </button>
    </div>
  </header>
</template>
