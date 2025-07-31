<!-- src/components/DrugDetailModal.vue -->
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const props = defineProps({
  drugId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close'])

const drug = ref(null)
const isLoading = ref(true)
const error = ref(null)

async function fetchDrugDetail() {
  if (!props.drugId) return
  try {
    isLoading.value = true
    drug.value = null
    error.value = null

    const { data, error: dbError } = await supabase
      .from('high_alert_drugs')
      .select('*')
      .eq('id', props.drugId)
      .single()

    if (dbError) throw dbError
    drug.value = data

  } catch (e) {
    error.value = 'ไม่สามารถดึงข้อมูลยาฉบับเต็มได้'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.drugId, fetchDrugDetail, { immediate: true })

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="drug-card modal-content" role="dialog" aria-modal="true">
      <!-- HEADER -->
      <header class="card-header">
        <div class="header-content">
          <div v-if="drug">
            <h1>{{ drug.generic_name }}</h1>
            <p v-if="drug.trade_name">{{ drug.trade_name }}</p>
          </div>
          <div v-else-if="isLoading"><h1>กำลังโหลด...</h1></div>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="ปิด">×</button>
      </header>

      <!-- CONTENT (scrollable) -->
      <main class="card-content" tabindex="-1">
        <div v-if="isLoading" class="status status-loading">
          <div class="spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
        <div v-else-if="error" class="status status-error">
          <p>⚠️ {{ error }}</p>
        </div>
        <div v-else-if="drug" class="details-grid">
            <!-- 1. Black Box Warning (สำคัญที่สุด) -->
            <div v-if="drug.black_box_warning" class="detail-section warning-box">
              <h3>🚨 Black Box Warning</h3>
              <p>{{ drug.black_box_warning }}</p>
            </div>
        
            <!-- 2. Contraindications (ข้อห้ามใช้) -->
            <div v-if="drug.contraindications" class="detail-section">
              <h3>🚫 ข้อห้ามใช้ (Contraindications)</h3>
              <p>{{ drug.contraindications }}</p>
            </div>

            <!-- 3. Administration (การบริหารยา) -->
            <div v-if="drug.administration_details" class="detail-section">
              <h3>💉 การบริหารยา (Administration)</h3>
              <p v-if="drug.administration_details.route"><strong>ช่องทาง:</strong> {{ drug.administration_details.route }}</p>
              <p v-if="drug.administration_details.rate"><strong>อัตราการให้:</strong> {{ drug.administration_details.rate }}</p>
              <p v-if="drug.administration_details.incompatibilities"><strong>ยาที่เข้ากันไม่ได้:</strong> {{ drug.administration_details.incompatibilities.join(', ') }}</p>
            </div>

            <!-- 4. Dosing (ขนาดยา) -->
            <div class="detail-section">
              <h3>📈 ขนาดยา (Dosing)</h3>
              <p v-if="drug.dosing_adult"><strong>ผู้ใหญ่:</strong> {{ drug.dosing_adult }}</p>
              <p v-if="drug.dosing_pediatric"><strong>เด็ก:</strong> {{ drug.dosing_pediatric }}</p>
              <p v-if="drug.dosing_renal_impairment"><strong>ผู้ป่วยโรคไต:</strong> {{ drug.dosing_renal_impairment }}</p>
              <p v-if="drug.dosing_hepatic_impairment"><strong>ผู้ป่วยโรคตับ:</strong> {{ drug.dosing_hepatic_impairment }}</p>
            </div>

            <!-- 5. Adverse Effects (อาการไม่พึงประสงค์) -->
            <div v-if="drug.adverse_effects && (drug.adverse_effects.common || drug.adverse_effects.severe)" class="detail-section">
              <h3>⚠️ อาการไม่พึงประสงค์ (Adverse Effects)</h3>
              <p v-if="drug.adverse_effects.common && drug.adverse_effects.common.length"><strong>พบบ่อย:</strong> {{ drug.adverse_effects.common.join(', ') }}</p>
              <p v-if="drug.adverse_effects.severe && drug.adverse_effects.severe.length"><strong>รุนแรง:</strong> {{ drug.adverse_effects.severe.join(', ') }}</p>
            </div>

            <!-- 6. Monitoring (การติดตามโดยละเอียด) -->
            <div v-if="drug.monitoring_parameters" class="detail-section">
              <h3>🩺 การติดตาม (Detailed Monitoring)</h3>
              <p>{{ drug.monitoring_parameters }}</p>
            </div>

            <!-- 7. Antidote & Overdosage (ยาแก้พิษ) -->
            <div v-if="drug.antidote || drug.overdosage_management" class="detail-section">
              <h3>🛡️ ยาแก้พิษและการจัดการเมื่อได้รับยาเกินขนาด</h3>
              <p v-if="drug.antidote"><strong>ยาแก้พิษ (Antidote):</strong> {{ drug.antidote }}</p>
              <p v-if="drug.overdosage_management"><strong>การจัดการ:</strong> {{ drug.overdosage_management }}</p>
            </div>

            <!-- 8. Precautions (ข้อควรระวัง) -->
            <div v-if="drug.precautions" class="detail-section">
              <h3>🔬 ข้อควรระวัง (Precautions)</h3>
              <p>{{ drug.precautions }}</p>
            </div>

            <!-- 9. Pharmacology (เภสัชวิทยา) -->
            <div class="detail-section">
              <h3>🧬 เภสัชวิทยา (Pharmacology)</h3>
              <p v-if="drug.mechanism_of_action"><strong>กลไกการออกฤทธิ์:</strong> {{ drug.mechanism_of_action }}</p>
              <p v-if="drug.onset_of_action"><strong>เริ่มออกฤทธิ์ (Onset):</strong> {{ drug.onset_of_action }}</p>
              <p v-if="drug.duration_of_action"><strong>ระยะเวลาออกฤทธิ์ (Duration):</strong> {{ drug.duration_of_action }}</p>
              <p v-if="drug.half_life"><strong>ค่าครึ่งชีวิต (Half-life):</strong> {{ drug.half_life }}</p>
            </div>

            <!-- 10. Pregnancy & Lactation -->
            <div v-if="drug.pregnancy_lactation" class="detail-section">
              <h3>🤰🏻 การใช้ในหญิงตั้งครรภ์และให้นมบุตร</h3>
              <p>{{ drug.pregnancy_lactation }}</p>
            </div>
        
            <!-- Dosage Form & Class (ข้อมูลทั่วไป) -->
            <div class="detail-section">
              <h3>🏷️ ข้อมูลทั่วไป</h3>
              <p><strong>รูปแบบยา:</strong> {{ drug.dosage_form || 'N/A' }}</p>
              <p><strong>กลุ่มยา:</strong> {{ drug.drug_class || 'N/A' }}</p>
            </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* --- 1. Modal Overlay & Animation --- */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem; box-sizing: border-box;
}

.modal-content {
  animation: modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modal-fade-in {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* --- 2. Base Card Structure --- */
.drug-card {
  width: 100%; max-width: 100%; height: 90vh; max-height: 700px;
  background: #fff; border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; overflow: hidden;
}

/* --- 3. Card Header (MODIFIED COLORS) --- */
.card-header {
  background: #d97706; /* amber-600 */
  color: #fff;
  padding: 1.1rem 1rem 1.1rem 1.4rem;
  text-align: center; flex-shrink: 0;
  display: flex; justify-content: space-between; align-items: center;
}

.header-content { text-align: left; }
.card-header h1 {
  font-size: 1.25rem; margin: 0; font-weight: 700; line-height: 1.2;
}
.card-header p {
  margin: .2rem 0 0; font-size: .95rem; opacity: 0.9;
}

.close-btn {
  background: none; border: none; color: white;
  font-size: 2.2rem; font-weight: 300; line-height: 1;
  cursor: pointer; padding: 0 .7rem; opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
  align-self: flex-start;
}
.close-btn:hover { opacity: 1; transform: scale(1.1); }

/* --- 4. Card Content (Scrollable) --- */
.card-content {
  flex: 1 1 auto; min-height: 0; overflow-y: auto;
  padding: 1.2rem 1.4rem 1.5rem;
  background: #f9fafb; /* Light gray background for content area */
  text-align: left;
}

/* --- 5. Status Messages & Spinner (MODIFIED COLORS) --- */
.status {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #6c757d; min-height: 10rem; text-align: center;
  font-size: 1.06rem; gap: 1rem; height: 100%;
}
.status-error { color: #c0392b; font-weight: 600; }

.spinner {
  width: 2.4em; height: 2.4em;
  border: .32em solid #fef3c7; /* amber-100 */
  border-top: .32em solid #d97706; /* amber-600 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* --- 6. Styles for Detail Sections (MODIFIED COLORS) --- */
.details-grid {
  display: flex; flex-direction: column; gap: 1rem;
}

.detail-section {
  background: #ffffff; /* White cards on gray background */
  border: 1px solid #f3f4f6; /* gray-100 */
  border-radius: .9em;
  padding: 1.1em 1.2em;
}
.detail-section h3 {
  margin: 0 0 .6em 0; font-size: 1rem; font-weight: 700;
  color: #b45309; /* amber-700 */
  border-bottom: 1px solid #fed7aa; /* amber-200 */
  padding-bottom: .5em; display: flex; align-items: center; gap: .5em;
}
.detail-section p {
  margin: 0 0 .5em 0; font-size: .97rem; line-height: 1.65;
  white-space: pre-line; word-break: break-word; color: #374151;
}
.detail-section p:last-child { margin-bottom: 0; }
.detail-section p strong {
  font-weight: 600; color: #1e293b;
}

/* Warning box color remains the same for clear distinction */
.warning-box {
  border-color: #f5c6cb; background-color: #f8d7da; color: #721c24;
}
.warning-box h3 {
  color: #721c24; border-bottom-color: #f1b0b7;
}
.warning-box p { color: #721c24; }

/* --- 7. Responsive Design --- */
@media (min-width: 600px) {
  .drug-card { width: 30rem; }
  .card-header h1 { font-size: 1.4rem; }
}

/* --- 8. Custom Scrollbar (MODIFIED COLORS) --- */
.card-content {
  scrollbar-width: thin;
  scrollbar-color: #fcd34d #f9fafb; /* amber-300 on gray-50 */
}
.card-content::-webkit-scrollbar {
  width: 0.6em; background: #f9fafb;
}
.card-content::-webkit-scrollbar-thumb {
  background: #fcd34d; border-radius: 1em;
  border: 2px solid #f9fafb;
}
.card-content::-webkit-scrollbar-thumb:hover {
  background: #fbbf24; /* amber-400 */
}
</style>