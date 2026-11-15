<template>
  <RouterLink to="/" class="app-logo">
    <span class="logo-badge">V</span>
    <span class="logo-text">VueLottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1990ff;
}
.logo-badge {
  background: #1990ff;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: grid;
  place-items: center;
}
</style>