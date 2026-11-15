<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { User } from '@/types/user';
import { ServiceProvider } from '@/services/service-provider';
import { useUsersStore } from '@/stores/users.store';

const props = defineProps<{ id: string }>();
const usersStore = useUsersStore();

const user = ref<User | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchDetails = async () => {
  const numId = Number(props.id);

  // Перевіряємо локальний стор (для щойно доданих або відредагованих юзерів)
  const localUser = usersStore.users.find((u) => u.id === numId);
  if (localUser) {
    user.value = localUser;
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    user.value = await ServiceProvider.users.getById(numId);
  } catch (e) {
    error.value = (e as Error).message || 'Не вдалося завантажити профіль';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDetails);
watch(() => props.id, fetchDetails);
</script>

<template>
  <div class="card-block">
    <RouterLink to="/users" class="btn btn-sm btn-secondary mb-3">&larr; Назад до списку</RouterLink>

    <div v-if="isLoading" class="py-3">Завантаження профілю...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="user">
      <div class="d-flex align-items-center gap-3 mb-3">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="user.firstName"
          class="rounded-circle border"
          width="80"
          height="80"
        />
        <div>
          <h2 class="mb-0">{{ user.firstName }} {{ user.lastName }}</h2>
          <span class="text-muted">@{{ user.username }}</span>
        </div>
      </div>

      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Вік:</strong> {{ user.age }} років | <strong>Стать:</strong> {{ user.gender }}</p>
      <p><strong>Телефон:</strong> {{ user.phone }}</p>

      <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-warning mt-2">
        Редагувати профіль
      </RouterLink>

      <!-- Контейнер для вкладеного маршруту /users/:id/edit -->
      <div class="mt-4">
        <RouterView :user="user" @updated="(updated: User) => (user = updated)" />
      </div>
    </div>
  </div>
</template>