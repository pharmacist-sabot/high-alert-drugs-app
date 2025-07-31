<!-- src/components/DrugSearch.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const allDrugs = ref([])
const featuredDrug = ref(null)
const searchTerm = ref('')
const isLoading = ref(true)
const error = ref(null)
const emit = defineEmits(['view-details'])

const displayedDrugs = computed(() => {
  if (searchTerm.value.trim() !== '') {
    const lc = searchTerm.value.toLowerCase()
    return allDrugs.value.filter(drug =>
      drug.generic_name.toLowerCase().includes(lc) ||
      (drug.trade_name && drug.trade_name.toLowerCase().includes(lc))
    )
  }
  return featuredDrug.value ? [featuredDrug.value] : []
})

async function fetchDrugs() {
  try {
    isLoading.value = true
    const { data, error: dbError } = await supabase
      .from('high_alert_drugs')
      .select('id, generic_name, trade_name, summary_preparation, summary_stability, summary_monitoring')
      .order('generic_name', { ascending: true })
    if (dbError) throw dbError
    allDrugs.value = data
    setRandomFeaturedDrug()
  } catch (e) {
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูลยา'
  } finally {
    isLoading.value = false
  }
}

function setRandomFeaturedDrug() {
  if (allDrugs.value.length > 0) {
    const idx = Math.floor(Math.random() * allDrugs.value.length)
    featuredDrug.value = allDrugs.value[idx]
  }
}

onMounted(fetchDrugs)
</script>

<template>
  <div class="drug-card">
    <!-- HEADER -->
    <header class="card-header">
      <h1>High Alert Drugs</h1>
      <p>โรงพยาบาลสระโบสถ์</p>
    </header>

    <!-- SEARCH -->
    <div class="card-search">
      <input
        type="search"
        v-model="searchTerm"
        placeholder="ค้นหาชื่อยา..."
        class="search-input"
        autocomplete="off"
      />
    </div>

    <!-- CONTENT (scrollable) -->
    <main class="card-content" tabindex="-1">
      <div v-if="isLoading" class="status status-loading">
        <div class="spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
      <div v-else-if="error" class="status status-error">
        <p>⚠️ {{ error }}</p>
      </div>
      <div v-else-if="searchTerm && displayedDrugs.length === 0" class="status status-notfound">
        <p>ไม่พบยาที่ชื่อ "{{ searchTerm }}"</p>
      </div>
      <div v-else class="results">
        <h3 class="list-title" v-if="!searchTerm">ยาแนะนำวันนี้</h3>
        <h3 class="list-title" v-else>ผลการค้นหา ({{ displayedDrugs.length }} รายการ)</h3>
        
        <div v-for="drug in displayedDrugs" :key="drug.id" class="drug-item">
          <div class="info-header">
            <h2>{{ drug.generic_name }}</h2>
            <span v-if="drug.trade_name" class="trade-name">{{ drug.trade_name }}</span>
          </div>

          <div class="info-details-grid">
            <div class="info-card">
              <h3>💧 วิธีการผสม (Preparation)</h3>
              <p>{{ drug.summary_preparation }}</p>
            </div>
            <div class="info-card">
              <h3>⏳ ความคงตัว (Stability)</h3>
              <p>{{ drug.summary_stability }}</p>
            </div>
            <div class="info-card">
              <h3>🩺 การติดตาม (Monitoring)</h3>
              <p>{{ drug.summary_monitoring }}</p>
            </div>
          </div>

          <button class="readmore-btn" @click="$emit('view-details', drug.id)"> อ่านข้อมูลยาฉบับเต็ม </button>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="card-footer-credit">
      <p>พัฒนาโดย ภก.สุรเดช ประถมศักดิ์ ©2025 สงวนลิขสิทธิ์</p>
    </footer>

  </div>
</template>

<style scoped>
:root {
  --primary-color: #d97706;  /* amber-600 */
  --primary-color-dark: #b45309; /* amber-700 */
  --secondary-color: #fef3c7; /* amber-100 */
  --focus-ring-color: #fcd34d66; /* amber-300 with opacity */
  --danger-color: #c0392b;
  --font-family: 'Prompt'; /* FONT CHANGED */
}

/* -- Card Container -- */
.drug-card {
  width: 50rem;
  max-width: 26rem;
  min-height: 32rem;
  max-height: 90vh;
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-family); /* FONT APPLIED */
}

/* -- Header -- */
.card-header {
  background: var(--primary-color); /* Corrected: Uses orange variable */
  color: #fff;
  padding: 1.3rem 1rem 1.1rem;
  text-align: center;
  flex-shrink: 0;
}
.card-header h1 {
  font-size: 1.3rem; margin: 0; font-weight: 700;
}
.card-header p {
  margin: .4rem 0 0; font-size: 1rem; opacity: 0.9;
}

