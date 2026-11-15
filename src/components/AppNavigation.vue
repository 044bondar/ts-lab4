<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <nav class="main-nav">
    <RouterLink to="/" exact-active-class="active-link">Home</RouterLink>
    <RouterLink to="/about" active-class="active-link">About author</RouterLink>
    <RouterLink to="/users" active-class="active-link">Users</RouterLink>

    <button v-if="authStore.isAuthenticated" class="btn-logout" @click="handleLogout">
      Logout ({{ authStore.user?.username }})
    </button>
    <RouterLink v-else to="/login" active-class="active-link">Login</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.main-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;

  a {
    text-decoration: none;
    color: #4b5563;
    font-weight: 500;
    padding: 0.35rem 0.6rem;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      color: #1990ff;
    }

    &.active-link {
      color: #1990ff;
      background-color: #e6f4ff;
      font-weight: 600;
    }
  }
}

.btn-logout {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>