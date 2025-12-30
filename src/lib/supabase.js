import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// DİKKAT: Başında 'export const' olması şarttır
export const supabase = createClient(supabaseUrl, supabaseKey)