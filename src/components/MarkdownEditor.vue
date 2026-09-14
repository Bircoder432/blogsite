<script setup>
import { ref, computed, nextTick } from 'vue'
import { renderMarkdown } from '../lib/markdown'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const area = ref(null)
const previewEl = ref(null)
const mode = ref('split') // edit | split | preview
const fullscreen = ref(false)
const modal = ref(null) // { type: 'link' | 'image', text, url }

const stats = computed(() => {
  const v = props.modelValue || ''
  return {
    words: v.trim() ? v.trim().split(/\s+/).length : 0,
    chars: v.length,
    lines: v ? v.split('\n').length : 0,
  }
})

const previewHtml = computed(() => renderMarkdown(props.modelValue))

function canEdit() {
  return mode.value !== 'preview'
}

function update(value, selStart, selEnd) {
  emit('update:modelValue', value)
  nextTick(() => {
    if (!area.value) return
    area.value.focus()
    if (selStart !== undefined) area.value.setSelectionRange(selStart, selEnd ?? selStart)
  })
}

// Обернуть выделение (жирный, курсив, код...)
function surround(before, after = before, placeholder = 'текст') {
  if (!canEdit()) return
  const el = area.value
  const s = el.selectionStart
  const e = el.selectionEnd
  const selected = el.value.slice(s, e) || placeholder
  update(
    el.value.slice(0, s) + before + selected + after + el.value.slice(e),
    s + before.length,
    s + before.length + selected.length
  )
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Префикс строк с переключением (заголовки, списки, цитата)
function toggleLines(prefix, numbered = false) {
  if (!canEdit()) return
  const el = area.value
  const value = el.value
  const start = value.lastIndexOf('\n', el.selectionStart - 1) + 1
  let end = value.indexOf('\n', el.selectionEnd)
  if (end === -1) end = value.length
  const lines = value.slice(start, end).split('\n')
  const re = numbered ? /^\s*\d+\.\s/ : new RegExp('^\\s*' + escapeRe(prefix))
  const active = lines.every((l) => re.test(l))
  const next = lines
    .map((l, i) => (active ? l.replace(re, '') : (numbered ? `${i + 1}. ` : prefix) + l))
    .join('\n')
  update(value.slice(0, start) + next + value.slice(end), start, start + next.length)
}

function insertText(text) {
  if (!canEdit()) return
  const el = area.value
  const s = el.selectionStart
  const e = el.selectionEnd
  update(el.value.slice(0, s) + text + el.value.slice(e), s + text.length)
}

function insertBlock(text) {
  if (!canEdit()) return
  const el = area.value
  const s = el.selectionStart
  const before = el.value.slice(0, s)
  const gap = before.trim() === '' ? '' : before.endsWith('\n') ? '\n' : '\n\n'
  const payload = gap + text
  update(before + payload + el.value.slice(el.selectionEnd), s + payload.length)
}

function codeBlock() {
  if (!canEdit()) return
  const el = area.value
  const s = el.selectionStart
  const e = el.selectionEnd
  const value = el.value
  const selected = value.slice(s, e) || 'ваш код'
  const needsLead = s > 0 && value[s - 1] !== '\n'
  const needsTail = e < value.length && value[e] !== '\n'
  const before = (needsLead ? '\n' : '') + '```\n'
  const after = '\n```' + (needsTail ? '\n' : '')
  update(
    value.slice(0, s) + before + selected + after + value.slice(e),
    s + before.length,
    s + before.length + selected.length
  )
}

function openModal(type) {
  if (!canEdit()) return
  const el = area.value
  const selected = el.value.slice(el.selectionStart, el.selectionEnd).trim()
  modal.value = {
    type,
    text: selected || (type === 'image' ? 'описание' : 'текст ссылки'),
    url: 'https://',
  }
}

function applyModal() {
  const m = modal.value
  if (!m) return
  const url = m.url.trim()
  if (!url || url === 'https://') {
    modal.value = null
    return
  }
  insertText(m.type === 'image' ? `![${m.text}](${url})` : `[${m.text}](${url})`)
  modal.value = null
}

const actions = {
  h2: () => toggleLines('## '),
  h3: () => toggleLines('### '),
  bold: () => surround('**', '**', 'жирный текст'),
  italic: () => surround('*', '*', 'курсив'),
  strike: () => surround('~~', '~~', 'зачёркнутый'),
  quote: () => toggleLines('> '),
  list: () => toggleLines('- '),
  olist: () => toggleLines('1. ', true),
  code: () => surround('`', '`', 'код'),
  codeblock: codeBlock,
  link: () => openModal('link'),
  image: () => openModal('image'),
  table: () => insertBlock('| Столбец | Столбец |\n| --- | --- |\n|  |  |\n'),
  hr: () => insertBlock('---'),
}

function onKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    insertText('  ')
    return
  }
  if (!(e.ctrlKey || e.metaKey)) return
  const k = e.key.toLowerCase()
  if (k === 'b') {
    e.preventDefault()
    actions.bold()
  } else if (k === 'i') {
    e.preventDefault()
    actions.italic()
  } else if (k === 'k') {
    e.preventDefault()
    openModal('link')
  }
}

