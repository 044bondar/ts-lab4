<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="container-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.container-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}
</style>