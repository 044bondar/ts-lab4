<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'danger' | 'secondary' | 'success';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  type: 'button',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
      :type="type"
      :disabled="disabled"
      :class="['custom-btn', `btn-${variant}`, { 'is-disabled': disabled }]"
      @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.custom-btn {
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;

  &.btn-primary {
    background-color: #1990ff;
    color: #ffffff;
    &:hover:not(:disabled) { background-color: #1177d6; }
  }

  &.btn-danger {
    background-color: #ff4d4f;
    color: #ffffff;
    &:hover:not(:disabled) { background-color: #d9363e; }
  }

  &.btn-secondary {
    background-color: #e4e7eb;
    color: #4b5563;
    &:hover:not(:disabled) { background-color: #d1d5db; }
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>