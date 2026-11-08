<script setup lang="ts">
import type { Participant } from '../types/participant';

defineProps<{
  winner: Participant;
}>();

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <div class="winner-badge">
    <span class="winner-name">{{ winner.name }}</span>
    <button class="btn-close-badge" title="Видалити переможця" @click="$emit('remove', winner.id)">
      &times;
    </button>
  </div>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  background-color: #1990ff;
  color: #ffffff;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  font-size: 0.85rem;
  gap: 0.5rem;
}

.btn-close-badge {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #ffcccc;
  }
}
</style>