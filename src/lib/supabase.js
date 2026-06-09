import { createClient } from '@supabase/supabase-js';

// Ambil URL dari halaman "Data API"
const supabaseUrl = 'https://plsixartguwvgtitwvuy.supabase.co'; 

// Salin teks dari kolom "Publishable key" di Screenshot (227).png
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc2l4YXJ0Z3V3dmd0aXR3dnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjM1OTQsImV4cCI6MjA5NjQ5OTU5NH0.nCkq_zStJPq61fsC7PZFHwzF0I5EjJBZiqFmkSW9nyI'; 

export const supabase = createClient(supabaseUrl, supabaseKey);