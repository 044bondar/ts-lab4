<script setup lang="ts">
import type { Participant } from '../types/participant';
import WinnerBadge from './WinnerBadge.vue';
import BaseButton from './BaseButton.vue';

interface Props {
  winners: Participant[];
  canPickWinner: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'pick-winner'): void;
  (e: 'remove-winner', id: string): void;
}>();
</script>

<template>
  <section class="card-block winners-block">
    <div class="winners-content">
      <span class="block-title">Winners</span>
      <div class="badges-list">
        <WinnerBadge
            v-for="winner in winners"
            :key="winner.id"
            :winner="winner"
            @remove="$emit('remove-winner', $event)"
        />
      </div>
    </div>
    <BaseButton
        variant="primary"
        :disabled="!canPickWinner"
        @click="$emit('pick-winner')"
    >
      New winner
    </BaseButton>
  </section>
</template>

<style scoped lang="scss">
.winners-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.winners-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.block-title {
  color: #8c8c8c;
  font-size: 0.95rem;
}

.badges-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>