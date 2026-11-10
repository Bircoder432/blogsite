<template>
  <div class="donate-page container">
    <div class="donate-card card">
      <h1 class="donate-title">
        <i class="ri-heart-fill donate-icon"></i> Поддержать проект
      </h1>
      <p class="donate-subtitle">
        Если вам нравится мой блог и вы хотите помочь с оплатой серверов, доменов и дальнейшего развития проекта, вы можете сделать это через безопасный перевод. Каждая поддержка невероятно важна. Спасибо!
      </p>

      <div class="donate-widget">
        <div class="widget-header">
          <i class="ri-wallet-3-line widget-icon"></i>
          <h3 class="widget-title">На поддержание инфраструктуры</h3>
        </div>
        <p class="widget-description">
          Перевод осуществляется через защищенный шлюз ЮMoney. Вы можете использовать банковскую карту или кошелек ЮMoney.
        </p>
        <a
          href="https://yoomoney.ru/to/4100117987099836"
          target="_blank"
          rel="noopener noreferrer"
          class="donate-button"
        >
          <i class="ri-bank-card-line"></i>
          <span>Перейти к переводу</span>
          <i class="ri-arrow-right-up-line"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Логика не требуется, это статичная страница
</script>

<style scoped>
.donate-page {
  padding: 2rem 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.donate-card {
  padding: 2.5rem 2rem;
  text-align: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.donate-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.donate-icon {
  animation: heartbeat 1.5s ease-in-out infinite;
}

.donate-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.donate-widget {
  background-color: var(--bg-body);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.widget-icon {
  font-size: 1.5rem;
  color: var(--accent);
}

.widget-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.widget-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 450px;
  margin: 0;
}

.donate-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background-color: var(--accent);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  margin-top: 0.5rem;
}

.donate-button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
}

.donate-button:active {
  transform: translateY(0);
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (max-width: 600px) {
  .donate-page {
    padding: 1rem;
  }
  .donate-card {
    padding: 1.5rem 1rem;
  }
  .donate-title {
    font-size: 1.5rem;
  }
  .donate-widget {
    padding: 1.5rem 1rem;
  }
  .donate-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
