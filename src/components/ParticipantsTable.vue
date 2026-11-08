<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Participant, SortField, SortOrder } from '../types/participant';
import SearchBar from './SearchBar.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  participants: Participant[];
}>();

defineEmits<{
  (e: 'edit', participant: Participant): void;
  (e: 'delete', participant: Participant): void;
}>();

const searchQuery = ref('');
const sortField = ref<SortField>('name');
const sortOrder = ref<SortOrder>('asc');

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const toggleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const processedList = computed(() => {
  // 1. Фільтрація за іменем
  let result = props.participants.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  // 2. Сортування
  result.sort((a, b) => {
    let comparison = 0;
    if (sortField.value === 'name') {
      comparison = a.name.localeCompare(b.name, 'uk');
    } else if (sortField.value === 'dob') {
      comparison = new Date(a.dob).getTime() - new Date(b.dob).getTime();
    }
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });

  return result;
});
</script>

<template>
  <section class="card-block">
    <SearchBar @filter-by-name="handleSearch" />

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
        <tr>
          <th>#</th>
          <th class="sortable-header" @click="toggleSort('name')">
            Name
            <span class="sort-icon">
                {{ sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
              </span>
          </th>
          <th class="sortable-header" @click="toggleSort('dob')">
            Date of Birth
            <span class="sort-icon">
                {{ sortField === 'dob' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
              </span>
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th class="text-end">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="processedList.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">
            Учасників не знайдено
          </td>
        </tr>
        <tr v-for="(item, index) in processedList" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td class="fw-semibold">{{ item.name }}</td>
          <td>{{ item.dob }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
          <td class="text-end">
            <div class="action-buttons">
              <BaseButton variant="secondary" @click="$emit('edit', item)">
                Редагувати
              </BaseButton>
              <BaseButton variant="danger" @click="$emit('delete', item)">
                Видалити
              </BaseButton>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sortable-header {
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #1990ff;
  }
}

.sort-icon {
  font-size: 0.8rem;
  margin-left: 0.25rem;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>