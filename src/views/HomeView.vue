<template>
  <section class="card-block">
    <h1>Vue Lottery & Users Management SPA</h1>
    <p class="lead">
      Навчальний односторінковий вебзастосунок для керування учасниками розіграшу,
      інтегрований із зовнішнім REST API (DummyJSON).
    </p>

    <h3 class="mt-4">Використані технології та архітектурні патерни:</h3>
    <ul>
      <li><strong>Vue 3 (Composition API) & TypeScript:</strong> строга типізація моделей та компонентів[cite: 13].</li>
      <li><strong>Vue Router 4:</strong> динамічна та вкладена маршрутизація, query-параметри пагінації, Navigation Guards (`requiresAuth`), динамічні Layouts[cite: 14, 15, 21, 22].</li>
      <li><strong>Pinia:</strong> реактивне керування глобальним станом авторизації та списком учасників[cite: 22].</li>
      <li><strong>Repository Pattern & ServiceProvider:</strong> повна ізоляція роботи з REST API від компонентів[cite: 16, 21].</li>
      <li><strong>JWT Authentication + Fetch Interceptor:</strong> автоматична підстановка токена та оновлення сесії через `/auth/refresh` при статусі `401`[cite: 21, 22].</li>
      <li><strong>VeeValidate + Zod:</strong> декларативна схематична валідація форм[cite: 22].</li>
    </ul>

    <a
      href="https://github.com/<твій_нік_github>/vue-lottery-app"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary mt-3"
    >
      Переглянути вихідний код на GitHub
    </a>
  </section>
</template>