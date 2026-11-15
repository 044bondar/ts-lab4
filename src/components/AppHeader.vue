<script setup lang="ts">
import Logo from './Logo.vue';
import AppNavigation from './AppNavigation.vue';
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}
.header-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0.85rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>