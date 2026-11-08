<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void;
}>();

const searchQuery = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (newValue) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', newValue.trim());
  }, 300);
});
</script>

<template>
  <div class="search-bar">
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Пошук за іменем..."
        class="search-input"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #1990ff;
  }
}
</style>