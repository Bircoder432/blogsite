<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../api'
import { slugify, nowLocalInput, toLocalInput, fromLocalInput } from '../../lib/format'
import { useToast } from '../../composables/useToast'
import MarkdownEditor from '../../components/MarkdownEditor.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isNew = computed(() => route.name === 'admin-article-new')
const loading = ref(!isNew.value)
const saving = ref(false)

const id = ref(null)
const title = ref('')
const slug = ref('')
const date = ref(nowLocalInput())
const excerpt = ref('')
const content = ref('')
const slugTouched = ref(false)

// Автогенерация slug из заголовка, пока пользователь не трогал поле руками
watch(title, (value) => {
  if (isNew.value && !slugTouched.value) slug.value = slugify(value)
})

onMounted(async () => {
  window.addEventListener('keydown', onGlobalKey)
  if (isNew.value) return
  try {
    const a = await api('GET', `/articles/${encodeURIComponent(route.params.slug)}`)
    id.value = a.id
    title.value = a.title
    slug.value = a.slug
    date.value = toLocalInput(a.date) || nowLocalInput()
    excerpt.value = a.excerpt || ''
    content.value = a.content || ''
  } catch (e) {
    toast.push(`Не удалось загрузить статью: ${e.message}`, 'error')
    router.replace('/apanel/articles')
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))

function onGlobalKey(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    save()
  }
}

async function save() {
  if (saving.value || loading.value) return
  if (!title.value.trim()) {
    toast.push('Введите заголовок статьи', 'error')
    return
  }
  if (!slug.value.trim()) {
    toast.push('Укажите slug — адрес статьи', 'error')
    return
  }
  if (!content.value.trim()) {
    toast.push('Текст статьи пуст', 'error')
    return
  }

  const body = {
    slug: slug.value.trim(),
    title: title.value.trim(),
    excerpt: excerpt.value.trim(),
    content: content.value,
    date: fromLocalInput(date.value) || fromLocalInput(nowLocalInput()),
  }

  saving.value = true
  try {
    if (isNew.value) {
      await api('POST', '/admin/articles', body)
      toast.push('Статья опубликована')
    } else {
      await api('PUT', `/admin/articles/${id.value}`, body)
      toast.push('Изменения сохранены')
    }
    router.push('/apanel/articles')
  } catch (e) {
    toast.push(e.message, 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page editor-page">
    <div class="admin-head">
      <button class="btn btn-ghost btn-sm" type="button" @click="router.push('/apanel/articles')">
        <i class="ri-arrow-left-line"></i> Назад
      </button>
      <h1>{{ isNew ? 'Новая статья' : 'Редактирование статьи' }}</h1>
      <div class="spacer"></div>
      <a
        v-if="!isNew && slug"
        class="btn btn-sm"
        :href="`/blog/${encodeURIComponent(slug)}`"
        target="_blank"
        rel="noopener"
      >
        <i class="ri-external-link-line"></i> На сайте
      </a>
      <button class="btn btn-primary" type="button" :disabled="saving" @click="save">
        <i :class="saving ? 'ri-loader-4-line spin' : 'ri-save-3-line'"></i>
        Сохранить <span class="kbd">Ctrl+S</span>
      </button>
    </div>

    <div v-if="loading" class="loading"><i class="ri-loader-4-line"></i></div>

    <template v-else>
      <div class="card form-card">
        <div class="field">
          <label for="f-title">Заголовок</label>
          <input id="f-title" v-model="title" class="input input-lg" placeholder="О чём статья?" />
        </div>

        <div class="form-row">
          <div class="field">
            <label for="f-slug">Адрес (slug)</label>
            <input
              id="f-slug"
              v-model="slug"
              class="input"
              placeholder="moya-pervaya-statya"
              @input="slugTouched = true"
            />
            <p v-if="isNew" class="hint">Генерируется из заголовка, но можно изменить вручную</p>
          </div>
          <div class="field">
            <label for="f-date">Дата публикации</label>
            <input id="f-date" v-model="date" class="input" type="datetime-local" />
          </div>
        </div>

        <div class="field">
          <label for="f-excerpt">Краткое описание</label>
          <textarea
            id="f-excerpt"
            v-model="excerpt"
            class="textarea"
            rows="2"
            placeholder="Пара предложений — показывается в списках статей"
          ></textarea>
        </div>
      </div>

      <div class="editor-field">
        <label class="editor-label">Текст статьи (Markdown)</label>
        <MarkdownEditor
          v-model="content"
          placeholder="Текст статьи в Markdown: **выделение**, списки, ссылки, картинки и блоки кода…"
        />
      </div>
    </template>
  </div>
</template>
