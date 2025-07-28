<!-- src/components/DrugSearch.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

// --- STATES ---
const allDrugs = ref([])
const featuredDrug = ref(null) 
const searchTerm = ref('')
const isLoading = ref(true)
const error = ref(null)

// --- COMPUTED PROPERTIES ---

// ยาที่จะแสดงผลใน List
// ถ้ามีการค้นหา -> แสดงผลการค้นหา
// ถ้าไม่มีการค้นหา -> แสดงยาที่สุ่มมา 1 ตัว
const displayedDrugs = computed(() => {
  if (searchTerm.value.trim() !== '') {
    // โหมดค้นหา: ค้นจากชื่อสามัญและชื่อการค้า
    const lowerCaseSearch = searchTerm.value.toLowerCase()
    return allDrugs.value.filter(drug =>
      drug.generic_name.toLowerCase().includes(lowerCaseSearch) ||
      (drug.trade_name && drug.trade_name.toLowerCase().includes(lowerCaseSearch))
    )
  }
  
  // โหมดปกติ: แสดงยาที่สุ่มมา
  return featuredDrug.value ? [featuredDrug.value] : []
})

// --- METHODS ---

// ฟังก์ชันสำหรับดึงข้อมูลยาจากฐานข้อมูล
async function fetchDrugs() {
  try {
    isLoading.value = true
    const { data, error: dbError } = await supabase
      .from('high_alert_drugs')
      .select('id, generic_name, trade_name, summary_preparation, summary_stability, summary_monitoring')
      .order('generic_name', { ascending: true })

    if (dbError) {
      throw dbError
    }

    allDrugs.value = data
    setRandomFeaturedDrug() // เมื่อได้ข้อมูลมาแล้ว ให้สุ่มยา 1 ตัว

  } catch (e) {
    console.error('Error fetching drugs:', e)
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูลยา'
  } finally {
    isLoading.value = false
  }
}

// ฟังก์ชันสำหรับสุ่มยา 1 ตัวมาแสดง
function setRandomFeaturedDrug() {
  if (allDrugs.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * allDrugs.value.length)
    featuredDrug.value = allDrugs.value[randomIndex]
  }
}

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  fetchDrugs()
})
</script>

<template>
  <div class="drug-app-card">
    <!-- 1. HEADER: ส่วนหัวของการ์ด -->
    <header class="app-card-header">
      <h1>High Alert Drugs</h1>
      <p>โรงพยาบาลสระโบสถ์</p>
    </header>

    <!-- 2. SEARCH: ส่วนค้นหา -->
    <div class="search-section">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="🔍 ค้นหาชื่อยา..."
        class="search-input"
      />
    </div>

    <!-- 3. CONTENT: ส่วนแสดงผลข้อมูล -->
    <div class="content-section">
      <!-- สถานะ Loading -->
      <div v-if="isLoading" class="status-display">
        <div class="spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <!-- สถานะ Error -->
      <div v-else-if="error" class="status-display error">
        <p>⚠️ {{ error }}</p>
      </div>
      
      <!-- สถานะ "ไม่พบข้อมูล" (เฉพาะตอนค้นหา) -->
      <div v-else-if="searchTerm && displayedDrugs.length === 0" class="status-display">
        <p>ไม่พบยาที่ชื่อ "{{ searchTerm }}"</p>
      </div>
      
      <!-- แสดงผลรายการยา -->
      <div v-else class="results-list">
        <!-- เพิ่มหัวข้อเล็กน้อยเพื่อบอกผู้ใช้ว่ากำลังดูอะไรอยู่ -->
        <h3 v-if="!searchTerm" class="list-title">ยาแนะนำวันนี้</h3>
        <h3 v-else class="list-title">ผลการค้นหา ({{ displayedDrugs.length }} รายการ)</h3>

        <div v-for="drug in displayedDrugs" :key="drug.id" class="drug-info-card">
          <div class="card-header">
            <h2>{{ drug.generic_name }}</h2>
            <span v-if="drug.trade_name" class="trade-name">{{ drug.trade_name }}</span>
          </div>
          <div class="info-section">
            <h3>💧 วิธีการผสม (Preparation)</h3>
            <p>{{ drug.summary_preparation }}</p>
          </div>
          <div class="info-section">
            <h3>⏳ ความคงตัว (Stability)</h3>
            <p>{{ drug.summary_stability }}</p>
          </div>
          <div class="info-section">
            <h3>🩺 การติดตาม (Monitoring)</h3>
            <p>{{ drug.summary_monitoring }}</p>
          </div>
          <button class="read-more-btn">อ่านข้อมูลยาฉบับเต็ม</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- โครงสร้างหลักของการ์ดแอป --- */
.drug-app-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* ทำให้ขอบมนมีผลกับ content ภายใน */
  display: flex;
  flex-direction: column;
}

/* --- 1. ส่วนหัวของการ์ด --- */
.app-card-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.app-card-header h1 {
  margin: 0;
  font-size: 1.6rem;
}
.app-card-header p {
  margin: 0.25rem 0 0;
  opacity: 0.85;
}

/* --- 2. ส่วนค้นหา --- */
.search-section {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}
.search-input {
  width: 100%;
  padding: 14px 20px;
  font-size: 1.1rem;
  font-family: var(--font-family);
  border-radius: 12px;
  border: 1px solid #dee2e6;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
}
.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.2);
}

/* --- 3. ส่วนแสดงผล --- */
.content-section {
  padding: 1.5rem;
  flex: 1; 
  min-height: 25rem; 
  min-width: 27rem;
  display: center;
  flex-direction: column;
}

.status-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #6c757d;
  padding: 2rem;
  flex: 1;
}
.status-display.error {
  color: var(--danger-color);
  font-weight: 600;
}
.spinner {
  margin: 0 auto 1rem;
  width: 40px;
  height: 40px;
  border: 4px solid var(--secondary-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.list-title {
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

/* --- การ์ดข้อมูลยา (ย่อย) --- */
.drug-info-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  background-color: #ffffff;
  transition: box-shadow 0.2s ease;
}
.drug-info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.results-list .drug-info-card:not(:last-child) {
    margin-bottom: 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--primary-color);
}
.trade-name {
  font-size: 1rem;
  color: #555;
  font-style: italic;
}
.info-section {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #f1f3f5;
}
.info-section:first-of-type {
   border-top: none;
   margin-top: 0.5rem;
   padding-top: 0;
}
.info-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}
.info-section p {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
}
.read-more-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 12px 16px;
  border: none;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;
}
.read-more-btn:hover {
  background-color: #004a80;
}

/* --- Responsive for Larger Screens --- */
@media (min-width: 768px) {
  .app-card-header h1 { font-size: 2rem; }
  .search-section, .content-section { padding: 2rem; }
  .drug-info-card { padding: 2rem; }
  .read-more-btn { width: auto; }
}
</style>