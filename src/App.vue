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
  min-height: 100%;
  min-width: 100%;
  box-sizing: border-box;
  background: #f7fafe;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}
</style>