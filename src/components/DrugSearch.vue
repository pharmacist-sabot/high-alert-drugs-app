<!-- src/components/DrugSearch.vue -->
<!-- ... TEMPLATE AND SCRIPT sections remain the same ... -->
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
  <div class="drug-search-card">
    <header class="card-header">
      <h1>High Alert Drugs</h1>
      <p>โรงพยาบาลสระโบสถ์</p>
    </header>

    <div class="card-search">
      <input
        type="search"
        v-model="searchTerm"
        placeholder="ค้นหาชื่อยา..."
        class="search-input"
        autocomplete="off"
      />
    </div>

    <main class="card-content" tabindex="-1">
      <div v-if="isLoading" class="status-indicator">
        <div class="spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
      <div v-else-if="error" class="status-indicator error">
        <p>⚠️ {{ error }}</p>
      </div>
      <div v-else-if="searchTerm && displayedDrugs.length === 0" class="status-indicator not-found">
        <p>ไม่พบยาที่ชื่อ "{{ searchTerm }}"</p>
      </div>
      <div v-else class="results-container">
        <h3 class="results-title" v-if="!searchTerm">ยาแนะนำวันนี้</h3>
        <h3 class="results-title" v-else>ผลการค้นหา ({{ displayedDrugs.length }} รายการ)</h3>
        
        <div v-for="drug in displayedDrugs" :key="drug.id" class="drug-item">
          <div class="drug-item-header">
            <h2>{{ drug.generic_name }}</h2>
            <span v-if="drug.trade_name" class="trade-name">{{ drug.trade_name }}</span>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <h3>💧 การผสม</h3>
              <p>{{ drug.summary_preparation }}</p>
            </div>
            <div class="info-item">
              <h3>⏳ ความคงตัว</h3>
              <p>{{ drug.summary_stability }}</p>
            </div>
            <div class="info-item">
              <h3>🩺 การติดตาม</h3>
              <p>{{ drug.summary_monitoring }}</p>
            </div>
          </div>

          <button class="readmore-btn" @click="$emit('view-details', drug.id)">
            อ่านข้อมูลฉบับเต็ม
          </button>
        </div>
      </div>
    </main>

    <footer class="card-footer">
      <p>พัฒนาโดย ภก.สุรเดช ประถมศักดิ์ ©2025</p>
    </footer>
  </div>
</template>

<style scoped>
/* MOBILE-FIRST STYLES (Base) */
.drug-search-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px; /* Max width for mobile-like views */
  height: 90vh; /* Use most of the screen height */
  height: 90dvh;
  background-color: var(--color-background-light);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: var(--font-family-main);
}

/* Header */
.card-header {
  background-color: var(--primary-color);
  color: #fff;
  padding: 1rem 1.25rem;
  text-align: center;
  flex-shrink: 0;
}
.card-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}
.card-header p {
  margin-top: 0.25rem;
  font-size: 1rem;
  opacity: 0.9;
}

/* Search */
.card-search {
  padding: 1rem;
  background-color: #fdfdfe;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.search-input {
  width: 100%;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius-md);
  transition: var(--transition-fast);
}
.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--focus-ring-color);
}

/* Main Content (Scrollable) */
.card-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.25rem 1rem;
  background-color: #f9fafb;
}

/* Status Indicators */
.status-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 10rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}
.status-indicator.error { color: var(--danger-color); font-weight: 600; }
.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 0.3rem solid var(--secondary-color);
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Results */
.results-container {
  text-align: left; /* NEW: Align all content left */
}
.results-title {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Individual Drug Item */
.drug-item {
  background-color: #fff;
  border-radius: var(--border-radius-md);
  border: 1px solid #e5e7eb;
  padding: 1.25rem; /* Increased padding */
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Increased gap */
  transition: box-shadow var(--transition-fast);
}
.drug-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0, .06);
}
.drug-item-header h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color-dark);
}
.trade-name {
  font-size: 0.95rem;
  color: #6b7280;
  font-style: italic;
}

/* Info Grid (using CSS Grid for flexibility) */
.info-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

/* --- UPDATED: Info Item as a Card --- */
.info-item {
  background-color: #fdfdfd; /* Slightly off-white background */
  border: 1px solid #f3f4f6;   /* Very light border */
  border-radius: var(--border-radius-md);
  padding: 0.8rem 1rem;
}
.info-item h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.4rem;
  display: flex; /* Aligns icon with text */
  align-items: center;
  gap: 0.4rem;
}
.info-item p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-line;
  word-break: break-word;
}
/* --- End of Update --- */

/* Read More Button */
.readmore-btn {
  background-color: var(--primary-color);
  color: #fff;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  align-self: flex-start;
  margin-top: 0.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0, .1);
  transition: var(--transition-normal);
}
.readmore-btn:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0, .12);
}
.readmore-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0,0,0, .1);
}

/* Footer */
.card-footer {
  flex-shrink: 0;
  text-align: center;
  padding: 0.8rem 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}
.card-footer p {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

/* RESPONSIVE STYLES */
@media (min-width: 768px) {
  .drug-search-card {
    max-width: 600px;
    height: auto;
    max-height: 85vh;
  }
  .card-header h1 {
    font-size: 1.75rem;
  }
  /* Two columns for info cards on tablets and up */
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .drug-search-card {
    max-width: 700px;
  }
  /* Three columns on large desktops */
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>