// Синхронизация скролла редактора и превью
function onScroll() {
  if (mode.value !== 'split' || !previewEl.value || !area.value) return
  const a = area.value
  const ratio = a.scrollTop / Math.max(1, a.scrollHeight - a.clientHeight)
  const p = previewEl.value
  p.scrollTop = ratio * (p.scrollHeight - p.clientHeight)
}
</script>

<template>
  <div class="md-editor" :class="{ 'is-fullscreen': fullscreen }">
    <div class="md-toolbar">
      <div class="md-groups" :class="{ disabled: mode === 'preview' }">
        <button type="button" class="md-btn" title="Заголовок 2" @mousedown.prevent @click="actions.h2"><i class="ri-h-2"></i></button>
        <button type="button" class="md-btn" title="Заголовок 3" @mousedown.prevent @click="actions.h3"><i class="ri-h-3"></i></button>
        <span class="md-sep"></span>
        <button type="button" class="md-btn" title="Жирный (Ctrl+B)" @mousedown.prevent @click="actions.bold"><i class="ri-bold"></i></button>
        <button type="button" class="md-btn" title="Курсив (Ctrl+I)" @mousedown.prevent @click="actions.italic"><i class="ri-italic"></i></button>
        <button type="button" class="md-btn" title="Зачёркнутый" @mousedown.prevent @click="actions.strike"><i class="ri-strikethrough"></i></button>
        <span class="md-sep"></span>
        <button type="button" class="md-btn" title="Список" @mousedown.prevent @click="actions.list"><i class="ri-list-unordered"></i></button>
        <button type="button" class="md-btn" title="Нумерованный список" @mousedown.prevent @click="actions.olist"><i class="ri-list-ordered"></i></button>
        <button type="button" class="md-btn" title="Цитата" @mousedown.prevent @click="actions.quote"><i class="ri-double-quotes-l"></i></button>
        <span class="md-sep"></span>
        <button type="button" class="md-btn" title="Код в строке" @mousedown.prevent @click="actions.code"><i class="ri-code"></i></button>
        <button type="button" class="md-btn" title="Блок кода" @mousedown.prevent @click="actions.codeblock"><i class="ri-code-box-line"></i></button>
        <button type="button" class="md-btn" title="Ссылка (Ctrl+K)" @mousedown.prevent @click="actions.link"><i class="ri-link"></i></button>
        <button type="button" class="md-btn" title="Изображение" @mousedown.prevent @click="actions.image"><i class="ri-image-line"></i></button>
        <span class="md-sep"></span>
        <button type="button" class="md-btn" title="Таблица" @mousedown.prevent @click="actions.table"><i class="ri-table-line"></i></button>
        <button type="button" class="md-btn" title="Разделитель" @mousedown.prevent @click="actions.hr"><i class="ri-subtract-line"></i></button>
      </div>

      <div class="md-modes">
        <button type="button" class="md-mode" :class="{ active: mode === 'edit' }" title="Только редактор" @click="mode = 'edit'">
          <i class="ri-edit-line"></i>
        </button>
        <button type="button" class="md-mode" :class="{ active: mode === 'split' }" title="Редактор + превью" @click="mode = 'split'">
          <i class="ri-layout-column-line"></i>
        </button>
        <button type="button" class="md-mode" :class="{ active: mode === 'preview' }" title="Только превью" @click="mode = 'preview'">
          <i class="ri-eye-line"></i>
        </button>
        <button type="button" class="md-mode" :title="fullscreen ? 'Свернуть' : 'На весь экран'" @click="fullscreen = !fullscreen">
          <i :class="fullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"></i>
        </button>
      </div>
    </div>

    <div class="md-body" :class="mode">
      <textarea
        ref="area"
        class="md-area"
        :value="modelValue"
        :placeholder="placeholder"
        spellcheck="false"
        @input="emit('update:modelValue', $event.target.value)"
        @keydown="onKeydown"
        @scroll="onScroll"
      ></textarea>
      <div ref="previewEl" class="md-preview markdown" v-html="previewHtml"></div>
    </div>

    <div class="md-status">
      <span><i class="ri-file-word-line"></i> {{ stats.words }} сл.</span>
      <span><i class="ri-font-size"></i> {{ stats.chars }} симв.</span>
      <span class="md-hint"><i class="ri-markdown-line"></i> Markdown · Ctrl+B, Ctrl+I, Ctrl+K</span>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal" class="modal-backdrop" @click.self="modal = null">
          <form class="modal card" @submit.prevent="applyModal">
            <h3 class="modal-title">
              <i :class="modal.type === 'image' ? 'ri-image-line' : 'ri-link'"></i>
              {{ modal.type === 'image' ? 'Вставить изображение' : 'Вставить ссылку' }}
            </h3>
            <div class="field">
              <label>{{ modal.type === 'image' ? 'Описание (alt)' : 'Текст ссылки' }}</label>
              <input v-model="modal.text" class="input" />
            </div>
            <div class="field">
              <label>Адрес (URL)</label>
              <input v-model="modal.url" class="input" placeholder="https://" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn" @click="modal = null">Отмена</button>
              <button type="submit" class="btn btn-primary"><i class="ri-check-line"></i> Вставить</button>
            </div>
          </form>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
