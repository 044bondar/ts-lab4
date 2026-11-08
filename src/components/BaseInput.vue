<script setup lang="ts">
interface Props {
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  isValid?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  type: 'text',
  placeholder: '',
  errorMessage: '',
  isValid: false,
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="base-input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :class="['form-control-custom', { 'has-error': !!errorMessage, 'is-valid': isValid && !errorMessage }]"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="isValid && !errorMessage" class="valid-icon">&#10003;</span>
    </div>
    <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
  </div>
</template>

<style scoped lang="scss">
.base-input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.35rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control-custom {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #1990ff;
    box-shadow: 0 0 0 2px rgba(25, 144, 255, 0.2);
  }

  &.is-valid {
    border-color: #52c41a;
  }

  &.has-error {
    border-color: #ff4d4f;
    background-color: #fff1f0;
  }
}

.valid-icon {
  position: absolute;
  right: 12px;
  color: #52c41a;
  font-weight: bold;
}

.error-text {
  font-size: 0.75rem;
  color: #ff4d4f;
  margin-top: 0.25rem;
}
</style>
