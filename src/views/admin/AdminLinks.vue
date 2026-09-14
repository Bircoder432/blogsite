<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api'
import { linkIcon } from '../../lib/format'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import { loadSite } from '../../store'

const toast = useToast()
const { confirm } = useConfirm()

const links = ref(null)
const busy = ref(false)
const newLink = ref({ name: '', url: '' })
const editingId = ref(null)
const draft = ref({ name: '', url: '' })

onMounted(load)

async function load() {
  try {
    links.value = (await api('GET', '/links')) || []
  } catch (e) {
    links.value = []
    toast.push(e.message, 'error')
  }
}

async function add() {
  const name = newLink.value.name.trim()
  const url = newLink.value.url.trim()
  if (!name || !url) {
    toast.push('Заполните название и адрес ссылки', 'error')
    return
  }
  busy.value = true
  try {
    await api('POST', '/admin/links', { name, url })
    newLink.value = { name: '', url: '' }
    await Promise.all([load(), loadSite(true)])
    toast.push('Ссылка добавлена')
  } catch (e) {
    toast.push(e.message, 'error')
  } finally {
    busy.value = false
  }
}

function startEdit(link) {
  editingId.value = link.id
  draft.value = { name: link.name, url: link.url }
}

async function saveEdit() {
  if (!draft.value.name.trim() || !draft.value.url.trim()) {
    toast.push('Поля не могут быть пустыми', 'error')
    return
  }
  try {
    await api('PUT', `/admin/links/${editingId.value}`, {
      name: draft.value.name.trim(),
      url: draft.value.url.trim(),
    })
    editingId.value = null
    await Promise.all([load(), loadSite(true)])
    toast.push('Ссылка обновлена')
  } catch (e) {
    toast.push(e.message, 'error')
  }
}

async function remove(link) {
  const ok = await confirm('Удалить ссылку?', `Ссылка «${link.name}» будет удалена.`)
  if (!ok) return
  try {
    await api('DELETE', `/admin/links/${link.id}`)
    await Promise.all([load(), loadSite(true)])
    toast.push('Ссылка удалена')
  } catch (e) {
    toast.push(e.message, 'error')
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-head">
      <h1><i class="ri-links-line"></i> Ссылки</h1>
    </div>

    <div class="card">
      <form class="add-link-form" @submit.prevent="add">
        <input v-model="newLink.name" class="input input-name" placeholder="Название (Telegram, GitHub…)" />
        <input v-model="newLink.url" class="input input-url" placeholder="https://…" />
        <button class="btn btn-primary" type="submit" :disabled="busy">
          <i class="ri-add-line"></i> Добавить
        </button>
      </form>
    </div>

    <div v-if="links === null" class="loading"><i class="ri-loader-4-line"></i></div>

    <div v-else-if="!links.length" class="empty">
      <i class="ri-links-line"></i>
      <p>Ссылок пока нет — добавьте первую выше.</p>
    </div>

    <div v-else class="card">
      <div v-for="l in links" :key="l.id" class="link-row" :class="{ editing: editingId === l.id }">
        <template v-if="editingId === l.id">
          <input v-model="draft.name" class="input input-name" placeholder="Название" />
          <input v-model="draft.url" class="input input-url" placeholder="https://…" />
          <div class="row-actions">
            <button class="act-btn" type="button" title="Сохранить" @click="saveEdit"><i class="ri-check-line"></i></button>
            <button class="act-btn danger" type="button" title="Отмена" @click="editingId = null"><i class="ri-close-line"></i></button>
          </div>
        </template>
        <template v-else>
          <span class="link-ico"><i :class="linkIcon(l.url)"></i></span>
          <div class="link-info">
            <span class="link-name">{{ l.name }}</span>
            <a class="link-url" :href="l.url" target="_blank" rel="noopener">{{ l.url }}</a>
          </div>
          <div class="row-actions">
            <button class="act-btn" type="button" title="Редактировать" @click="startEdit(l)"><i class="ri-edit-line"></i></button>
            <button class="act-btn danger" type="button" title="Удалить" @click="remove(l)"><i class="ri-delete-bin-line"></i></button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
