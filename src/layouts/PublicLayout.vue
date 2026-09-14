<script setup>
import { watchEffect } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { site, loadSite } from '../store'

loadSite()

watchEffect(() => {
  if (site.settings?.name) document.title = site.settings.name
})
</script>

<template>
  <div class="public-layout">
    <AppHeader />
    <main class="container main">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
