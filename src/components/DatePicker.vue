<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const root = ref(null)
const open = ref(false)
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const hoursInput = ref('12')
const minutesInput = ref('00')

const pad = (n) => String(n).padStart(2, '0')
const num = (v) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? 0 : n
}

function parse(value) {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(String(value).trim())
  return m ? { y: +m[1], mo: +m[2] - 1, d: +m[3], h: +m[4], mi: +m[5] } : null
}

const selected = computed(() => parse(props.modelValue))

const display = computed(() => {
  const s = selected.value
  return s ? `${s.d} ${MONTHS_GEN[s.mo]} ${s.y}, ${pad(s.h)}:${pad(s.mi)}` : ''
})

function emitValue(y, mo, d, h, mi) {
  emit('update:modelValue', `${y}-${pad(mo + 1)}-${pad(d)}T${pad(h)}:${pad(mi)}`)
}

watch(selected, (s) => {
  if (s) {
    hoursInput.value = pad(s.h)
    minutesInput.value = pad(s.mi)
  }
})

function toggle() {
  open.value ? close() : show()
}

function show() {
  const s = selected.value
  if (s) {
    viewYear.value = s.y
    viewMonth.value = s.mo
  } else {
    const n = new Date()
    viewYear.value = n.getFullYear()
    viewMonth.value = n.getMonth()
    hoursInput.value = pad(n.getHours())
    minutesInput.value = pad(n.getMinutes())
  }
  open.value = true
}

function close() {
  open.value = false
}

function shiftMonth(delta) {
  let mo = viewMonth.value + delta
  let y = viewYear.value
  if (mo < 0) { mo = 11; y-- } else if (mo > 11) { mo = 0; y++ }
  viewMonth.value = mo
  viewYear.value = y
}

function shiftYear(delta) {
  viewYear.value += delta
}

const cells = computed(() => {
  const lead = (new Date(viewYear.value, viewMonth.value, 1).getDay() + 6) % 7
  const count = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const arr = Array(lead).fill(null)
  for (let d = 1; d <= count; d++) arr.push(d)
  while (arr.length % 7) arr.push(null)
  return arr
})

function isToday(d) {
  if (!d) return false
  const t = new Date()
  return t.getFullYear() === viewYear.value && t.getMonth() === viewMonth.value && t.getDate() === d
}

function isSelected(d) {
  const s = selected.value
  if (!d || !s) return false
  return s.y === viewYear.value && s.mo === viewMonth.value && s.d === d
}

function pickDay(d) {
  emitValue(viewYear.value, viewMonth.value, d, num(hoursInput.value), num(minutesInput.value))
}

function commitTime() {
  const h = Math.min(23, Math.max(0, num(hoursInput.value)))
  const mi = Math.min(59, Math.max(0, num(minutesInput.value)))
  hoursInput.value = pad(h)
  minutesInput.value = pad(mi)

  const s = selected.value
  const now = new Date()
  if (!s) {
    viewYear.value = now.getFullYear()
    viewMonth.value = now.getMonth()
  }
  emitValue(
    s ? s.y : now.getFullYear(),
    s ? s.mo : now.getMonth(),
    s ? s.d : now.getDate(),
    h,
    mi
  )
}

function step(field, delta) {
  const max = field === 'h' ? 24 : 60
  const cur = field === 'h' ? num(hoursInput.value) : num(minutesInput.value)
  const v = (((cur + delta) % max) + max) % max
  if (field === 'h') hoursInput.value = pad(v)
  else minutesInput.value = pad(v)
  commitTime()
}

function onTimeInput(e, field) {
  const v = e.target.value.replace(/\D/g, '').slice(0, 2)
  if (field === 'h') hoursInput.value = v
  else minutesInput.value = v
}

function onTimeKey(e, field) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    step(field, 1)
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    step(field, -1)
  }
}

function setNow() {
  const n = new Date()
  viewYear.value = n.getFullYear()
  viewMonth.value = n.getMonth()
  hoursInput.value = pad(n.getHours())
  minutesInput.value = pad(n.getMinutes())
  emitValue(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes())
}

