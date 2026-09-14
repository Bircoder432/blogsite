<script setup>
import { site } from '../store'
import { linkIcon } from '../lib/format'
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <span class="footer-copy">
        <i class="ri-leaf-line"></i>
        {{ new Date().getFullYear() }} · {{ site.settings?.name || 'Блог' }}
      </span>
      <nav v-if="site.links.length" class="footer-links">
        <a
          v-for="l in site.links"
          :key="l.id"
          :href="l.url"
          target="_blank"
          rel="noopener"
          class="footer-link"
          :title="l.name"
        >
          <i :class="linkIcon(l.url)"></i>
        </a>
      </nav>
    </div>
  </footer>
</template>
