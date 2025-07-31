// vite.config.js
import { fileURLToPath, URL } from 'node:url' // 👈 ใช้วิธี resolve path ที่ทันสมัยกว่า
import { defineConfig, loadEnv } from 'vite' // 👈 import loadEnv เพิ่ม
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // โหลด environment variables เพื่อให้เข้าถึง VITE_SUPABASE_URL ได้
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'High Alert Drugs รพ.สระโบสถ์',
          short_name: 'HAD-SBH',
          description: 'คู่มือข้อมูลยาความเสี่ยงสูงสำหรับบุคลากรทางการแพทย์ โรงพยาบาลสระโบสถ์',
          theme_color: '#0066b3',
          background_color: '#f7fafe', // สีพื้นหลังแอป
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              // ใช้ env ที่โหลดมาเพื่ออ้างอิง URL ของ Supabase
              urlPattern: ({ url }) => url.origin === env.VITE_SUPABASE_URL,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'supabase-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    resolve: {
      alias: {
        // 👈 ใช้วิธี resolve path ที่ทันสมัยกว่า
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})