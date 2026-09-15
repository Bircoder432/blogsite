
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  ready: { type: Boolean, default: false },
})

const MIN_SHOW = 450
const SAFETY_TIMEOUT = 10000

const visible = ref(!props.ready)
const startedAt = performance.now()
let done = props.ready
let safetyTimer = null

function hide() {
  if (done) return
  done = true
  visible.value = false
  document.body.style.overflow = ''
  if (safetyTimer) {
    clearTimeout(safetyTimer)
    safetyTimer = null
  }
}

if (visible.value) {
  document.body.style.overflow = 'hidden'
}

watch(
  () => props.ready,
  (v) => {
    if (!v) return
    const rest = MIN_SHOW - (performance.now() - startedAt)
    if (rest > 0) setTimeout(hide, rest)
    else hide()
  },
  { immediate: true } // Чтобы не пропустить изменение, если оно случится синхронно
)

safetyTimer = setTimeout(() => {
  if (!props.ready) hide()
}, SAFETY_TIMEOUT)

onBeforeUnmount(() => {
  if (safetyTimer) clearTimeout(safetyTimer)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="splash">
    <div v-if="visible" class="splash">
      <div class="splash-inner">
        <div class="splash-logo"><i class="ri-leaf-fill"></i></div>
        <div class="splash-track"><span class="splash-fill"></span></div>
        <p class="splash-caption">Загружаем сайт…</p>
      </div>
    </div>
  </Transition>
</template>
