<!-- src/App.vue -->
<script setup>
import DrugSearch from '@/components/DrugSearch.vue'
</script>

<template>
  <div class="app-root">
    <DrugSearch />
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

@media (min-width: 768px) {
  .app-container {
    padding: 2rem;
  }
}
</style>