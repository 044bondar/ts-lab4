<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users.store';
import type { User } from '@/types/user';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

const props = defineProps<{ user: User }>();
const emit = defineEmits<{ (e: 'updated', user: User): void }>();

const router = useRouter();
const usersStore = useUsersStore();

const schema = toTypedSchema(
    zod.object({
      firstName: zod.string().min(2, 'Мінімум 2 символи'),
      lastName: zod.string().min(2, 'Мінімум 2 символи'),
      email: zod.string().email('Некоректний формат email'),
      age: zod.number({ invalid_type_error: 'Вкажіть число' }).min(18, 'Від 18 років').max(120),
      phone: zod.string().min(10, 'Введіть коректний номер телефону'),
    })
);

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    email: props.user.email,
    age: props.user.age,
    phone: props.user.phone,
  },
});

const { value: firstName, errorMessage: firstNameErr } = useField<string>('firstName');
const { value: lastName, errorMessage: lastNameErr } = useField<string>('lastName');
const { value: email, errorMessage: emailErr } = useField<string>('email');
const { value: age, errorMessage: ageErr } = useField<number>('age');
const { value: phone, errorMessage: phoneErr } = useField<string>('phone');

const onSave = handleSubmit(async (values) => {
  await usersStore.updateUser(props.user.id, values);
  emit('updated', { ...props.user, ...values });
  router.push(`/users/${props.user.id}`);
});
</script>

<template>
  <div class="p-3 border rounded bg-light">
    <h4 class="mb-3">Редагування даних користувача</h4>
    <form class="row g-3" @submit.prevent="onSave">
      <div class="col-md-6">
        <label class="form-label">First Name</label>
        <input v-model="firstName" class="form-control" />
        <small v-if="firstNameErr" class="text-danger">{{ firstNameErr }}</small>
      </div>
      <div class="col-md-6">
        <label class="form-label">Last Name</label>
        <input v-model="lastName" class="form-control" />
        <small v-if="lastNameErr" class="text-danger">{{ lastNameErr }}</small>
      </div>
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input v-model="email" class="form-control" />
        <small v-if="emailErr" class="text-danger">{{ emailErr }}</small>
      </div>
      <div class="col-md-3">
        <label class="form-label">Age</label>
        <input v-model.number="age" type="number" class="form-control" />
        <small v-if="ageErr" class="text-danger">{{ ageErr }}</small>
      </div>
      <div class="col-md-3">
        <label class="form-label">Phone</label>
        <input v-model="phone" class="form-control" />
        <small v-if="phoneErr" class="text-danger">{{ phoneErr }}</small>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-success me-2">Зберегти зміни</button>
        <RouterLink :to="`/users/${user.id}`" class="btn btn-secondary">Скасувати</RouterLink>
      </div>
    </form>
  </div>
</template>