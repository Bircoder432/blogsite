<script setup>
import { useToast } from '../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toasts">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type" @click="dismiss(t.id)">
        <i :class="t.type === 'error' ? 'ri-error-warning-fill' : 'ri-checkbox-circle-fill'"></i>
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
