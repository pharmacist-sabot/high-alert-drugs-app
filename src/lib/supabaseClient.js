// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// ดึงค่าจาก Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ตรวจสอบว่ามีค่าครบถ้วนหรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and/or Anon Key are missing in .env.local");
}

// สร้างและ export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)