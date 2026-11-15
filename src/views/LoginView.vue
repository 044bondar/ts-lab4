<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const apiError = ref<string | null>(null);
const isLoading = ref(false);

const schema = toTypedSchema(
    zod.object({
      username: zod.string().min(1, 'Username є обовʼязковим полем'),
      password: zod.string().min(6, 'Пароль має містити щонайменше 6 символів'),
    })
);

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    username: 'emilys',
    password: 'emilyspass',
  },
});

const { value: username, errorMessage: usernameError } = useField<string>('username');
const { value: password, errorMessage: passwordError } = useField<string>('password');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  apiError.value = null;
  try {
    await authStore.login(values);
    const redirectPath = (route.query.redirect as string) || '/users';
    router.push(redirectPath);
  } catch (e) {
    apiError.value = (e as Error).message || 'Помилка авторизації';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="card-block login-card">
    <h2 class="mb-1">Вхід у систему</h2>
    <p class="text-muted small mb-3">Тестові облікові дані: <code>emilys</code> / <code>emilyspass</code></p>

    <div v-if="apiError" class="alert alert-danger py-2">
      {{ apiError }}
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" placeholder="Введіть логін" />
        <small v-if="usernameError" class="text-danger">{{ usernameError }}</small>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="Введіть пароль" />
        <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        {{ isLoading ? 'Виконується вхід...' : 'Увійти' }}
      </button>
    </form>

    <div class="mt-3 text-center">
      <RouterLink to="/" class="text-decoration-none">&larr; Повернутися на головну</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 420px;
}
</style>