<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { Participant } from '../types/participant';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  existingEmails: string[];
}>();

const emit = defineEmits<{
  (e: 'add-participant', participant: Omit<Participant, 'id'>): void;
}>();

const formData = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
});

const errors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
});

// Прапорець, що забороняє показ валідації до першої спроби відправки
const isSubmitted = ref(false);

const validate = (): boolean => {
  let isValid = true;

  // 1. Валідація імені
  if (!formData.name.trim()) {
    errors.name = 'This value is required';
    isValid = false;
  } else {
    errors.name = '';
  }

  // 2. Валідація дати народження
  if (!formData.dob) {
    errors.dob = 'This value is required';
    isValid = false;
  } else {
    const selectedDate = new Date(formData.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.dob = 'Date of birth cannot be in the future';
      isValid = false;
    } else {
      errors.dob = '';
    }
  }

  // 3. Валідація Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'This value is required';
    isValid = false;
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Invalid email format';
    isValid = false;
  } else if (
      props.existingEmails.some(
          (e) => e.toLowerCase() === formData.email.trim().toLowerCase()
      )
  ) {
    errors.email = 'Participant with this email already exists';
    isValid = false;
  } else {
    errors.email = '';
  }

  // 4. Валідація телефону: +380XXXXXXXXX
  const phoneRegex = /^\+380\d{9}$/;
  if (!formData.phone.trim()) {
    errors.phone = 'This value is required';
    isValid = false;
  } else if (!phoneRegex.test(formData.phone.trim())) {
    errors.phone = 'Format must be +380XXXXXXXXX';
    isValid = false;
  } else {
    errors.phone = '';
  }

  return isValid;
};

const handleSubmit = () => {
  isSubmitted.value = true;
  if (!validate()) return;

  emit('add-participant', {
    name: formData.name.trim(),
    dob: formData.dob,
    email: formData.email.trim(),
    phone: formData.phone.trim(),
  });

  // Очищення форми без виклику валідації
  formData.name = '';
  formData.dob = '';
  formData.email = '';
  formData.phone = '';

  errors.name = '';
  errors.dob = '';
  errors.email = '';
  errors.phone = '';

  isSubmitted.value = false;
};

// Індикатори валідності для підсвічування зеленим
const isNameValid = computed(() => isSubmitted.value && !errors.name && formData.name.trim().length > 0);
const isDobValid = computed(() => isSubmitted.value && !errors.dob && formData.dob.length > 0);
const isEmailValid = computed(() => isSubmitted.value && !errors.email && formData.email.trim().length > 0);
const isPhoneValid = computed(() => isSubmitted.value && !errors.phone && formData.phone.trim().length > 0);
</script>

<template>
  <section class="card-block" @keydown.enter.prevent="handleSubmit">
    <div class="form-header">
      <h2>REGISTER FORM</h2>
      <p class="subtitle">Please fill in all the fields.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <BaseInput
          v-model="formData.name"
          label="Name"
          placeholder="Enter user name"
          :error-message="errors.name"
          :is-valid="isNameValid"
      />

      <BaseInput
          v-model="formData.dob"
          label="Date of Birth"
          type="date"
          placeholder="yyyy-mm-dd"
          :error-message="errors.dob"
          :is-valid="isDobValid"
      />

      <BaseInput
          v-model="formData.email"
          label="Email"
          type="email"
          placeholder="Enter email"
          :error-message="errors.email"
          :is-valid="isEmailValid"
      />

      <BaseInput
          v-model="formData.phone"
          label="Phone number"
          type="tel"
          placeholder="Enter Phone number (+380...)"
          :error-message="errors.phone"
          :is-valid="isPhoneValid"
      />

      <div class="form-actions">
        <BaseButton type="submit" variant="primary">
          Save
        </BaseButton>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.form-header {
  margin-bottom: 1.25rem;

  h2 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
    color: #333333;
  }

  .subtitle {
    font-size: 0.85rem;
    color: #8c8c8c;
    margin-top: 0.25rem;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>