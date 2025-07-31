<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import DrugSearch from '@/components/DrugSearch.vue'
import DrugDetailModal from '@/components/DrugDetailModal.vue'

// State สำหรับเก็บ ID ของยาที่ต้องการดูรายละเอียด
const selectedDrugId = ref(null)

// ฟังก์ชันสำหรับเปิด Modal
function showDrugDetails(drugId) {
  selectedDrugId.value = drugId
}

// ฟังก์ชันสำหรับปิด Modal
function closeDrugDetails() {
  selectedDrugId.value = null
}
</script>

<template>
  <div class="app-root">
    <!-- แสดงหน้าค้นหาเสมอ -->
    <DrugSearch @view-details="showDrugDetails" />

    <!-- แสดง Modal ก็ต่อเมื่อ selectedDrugId มีค่า -->
    <transition name="fade">
      <DrugDetailModal
        v-if="selectedDrugId"
        :drug-id="selectedDrugId"
        @close="closeDrugDetails"
      />
    </transition>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  box-sizing: border-box;
  background: #f7fafe;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* Transition effect for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>