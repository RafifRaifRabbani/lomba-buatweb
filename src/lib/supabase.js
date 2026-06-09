import { createClient } from '@supabase/supabase-js';

// Ambil URL dari halaman "Data API"
const supabaseUrl = 'https://plsixartguwvgtitwvuy.supabase.co'; 

// Salin teks dari kolom "Publishable key" di Screenshot (227).png
const supabaseKey = 'sb_publishable_Pwqbs_62Vzk9NqY8VyvynQ_v_rZJioA'; 

export const supabase = createClient(supabaseUrl, supabaseKey);