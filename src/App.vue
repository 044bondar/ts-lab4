<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import type { Participant } from './types/participant';
import WinnersList from './components/WinnersList.vue';
import RegisterForm from './components/RegisterForm.vue';
import ParticipantsTable from './components/ParticipantsTable.vue';
import ModalWindow from './components/ModalWindow.vue';
import BaseInput from './components/BaseInput.vue';
import BaseButton from './components/BaseButton.vue';

// 1. Стан списку учасників
const participants = ref<Participant[]>([]);
const winners = ref<Participant[]>([]);

// Зчитування з localStorage при монтуванні
onMounted(() => {
  const saved = localStorage.getItem('vue_lottery_participants');
  if (saved) {
    try {
      participants.value = JSON.parse(saved);
    } catch {
      participants.value = [];
    }
  } else {
    // Дефолтні дані для наочності
    participants.value = [
      { id: '1', name: 'Amsterdam', dob: '1990-10-01', email: 'email1@example.com', phone: '+380635555555' },
      { id: '2', name: 'Washington', dob: '1985-05-02', email: 'email2@example.com', phone: '+380635555556' },
      { id: '3', name: 'Sydney', dob: '1987-08-15', email: 'email3@example.com', phone: '+380635555557' }
    ];
  }
});

// Збереження у localStorage через глибокий watcher
watch(
    participants,
    (newList) => {
      localStorage.setItem('vue_lottery_participants', JSON.stringify(newList));
    },
    { deep: true }
);

// 2. Логіка блоку переможців
const canPickWinner = computed(() => {
  if (winners.value.length >= 3) return false;
  const availableParticipants = participants.value.filter(
      (p) => !winners.value.some((w) => w.id === p.id)
  );
  return availableParticipants.length > 0;
});

const pickNewWinner = () => {
  if (!canPickWinner.value) return;

  const candidates = participants.value.filter(
      (p) => !winners.value.some((w) => w.id === p.id)
  );

  const randomIndex = Math.floor(Math.random() * candidates.length);
  winners.value.push(candidates[randomIndex]);
};

const removeWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};

// 3. Додавання нового учасника
const handleAddParticipant = (newParticipant: Omit<Participant, 'id'>) => {
  const created: Participant = {
    ...newParticipant,
    id: Date.now().toString(),
  };
  participants.value.push(created);
};

const existingEmails = computed(() => participants.value.map((p) => p.email));

// 4. Логіка видалення через модальне вікно
const isDeleteModalOpen = ref(false);
const participantToDelete = ref<Participant | null>(null);

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  participantToDelete.value = null;
  isDeleteModalOpen.value = false;
};

const confirmDelete = () => {
  if (participantToDelete.value) {
    const id = participantToDelete.value.id;
    // Видаляємо з основного списку
    participants.value = participants.value.filter((p) => p.id !== id);
    // Видаляємо з переможців, якщо він там був
    winners.value = winners.value.filter((w) => w.id !== id);
  }
  closeDeleteModal();
};

// 5. Логіка редагування через модальне вікно
const isEditModalOpen = ref(false);
const editForm = reactive({
  id: '',
  name: '',
  dob: '',
  email: '',
  phone: '',
});
const editErrors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
});

const openEditModal = (participant: Participant) => {
  editForm.id = participant.id;
  editForm.name = participant.name;
  editForm.dob = participant.dob;
  editForm.email = participant.email;
  editForm.phone = participant.phone;

  editErrors.name = '';
  editErrors.dob = '';
  editErrors.email = '';
  editErrors.phone = '';

  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const validateEdit = (): boolean => {
  let valid = true;

  if (!editForm.name.trim()) {
    editErrors.name = 'This value is required';
    valid = false;
  } else editErrors.name = '';

  if (!editForm.dob) {
    editErrors.dob = 'This value is required';
    valid = false;
  } else if (new Date(editForm.dob) > new Date()) {
    editErrors.dob = 'Date cannot be in future';
    valid = false;
  } else editErrors.dob = '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!editForm.email.trim()) {
    editErrors.email = 'This value is required';
    valid = false;
  } else if (!emailRegex.test(editForm.email.trim())) {
    editErrors.email = 'Invalid email';
    valid = false;
  } else {
    // Перевірка унікальності email: власний email не вважається дублікатом
    const isDuplicate = participants.value.some(
        (p) => p.id !== editForm.id && p.email.toLowerCase() === editForm.email.trim().toLowerCase()
    );
    if (isDuplicate) {
      editErrors.email = 'Email already taken';
      valid = false;
    } else editErrors.email = '';
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!editForm.phone.trim()) {
    editErrors.phone = 'This value is required';
    valid = false;
  } else if (!phoneRegex.test(editForm.phone.trim())) {
    editErrors.phone = 'Format +380XXXXXXXXX';
    valid = false;
  } else editErrors.phone = '';

  return valid;
};

const saveEditedParticipant = () => {
  if (!validateEdit()) return;

  const index = participants.value.findIndex((p) => p.id === editForm.id);
  if (index !== -1) {
    participants.value[index] = {
      id: editForm.id,
      name: editForm.name.trim(),
      dob: editForm.dob,
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
    };

    // Оновлюємо дані у переможцях, якщо відредагований учасник є переможцем
    const winnerIdx = winners.value.findIndex((w) => w.id === editForm.id);
    if (winnerIdx !== -1) {
      winners.value[winnerIdx] = { ...participants.value[index] };
    }
  }

  closeEditModal();
};
</script>

<template>
  <main class="lottery-wrapper">
    <!-- 1. Блок переможців -->
    <WinnersList
        :winners="winners"
        :can-pick-winner="canPickWinner"
        @pick-winner="pickNewWinner"
        @remove-winner="removeWinner"
    />

    <!-- 2. Форма реєстрації -->
    <RegisterForm
        :existing-emails="existingEmails"
        @add-participant="handleAddParticipant"
    />

    <!-- 3. Таблиця учасників -->
    <ParticipantsTable
        :participants="participants"
        @edit="openEditModal"
        @delete="openDeleteModal"
    />

    <!-- Модальне вікно видалення зі слотами -->
    <ModalWindow
        :is-open="isDeleteModalOpen"
        title="Підтвердження видалення"
        @close="closeDeleteModal"
    >
      <p>
        Ви дійсно бажаєте видалити учасника
        <strong>"{{ participantToDelete?.name }}"</strong>,
        <strong>"{{ participantToDelete?.email }}"</strong>?
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="closeDeleteModal">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </ModalWindow>

    <!-- Модальне вікно редагування зі слотами -->
    <ModalWindow
        :is-open="isEditModalOpen"
        title="Редагування даних учасника"
        @close="closeEditModal"
    >
      <div @keydown.enter.prevent="saveEditedParticipant">
        <BaseInput
            v-model="editForm.name"
            label="Name"
            :error-message="editErrors.name"
        />
        <BaseInput
            v-model="editForm.dob"
            label="Date of Birth"
            type="date"
            :error-message="editErrors.dob"
        />
        <BaseInput
            v-model="editForm.email"
            label="Email"
            type="email"
            :error-message="editErrors.email"
        />
        <BaseInput
            v-model="editForm.phone"
            label="Phone number"
            type="tel"
            :error-message="editErrors.phone"
        />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="closeEditModal">Скасувати</BaseButton>
        <BaseButton variant="primary" @click="saveEditedParticipant">Оновити дані</BaseButton>
      </template>
    </ModalWindow>
  </main>
</template>