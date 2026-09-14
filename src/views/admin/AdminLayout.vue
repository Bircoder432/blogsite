<script setup>
import { onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import AdminLogin from './AdminLogin.vue'

const { isAuthed, clearToken } = useAuth()

onMounted(() => {
  document.title = 'Панель управления'
})
</script>

<template>
  <AdminLogin v-if="!isAuthed" />

  <div v-else class="admin">
    <aside class="admin-sidebar">
      <RouterLink to="/apanel" class="admin-brand">
        <span class="brand-mark"><i class="ri-leaf-line"></i></span>
        <span>Панель управления</span>
      </RouterLink>

      <nav class="admin-nav">
        <RouterLink to="/apanel" class="admin-nav-link" exact-active-class="active">
          <i class="ri-dashboard-2-line"></i><span>Дашборд</span>
        </RouterLink>
        <RouterLink to="/apanel/articles" class="admin-nav-link" active-class="active">
          <i class="ri-article-line"></i><span>Статьи</span>
        </RouterLink>
        <RouterLink to="/apanel/links" class="admin-nav-link" active-class="active">
          <i class="ri-links-line"></i><span>Ссылки</span>
        </RouterLink>
        <RouterLink to="/apanel/settings" class="admin-nav-link" active-class="active">
          <i class="ri-settings-4-line"></i><span>Настройки</span>
        </RouterLink>
      </nav>

      <div class="admin-sidebar-footer">
        <RouterLink to="/" class="admin-nav-link"><i class="ri-external-link-line"></i><span>На сайт</span></RouterLink>
        <button type="button" class="admin-nav-link" @click="clearToken">
          <i class="ri-logout-box-r-line"></i><span>Выйти</span>
        </button>
      </div>
    </aside>

    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>
