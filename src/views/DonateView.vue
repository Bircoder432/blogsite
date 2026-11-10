<template>
  <div class="donate-page container">
    <div class="donate-card card">
      <h1 class="donate-title">
        <i class="ri-heart-fill donate-icon"></i> Поддержать проект
      </h1>
      <p class="donate-subtitle">
        Если вам нравится мой блог и вы хотите помочь с оплатой серверов, доменов и развития проекта, вы можете сделать это через форму ниже. Каждая поддержка невероятно важна. Спасибо!
      </p>

      <div class="widget-wrapper">
        <h3 class="widget-heading">На поддержание инфраструктуры</h3>
        <div class="iframe-container">
          <iframe
            src="https://yoomoney.ru/quickpay/fundraise/widget?billNumber=1LFJ9O8MNG0.261110&"
            width="100%"
            height="480"
            frameborder="0"
            allowtransparency="true"
            scrolling="no"
            style="border-radius: 12px;"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Логика не требуется, это статичная страница с виджетом
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
  color: var(--text-soft);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.widget-wrapper {
  background: var(--bg-body);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.widget-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
}

.iframe-container {
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
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
  .iframe-container iframe {
    height: 420px;
  }
}
</style>