function clearValue() {
  emit('update:modelValue', '')
  const n = new Date()
  hoursInput.value = pad(n.getHours())
  minutesInput.value = pad(n.getMinutes())
}

function onDocMouse(e) {
  if (open.value && root.value && !root.value.contains(e.target)) close()
}

function onDocKey(e) {
  if (e.key === 'Escape' && open.value) close()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocMouse)
  document.addEventListener('keydown', onDocKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocMouse)
  document.removeEventListener('keydown', onDocKey)
})
</script>

<template>
  <div ref="root" class="dp" :class="{ open }">
    <button type="button" class="dp-trigger" @click="toggle">
      <i class="ri-calendar-line"></i>
      <span class="dp-value" :class="{ placeholder: !modelValue }">
        {{ display || 'Выберите дату и время' }}
      </span>
      <i
        v-if="modelValue"
        class="ri-close-circle-fill dp-clear"
        title="Очистить"
        @click.stop="clearValue"
      ></i>
      <i class="ri-arrow-down-s-line dp-caret"></i>
    </button>

    <Transition name="dp-drop">
      <div v-if="open" class="dp-panel">
        <div class="dp-nav">
          <div class="dp-nav-group">
            <button type="button" class="dp-nav-btn" title="Предыдущий год" @click="shiftYear(-1)">
              <i class="ri-arrow-left-double-line"></i>
            </button>
            <button type="button" class="dp-nav-btn" title="Предыдущий месяц" @click="shiftMonth(-1)">
              <i class="ri-arrow-left-s-line"></i>
            </button>
          </div>
          <span class="dp-title">{{ MONTHS_NOM[viewMonth] }} {{ viewYear }}</span>
          <div class="dp-nav-group">
            <button type="button" class="dp-nav-btn" title="Следующий месяц" @click="shiftMonth(1)">
              <i class="ri-arrow-right-s-line"></i>
            </button>
            <button type="button" class="dp-nav-btn" title="Следующий год" @click="shiftYear(1)">
              <i class="ri-arrow-right-double-line"></i>
            </button>
          </div>
        </div>

        <div class="dp-grid">
          <span v-for="w in WEEKDAYS" :key="'w' + w" class="dp-weekday">{{ w }}</span>
          <button
            v-for="(d, i) in cells"
            :key="'c' + i"
            type="button"
            class="dp-day"
            :class="{ today: isToday(d), selected: isSelected(d) }"
            :disabled="!d"
            @click="pickDay(d)"
          >{{ d || '' }}</button>
        </div>

        <div class="dp-time">
          <div class="dp-time-fields">
            <div class="dp-time-field">
              <button type="button" class="dp-step" tabindex="-1" @click="step('h', 1)">
                <i class="ri-arrow-up-s-line"></i>
              </button>
              <input
                class="dp-time-input"
                :value="hoursInput"
                maxlength="2"
                inputmode="numeric"
                title="Часы"
                @input="onTimeInput($event, 'h')"
                @keydown="onTimeKey($event, 'h')"
                @blur="commitTime"
              />
              <button type="button" class="dp-step" tabindex="-1" @click="step('h', -1)">
                <i class="ri-arrow-down-s-line"></i>
              </button>
            </div>
            <span class="dp-sep">:</span>
            <div class="dp-time-field">
              <button type="button" class="dp-step" tabindex="-1" @click="step('m', 1)">
                <i class="ri-arrow-up-s-line"></i>
              </button>
              <input
                class="dp-time-input"
                :value="minutesInput"
                maxlength="2"
                inputmode="numeric"
                title="Минуты"
                @input="onTimeInput($event, 'm')"
                @keydown="onTimeKey($event, 'm')"
                @blur="commitTime"
              />
              <button type="button" class="dp-step" tabindex="-1" @click="step('m', -1)">
                <i class="ri-arrow-down-s-line"></i>
              </button>
            </div>
          </div>

          <div class="dp-time-actions">
            <button type="button" class="btn btn-sm" @click="setNow">
              <i class="ri-time-line"></i> Сейчас
            </button>
            <button type="button" class="btn btn-sm btn-primary" @click="close">
              <i class="ri-check-line"></i> Готово
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