/* -- Search -- */
.card-search {
  padding: .9rem 1rem .9rem;
  background: #fdfdfe;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}
.search-input {
  width: 100%; font-size: 1.05rem; padding: .85em 1em;
  border: 1px solid #e5e7eb; border-radius: .75em;
  background: #fff; box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.18s;
  font-family: inherit;
}
.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2.5px var(--focus-ring-color);
  outline: none;
}

/* -- Main Content (Scrollable) -- */
.card-content {
  flex: 1 1 0; min-height: 0; overflow-y: auto;
  padding: 1rem 1rem 1.3rem; background: #f9fafb;
  display: flex; flex-direction: column; gap: 1.1rem; text-align: left;
}

.status {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #6c757d; min-height: 10rem; text-align: center;
  font-size: 1.06rem; gap: 1rem;
}
.status-error { color: var(--danger-color); font-weight: 600; }
.status-notfound { color: #888; }

.spinner {
  width: 2.4em; height: 2.4em;
  border: .32em solid var(--secondary-color);
  border-top: .32em solid var(--primary-color); /* Corrected: Uses orange variable */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.list-title {
  margin: 0 0 .7rem 0; font-size: 1.05rem; font-weight: 600; color: #6c757d;
  border-bottom: 1px solid #e5e7eb; padding-bottom: .4rem; letter-spacing: .01em;
}

.drug-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: .9em;
  padding: 1.1em .9em 1.1em;
  margin-bottom: 0.2em;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,.04);
  transition: box-shadow 0.12s;
  display: flex;
  flex-direction: column;
  gap: .9em;
}
.drug-item:last-child { margin-bottom: 0; }
.drug-item:hover { box-shadow: 0 2px 12px #e5e7eb; }

.info-header {
  display: flex; align-items: center; gap: .6em;
}
.info-header h2 {
  margin: 0; font-size: 1.15rem; color: var(--primary-color-dark);
  font-weight: 700; line-height: 1.1;
}
.trade-name {
  font-size: .97em; color: #555; opacity: .85; font-style: italic;
}

.info-details-grid {
  display: flex; flex-direction: column; gap: 0.7rem;
}
.info-card {
  background: #fdfdfd; border: 1px solid #f3f4f6;
  border-radius: .7em; padding: .8em 1em;
}
.info-card h3 {
  margin: 0 0 .4em 0; font-size: 1rem;
  font-weight: 600; color: #b45309;
}
.info-card p {
  margin: 0; font-size: .97rem; line-height: 1.65;
  word-break: break-word; white-space: pre-line; color: #374151;
}

/* -- Read More Button -- */
/* --- Read More Button: แบบที่ 1 (Polished & Professional) --- */
.readmore-btn {
  background: var(--primary-color);
  color: #fff;
  padding: .7em 1.3em; /* เพิ่ม padding เล็กน้อยให้ดูสมส่วนขึ้น */
  border: none;
  border-radius: .7em;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  margin-top: .3rem;
  
  /* เพิ่มเงาเริ่มต้นและ transition */
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.2); /* เงาสีส้มจางๆ */
  transition: all 0.25s ease-out; /* ทำให้ทุกอย่างเปลี่ยนอย่างนุ่มนวล */
}

.readmore-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 15px rgba(180, 83, 9, 0.3);
}

.readmore-btn:active {
  /* ทำให้ปุ่มยุบลงตอนกด */
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(180, 83, 9, 0.2);
}

/* -- Footer -- */
.card-footer-credit {
  flex-shrink: 0; text-align: center;
  padding: .7rem 1rem; background: #f9fafb;
  border-top: 1px solid #f3f4f6;
}
.card-footer-credit p {
  margin: 0; font-size: 0.8rem; color: #6b7280;
}

/* --- Scrollbar --- */
.card-content {
  scrollbar-width: thin; scrollbar-color: #fcd34d #f9fafb;
}
.card-content::-webkit-scrollbar {
  width: 0.55em; background: #f9fafb;
}
.card-content::-webkit-scrollbar-thumb {
  background: #fcd34d; border-radius: 1em;
}

/* -- Responsive -- */
@media (min-width: 600px) {
  .drug-card { max-width: 28rem; min-height: 34rem; }
  .card-header h1 { font-size: 1.6rem; }
  .card-header p { font-size: 1.07rem; }
}
@media (min-width: 900px) {
  .drug-card { max-width: 32rem; min-height: 36rem; }
  .card-header h1 { font-size: 1.9rem; }
  .card-header p { font-size: 1.13rem; }
}
</style>