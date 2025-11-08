// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Import ฟอนต์ที่ต้องการใช้งานจาก @fontsource
import '@fontsource/prompt/400.css'; // Normal weight
import '@fontsource/prompt/600.css'; // Semi-bold weight
import '@fontsource/prompt/700.css'; // Bold weight

// Import ไฟล์สไตล์กลางไฟล์เดียว ที่รวมทุกอย่างไว้แล้ว
import './style.css'

// สร้างและเมาท์แอปพลิเคชัน Vue
createApp(App).mount('#app')
