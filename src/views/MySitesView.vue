<script setup>
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <div class="my-sites-container">
    <h1 class="page-title">
      <i class="ri-links-line"></i> Мои проекты
    </h1>
    <p class="page-subtitle">Небольшие веб-приложения, созданные с душой и вниманием к деталям.</p>

    <div class="sites-grid">
      <!-- Карточка БИНГО (всегда тёмная, как оригинальный сайт) -->
      <a
        href="https://bingo.vstor-tech.ru"
        target="_blank"
        rel="noopener"
        class="site-card bingo-card"
      >
        <div class="card-visual bingo-visual">
          <div class="bingo-logo">
            <span class="letter" style="color: #fb7185; background: #fb71851f; border: 1px solid #fb718538; text-shadow: 0 0 18px #fb718566;">Б</span>
            <span class="letter" style="color: #fbbf24; background: #fbbf241f; border: 1px solid #fbbf2438; text-shadow: 0 0 18px #fbbf2466;">И</span>
            <span class="letter" style="color: #a3e635; background: #a3e6351f; border: 1px solid #a3e63538; text-shadow: 0 0 18px #a3e63566;">Н</span>
            <span class="letter" style="color: #22d3ee; background: #22d3ee1f; border: 1px solid #22d3ee38; text-shadow: 0 0 18px #22d3ee66;">Г</span>
            <span class="letter" style="color: #e879f9; background: #e879f91f; border: 1px solid #e879f938; text-shadow: 0 0 18px #e879f966;">О</span>
            <span class="exclamation">!</span>
          </div>
        </div>
        <div class="card-content">
          <div class="card-header">
            <h2>Бинго!</h2>
          </div>
          <p>Создавай карточки с заданиями, делись ссылкой и закрашивай клетки онлайн. Прогресс сохраняется автоматически.</p>
          <span class="card-link">
            Перейти на сайт <i class="ri-arrow-right-up-line"></i>
          </span>
        </div>
      </a>

      <!-- Карточка РАСПИСАНИЯ (переключается вместе с темой блога) -->
      <a
        href="https://osa.vstor-tech.ru"
        target="_blank"
        rel="noopener"
        class="site-card schedule-card"
        :class="{ 'light-theme': theme === 'light' }"
      >
        <div class="card-visual schedule-visual">
          <div class="schedule-lines">
            <div class="schedule-line" v-for="i in 3" :key="i">
              <div class="line-time"></div>
              <div class="line-subject"></div>
            </div>
          </div>
        </div>
        <div class="card-content">
          <div class="card-header">
            <i class="ri-calendar-event-fill"></i>
            <h2>Расписание ТКПСТ</h2>
          </div>
          <p>Удобный и быстрый просмотр расписания занятий колледжа. Фильтры по группам, преподавателям и датам.</p>
          <span class="card-link">
            Перейти на сайт <i class="ri-arrow-right-up-line"></i>
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&display=swap');

.my-sites-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.site-card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  border: 1px solid transparent;
}

.site-card:hover {
  transform: translateY(-6px);
}

.card-visual {
  height: 160px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.card-content p {
  font-size: 0.95rem;
  line-height: 1.5;
  flex: 1;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: auto;
  transition: gap 0.2s ease;
}

.site-card:hover .card-link {
  gap: 0.75rem;
}

/* =========================================
   БИНГО (всегда тёмная, как оригинальный сайт)
   ========================================= */
.bingo-card {
  background: #12141c;
  color: #f1f5f9;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.bingo-card:hover {
  box-shadow: 0 20px 40px -12px rgba(232, 121, 249, 0.25);
  border-color: rgba(232, 121, 249, 0.4);
}

.bingo-card .card-header {
  color: #e879f9;
}

.bingo-card .card-link {
  color: #22d3ee;
}

.bingo-card .card-content p {
  color: #94a3b8;
}

.bingo-visual {
  background: radial-gradient(circle at 50% 50%, rgba(232, 121, 249, 0.15), transparent 70%);
}

.bingo-logo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  user-select: none;
  transform: scale(1.2);
}

.bingo-logo .letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  font-family: 'Unbounded', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 1;
}

.bingo-logo .exclamation {
  font-family: 'Unbounded', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  color: #ffffff;
  line-height: 1;
  margin-left: 2px;
}

/* =========================================
   РАСПИСАНИЕ (переключается с темой блога)
   ========================================= */

/* Тёмная тема (по умолчанию) */
.schedule-card {
  background: linear-gradient(135deg, #0f172a 0%, #1a1f2e 50%, #0f172a 100%);
  color: #f1f5f9;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.schedule-card:hover {
  box-shadow: 0 20px 40px -12px rgba(11, 109, 172, 0.3);
  border-color: rgba(33, 186, 220, 0.5);
}

.schedule-card .card-header {
  background: linear-gradient(135deg, #0B6DAC, #21BADC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.schedule-card .card-link {
  color: #21BADC;
}

.schedule-card .card-content p {
  color: #94a3b8;
}

.schedule-visual {
  position: relative;
}

.schedule-visual::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(33, 186, 220, 0.15), transparent 60%);
  pointer-events: none;
}

.schedule-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 70%;
  z-index: 2;
  position: relative;
}

.schedule-line {
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
}

.line-time {
  width: 40px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #0B6DAC, #21BADC);
}

.line-subject {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
}

.schedule-line:nth-child(2) .line-subject { width: 75%; }
.schedule-line:nth-child(3) .line-subject { width: 85%; }

/* Светлая тема */
.schedule-card.light-theme {
  background: linear-gradient(135deg, #f8fafc 0%, #E6E6E6 50%, #f1f5f9 100%);
  color: #1e293b;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

.schedule-card.light-theme:hover {
  box-shadow: 0 20px 40px -12px rgba(11, 109, 172, 0.15);
  border-color: rgba(11, 109, 172, 0.4);
}

.schedule-card.light-theme .card-header {
  background: linear-gradient(135deg, #084E73, #0B6DAC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.schedule-card.light-theme .card-link {
  color: #0B6DAC;
}

.schedule-card.light-theme .card-content p {
  color: #64748b;
}

.schedule-card.light-theme .schedule-line {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.schedule-card.light-theme .line-subject {
  background: rgba(0, 0, 0, 0.1);
}

.schedule-card.light-theme .schedule-visual::before {
  background: radial-gradient(circle at 50% 0%, rgba(11, 109, 172, 0.1), transparent 60%);
}

/* Адаптивность */
@media (max-width: 768px) {
  .sites-grid {
    grid-template-columns: 1fr;
  }

  .bingo-logo {
    transform: scale(1);
  }

  .bingo-logo .letter {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .bingo-logo .exclamation {
    font-size: 1.25rem;
  }
}
</style>
