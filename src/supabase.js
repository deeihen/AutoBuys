import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

// Fail loudly in dev instead of a blank page when .env is missing.
if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY. Copy .env.example to .env and fill both in.')

export const supabase = createClient(url, key)
