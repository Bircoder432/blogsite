<script setup>
import { onMounted } from 'vue'
import ToastHost from './components/ToastHost.vue'
import ConfirmHost from './components/ConfirmHost.vue'
import SplashScreen from './components/SplashScreen.vue'
import { appReady, loadSite } from './store'

onMounted(() => {
  loadSite()
})
</script>

<template>
  <RouterView />
  <ToastHost />
  <ConfirmHost />
  <SplashScreen :ready="appReady" />
</template>
