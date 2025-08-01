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

<!-- src/components/DrugDetailModal.vue -->

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true">
      <!-- HEADER -->
      <header class="modal-header">
        <div class="header-content">
          <h1 v-if="drug">{{ drug.generic_name }}</h1>
          <h1 v-else-if="isLoading">กำลังโหลด...</h1>
          <p v-if="drug && drug.trade_name">{{ drug.trade_name }}</p>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="ปิด">×</button>
      </header>

      <!-- BODY (SCROLLABLE) -->
      <main class="modal-body" tabindex="-1">
        <div v-if="isLoading" class="status-indicator">
          <div class="spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
        <div v-else-if="error" class="status-indicator error">
          <p>⚠️ {{ error }}</p>
        </div>
        <div v-else-if="drug" class="details-container">
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
            <p v-if="drug.administration_details.incompatibilities && drug.administration_details.incompatibilities.length"><strong>ยาที่เข้ากันไม่ได้:</strong> {{ drug.administration_details.incompatibilities.join(', ') }}</p>
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
      
          <!-- 11. Dosage Form & Class (ข้อมูลทั่วไป) -->
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
/* MOBILE-FIRST: Full-screen modal */
.modal-overlay {
  position: fixed;
  inset: 0; /* top, right, bottom, left = 0 */
  background-color: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0;
}

.modal-card {
  width: 100%;
  height: 100%;
  background-color: var(--color-background-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0; /* No radius on full screen */
  animation: modal-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}

@keyframes modal-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background-color: var(--primary-color);
  color: #fff;
  flex-shrink: 0;
}
.header-content { text-align: left; }
.modal-header h1 {
  font-size: 1.2rem;
  line-height: 1.3;
}
.modal-header p {
  margin-top: 0.2rem;
  font-size: 0.9rem;
  opacity: 0.9;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2.2rem;
  font-weight: 300;
  line-height: 1;
  padding: 0 0.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}
.close-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Body */
.modal-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.25rem;
  background-color: #f9fafb;
}

/* Status Indicators */
.status-indicator {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1rem; min-height: 10rem; text-align: center; color: #6b7280; font-size: 1rem;
}
.status-indicator.error { color: var(--danger-color); font-weight: 600; }
.spinner {
  width: 2.5rem; height: 2.5rem; border-radius: 50%;
  border: 0.3rem solid var(--secondary-color);
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
}
@keyframes spin { from { transform: rotate(360deg); } }

/* Details */
.details-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.detail-section {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius-md);
  padding: 1rem 1.25rem;
}
.detail-section h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-color-dark);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--secondary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.detail-section p {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-line;
  word-break: break-word;
  color: #374151;
}
.detail-section p:last-child { margin-bottom: 0; }
.detail-section p strong {
  font-weight: 600;
  color: #1f2937;
}

.warning-box {
  border-color: #ae2d2d;
  background-color: #f8d7da;
  color: #721c24;
}
.warning-box h3 { color: #721c24; border-bottom-color: #f1b0b7; }
.warning-box p { color: #721c24; }

/* RESPONSIVE: On larger screens, make it a floating modal */
@media (min-width: 768px) {
  .modal-overlay {
    padding: 2rem; /* Give some space around the card */
  }
  .modal-card {
    width: 100%;
    max-width: 700px;
    height: auto;
    max-height: 90vh;
    border-radius: var(--border-radius-lg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    animation: modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes modal-fade-in {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-header h1 {
    font-size: 1.5rem;
  }
}
</style>