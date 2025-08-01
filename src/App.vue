<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import DrugSearch from '@/components/DrugSearch.vue'
import DrugDetailModal from '@/components/DrugDetailModal.vue'

const selectedDrugId = ref(null)

function showDrugDetails(drugId) {
  selectedDrugId.value = drugId
}

function closeDrugDetails() {
  selectedDrugId.value = null
}
</script>

<template>
  <div class="app-container">
    <DrugSearch @view-details="showDrugDetails" />

    <transition name="modal-fade">
      <DrugDetailModal
        v-if="selectedDrugId"
        :drug-id="selectedDrugId"
        @close="closeDrugDetails"
      />
    </transition>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Start content from the top */
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for better mobile support */
  width: 100%;
  padding: var(--content-padding);
  background-color: #f0f2f5; /* A slightly different background to make the card pop */
}

/* Transition for the modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* On larger screens, center the content vertically */
@media (min-width: 768px) {
  .app-container {
    justify-content: center;
  }
}
</style>