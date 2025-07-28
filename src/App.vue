<!-- src/App.vue  -->
<script setup>
import DrugSearch from '@/components/DrugSearch.vue'
</script>

<template>
  <div class="app-container">
    <DrugSearch />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 1rem;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .app-container {
    padding: 2rem;
  }
}
</style>