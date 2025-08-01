// src/main.js (Updated)
import { createApp } from 'vue'
import App from './App.vue'

// 1. Import ฟอนต์ที่ต้องการใช้งานจาก @fontsource
// เรา import เฉพาะน้ำหนัก (weight) ที่เราใช้ในโปรเจคจริงๆ
import '@fontsource/prompt/400.css'; // Normal weight
import '@fontsource/prompt/600.css'; // Semi-bold weight
import '@fontsource/prompt/700.css'; // Bold weight

// 2. Import ไฟล์สไตล์กลางไฟล์เดียว ที่รวมทุกอย่างไว้แล้ว
// (ไม่มีการ import main.css อีกต่อไป)
import './style.css'

// 3. สร้างและเมาท์แอปพลิเคชัน Vue
createApp(App).mount('#app')