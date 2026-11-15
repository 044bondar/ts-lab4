<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users.store';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const limit = 10;
const currentPage = ref(Number(route.query.page) || 1);
const searchQuery = ref((route.query.q as string) || '');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const loadData = () => {
  const skip = (currentPage.value - 1) * limit;
  usersStore.fetchUsers({ limit, skip, q: searchQuery.value });
};

const syncQuery = () => {
  router.replace({
    query: {
      ...(currentPage.value > 1 ? { page: currentPage.value } : {}),
      ...(searchQuery.value ? { q: searchQuery.value } : {}),
    },
  });
};

watch(searchQuery, () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    syncQuery();
    loadData();
  }, 300);
});

const changePage = (page: number) => {
  currentPage.value = page;
  syncQuery();
  loadData();
};

onMounted(loadData);

const totalPages = computed(() => Math.ceil(usersStore.total / limit));

// Валідація створення користувача (VeeValidate + Zod)
const createSchema = toTypedSchema(
    zod.object({
      firstName: zod.string().min(2, 'Мінімум 2 символи'),
      lastName: zod.string().min(2, 'Мінімум 2 символи'),
      email: zod.string().email('Некоректний формат email'),
      username: zod.string().min(3, 'Мінімум 3 символи'),
      password: zod.string().min(6, 'Мінімум 6 символів'),
      age: zod.number({ invalid_type_error: 'Вкажіть число' }).min(18, 'Вік від 18 років').max(120),
      gender: zod.enum(['male', 'female']),
      phone: zod.string().regex(/^\+380\d{9}$/, 'Формат: +380XXXXXXXXX'),
    })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: createSchema,
  initialValues: {
    gender: 'male',
    age: 20,
  },
});

const { value: firstName, errorMessage: firstNameErr } = useField<string>('firstName');
const { value: lastName, errorMessage: lastNameErr } = useField<string>('lastName');
const { value: email, errorMessage: emailErr } = useField<string>('email');
const { value: username, errorMessage: usernameErr } = useField<string>('username');
const { value: password, errorMessage: passwordErr } = useField<string>('password');
const { value: age, errorMessage: ageErr } = useField<number>('age');
const { value: gender } = useField<'male' | 'female'>('gender');
const { value: phone, errorMessage: phoneErr } = useField<string>('phone');

const onCreateUser = handleSubmit(async (values) => {
  await usersStore.addUser(values);
  resetForm();
});
</script>

<template>
  <div>
    <!-- Форма створення учасника -->
    <section class="card-block">
      <h3 class="mb-3">Додати нового учасника</h3>
      <form class="row g-3" @submit.prevent="onCreateUser">
        <div class="col-md-4">
          <input v-model="firstName" placeholder="First Name" class="form-control" />
          <small v-if="firstNameErr" class="text-danger">{{ firstNameErr }}</small>
        </div>
        <div class="col-md-4">
          <input v-model="lastName" placeholder="Last Name" class="form-control" />
          <small v-if="lastNameErr" class="text-danger">{{ lastNameErr }}</small>
        </div>
        <div class="col-md-4">
          <input v-model="email" placeholder="Email" class="form-control" />
          <small v-if="emailErr" class="text-danger">{{ emailErr }}</small>
        </div>
        <div class="col-md-3">
          <input v-model="username" placeholder="Username" class="form-control" />
          <small v-if="usernameErr" class="text-danger">{{ usernameErr }}</small>
        </div>
        <div class="col-md-3">
          <input v-model="password" type="password" placeholder="Password" class="form-control" />
          <small v-if="passwordErr" class="text-danger">{{ passwordErr }}</small>
        </div>
        <div class="col-md-2">
          <input v-model.number="age" type="number" placeholder="Age" class="form-control" />
          <small v-if="ageErr" class="text-danger">{{ ageErr }}</small>
        </div>
        <div class="col-md-2">
          <select v-model="gender" class="form-select">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="col-md-2">
          <input v-model="phone" placeholder="+380XXXXXXXXX" class="form-control" />
          <small v-if="phoneErr" class="text-danger">{{ phoneErr }}</small>
        </div>
        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary">Створити учасника</button>
        </div>
      </form>
    </section>

    <!-- Таблиця учасників -->
    <section class="card-block">
      <div class="mb-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Пошук користувачів за іменем..."
        />
      </div>

      <div v-if="usersStore.isLoading" class="text-center py-4">Завантаження даних...</div>
      <div v-else-if="usersStore.error" class="alert alert-danger">{{ usersStore.error }}</div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ім'я та прізвище</th>
              <th>Email</th>
              <th>Вік</th>
              <th>Телефон</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="usersStore.users.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">Користувачів не знайдено</td>
            </tr>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td class="fw-semibold">{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.phone }}</td>
              <td class="text-end">
                <RouterLink :to="`/users/${user.id}`" class="btn btn-sm btn-info me-1 text-white">
                  Деталі
                </RouterLink>
                <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-sm btn-warning me-1">
                  Редагувати
                </RouterLink>
                <button class="btn btn-sm btn-danger" @click="usersStore.removeUser(user.id)">
                  Видалити
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагінація -->
      <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
        <span class="text-muted">Сторінка {{ currentPage }} із {{ totalPages }}</span>
        <div class="btn-group">
          <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
          >
            &larr; Попередня
          </button>
          <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
          >
            Наступна &rarr;
          </button>
        </div>
      </div>
    </section>
  </div>
</template>