import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('./layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('./views/HomeView.vue') },
        { path: 'blog', name: 'blog', component: () => import('./views/BlogView.vue') },
        { path: 'blog/:slug', name: 'article', component: () => import('./views/ArticleView.vue') },
        { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFoundView.vue') },
      ],
    },
    {
      // Скрытая админка — на публичных страницах ссылок на неё нет
      path: '/apanel',
      component: () => import('./views/admin/AdminLayout.vue'),
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('./views/admin/AdminDashboard.vue') },
        { path: 'articles', name: 'admin-articles', component: () => import('./views/admin/AdminArticles.vue') },
        { path: 'articles/new', name: 'admin-article-new', component: () => import('./views/admin/AdminArticleEdit.vue') },
        { path: 'articles/edit/:slug', name: 'admin-article-edit', component: () => import('./views/admin/AdminArticleEdit.vue') },
        { path: 'links', name: 'admin-links', component: () => import('./views/admin/AdminLinks.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('./views/admin/AdminSettings.vue') },
      ],
    },
  ],
})

export default router
