<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api'
import { useToast } from '../../composables/useToast'
import { loadSite } from '../../store'

const toast = useToast()
const form = ref({ name: '', title: '', text: '' })
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  try {
    const s = await api('GET', '/settings')
    form.value = { name: s.name || '', title: s.title || '', text: s.text || '' }
  } catch (e) {
    toast.push(e.message, 'error')
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await api('PUT', '/admin/settings', {
      name: form.value.name.trim(),
      title: form.value.title.trim(),
      text: form.value.text,
    })
    await loadSite(true)
    toast.push('Настройки сохранены')
  } catch (e) {
    toast.push(e.message, 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-head">
      <h1><i class="ri-settings-4-line"></i> Настройки сайта</h1>
    </div>

    <div v-if="loading" class="loading"><i class="ri-loader-4-line"></i></div>

    <form v-else class="card settings-card" @submit.prevent="save">
      <div class="field">
        <label for="s-name">Имя / название сайта</label>
        <input id="s-name" v-model="form.name" class="input" />
        <p class="hint">Отображается в шапке и в подвале сайта</p>
      </div>

      <div class="field">
        <label for="s-title">Заголовок на главной</label>
        <input id="s-title" v-model="form.title" class="input" />
        <p class="hint">Крупный текст в блоке приветствия</p>
      </div>

      <div class="field">
        <label for="s-text">Описание</label>
        <textarea id="s-text" v-model="form.text" class="textarea" rows="5"></textarea>
        <p class="hint">Короткий текст о вас — выводится на главной странице</p>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" type="submit" :disabled="saving">
          <i :class="saving ? 'ri-loader-4-line spin' : 'ri-save-3-line'"></i>
          Сохранить
        </button>
      </div>
    </form>
  </div>
</template>
