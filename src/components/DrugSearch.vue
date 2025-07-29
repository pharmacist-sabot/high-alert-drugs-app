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
        <div v-for="drug in displayedDrugs" :key="drug.id" class="drug-info">
          <div class="info-header">
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
          <button class="readmore-btn" @click="$emit('view-details', drug.id)"> อ่านข้อมูลยาฉบับเต็ม </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #0066b3;
  --primary-color-dark: #004a80;
  --secondary-color: #d0e6f9;
  --danger-color: #c0392b;
  --font-family: 'Sarabun', 'Prompt', 'Kanit', 'Roboto', sans-serif;
}

/* -- Card Container -- */
.drug-card {
  width: 30rem;
  max-width: 26rem; /* ~416px, เหมาะมือถือตั้ง/นอน */
  min-height: 32rem; /* ~512px */
  max-height: 90vh;
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-family);
}

/* -- Header -- */
.card-header {
  background: var(--primary-color);
  color: #fff;
  padding: 1.3rem 1rem 1.1rem;
  text-align: center;
}
.card-header h1 {
  font-size: 1.3rem;
  margin: 0;
  font-weight: 700;
}
.card-header p {
  margin: .4rem 0 0;
  font-size: 1rem;
  opacity: 0.86;
}

/* -- Search -- */
.card-search {
  padding: .9rem 1rem .9rem;
  background: #f8fafc;
  border-bottom: 1px solid #e9ecef;
}
.search-input {
  width: 100%;
  font-size: 1.05rem;
  padding: .85em 1em;
  border: 1px solid #dbeafe;
  border-radius: .75em;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.18s;
  font-family: inherit;
}
.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2.5px #b6dafe77;
  outline: none;
}

/* -- Main Content (Scrollable) -- */
.card-content {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem 1rem 1.3rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  text-align: left;
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  min-height: 10rem;
  text-align: center;
  font-size: 1.06rem;
  gap: 1rem;
}
.status-error { color: var(--danger-color); font-weight: 600; }
.status-notfound { color: #888; }

.spinner {
  width: 2.4em; height: 2.4em;
  border: .32em solid var(--secondary-color);
  border-top: .32em solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.list-title {
  margin: 0 0 .7rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #6c757d;
  border-bottom: 1px solid #eee;
  padding-bottom: .4rem;
  letter-spacing: .01em;
}

/* -- Drug Card -- */
.drug-info {
  background: #f6faff;
  border: 1px solid #e3eaf0;
  border-radius: .9em;
  padding: 1.1em .9em 1.1em;
  margin-bottom: 0.2em;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,.03);
  transition: box-shadow 0.12s;
  display: flex;
  flex-direction: column;
  gap: .7em;
}
.drug-info:last-child { margin-bottom: 0; }
.drug-info:hover { box-shadow: 0 2px 12px #8cc4f622; }

.info-header {
  display: flex;
  align-items: center;
  gap: .6em;
}
.info-header h2 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--primary-color);
  font-weight: 700;
  line-height: 1.1;
}
.trade-name {
  font-size: .97em;
  color: #555;
  opacity: .85;
  font-style: italic;
}

.info-section {
  margin: 0;
}
.info-section h3 {
  margin: 0 0 .3em 0;
  font-size: 1rem;
  font-weight: 600;
  color: #005ea7;
}
.info-section p {
  margin: 0;
  font-size: .97rem;
  line-height: 1.65;
  word-break: break-word;
  white-space: pre-line;
}

/* -- Read More Button -- */
.readmore-btn {
  background: var(--primary-color);
  color: #fff;
  padding: .6em 1.2em;
  border: none;
  border-radius: .6em;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.15s;
}

.readmore-btn:active {
  background: var(--primary-color);
  transform: translateY(0);
}

/* -- Responsive: Tablet & Desktop -- */
@media (min-width: 600px) {
  .drug-card {
    max-width: 28rem;
    min-height: 34rem;
  }
  .card-header h1 { font-size: 1.6rem; }
  .card-header p { font-size: 1.07rem; }
  .card-content { padding: 1.25rem 1.4rem 1.4rem; }
  .card-search { padding: 1.1rem 1.4rem 1.1rem; }
}
@media (min-width: 900px) {
  .drug-card {
    max-width: 32rem;
    min-height: 36rem;
  }
  .card-header h1 { font-size: 1.9rem; }
  .card-header p { font-size: 1.13rem; }
}

/* --- Hide scrollbar on mobile, show on hover/scroll --- */
.card-content {
  scrollbar-width: thin;
  scrollbar-color: #aad5f3 #f6faff;
}
.card-content::-webkit-scrollbar {
  width: 0.55em;
  background: #f6faff;
}
.card-content::-webkit-scrollbar-thumb {
  background: #aad5f3;
  border-radius: 1em;
}
</style>