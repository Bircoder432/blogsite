<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api'
import { useAuth } from '../../composables/useAuth'

const { setToken } = useAuth()

const login = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)
const loginEl = ref(null)

onMounted(() => loginEl.value?.focus())

async function submit() {
  if (!login.value || !password.value) {
    error.value = 'Заполните оба поля'
    return
  }
  busy.value = true
  error.value = ''
  try {
    const res = await api('POST', '/login', {
      login: login.value,
      password: password.value,
    })
    setToken(res.token)
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="login-wrap">
    <form class="login-card card" @submit.prevent="submit">
      <div class="login-logo"><i class="ri-shield-keyhole-line"></i></div>
      <h1>Вход в панель</h1>
      <p class="login-sub">Введите данные администратора</p>

      <div class="field">
        <label for="adm-login">Логин</label>
        <input id="adm-login" ref="loginEl" v-model="login" class="input" autocomplete="username" placeholder="admin" />
      </div>
      <div class="field">
        <label for="adm-pass">Пароль</label>
        <input id="adm-pass" v-model="password" type="password" class="input" autocomplete="current-password" placeholder="••••••••" />
      </div>

      <p v-if="error" class="form-error"><i class="ri-error-warning-fill"></i>{{ error }}</p>

      <button class="btn btn-primary btn-block" type="submit" :disabled="busy">
        <i :class="busy ? 'ri-loader-4-line spin' : 'ri-login-circle-line'"></i>
        Войти
      </button>
    </form>
  </div>
</template>
