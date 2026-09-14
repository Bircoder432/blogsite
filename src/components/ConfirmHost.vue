<script setup>
import { useConfirm } from '../composables/useConfirm'

const { state, accept, cancel } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="state.open" class="modal-backdrop" @click.self="cancel">
        <div class="modal card">
          <div class="modal-icon"><i class="ri-delete-bin-line"></i></div>
          <h3 class="modal-title">{{ state.title }}</h3>
          <p class="modal-text">{{ state.message }}</p>
          <div class="modal-actions">
            <button class="btn" type="button" @click="cancel">Отмена</button>
            <button class="btn btn-danger" type="button" @click="accept">Удалить</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
