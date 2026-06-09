import { createClient } from 'file:///c:/project/node_modules/@supabase/supabase-js/dist/index.mjs';

const supabase = createClient(
  'https://plsixartguwvgtitwvuy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc2l4YXJ0Z3V3dmd0aXR3dnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjM1OTQsImV4cCI6MjA5NjQ5OTU5NH0.nCkq_zStJPq61fsC7PZFHwzF0I5EjJBZiqFmkSW9nyI'
);

const { data, error } = await supabase
  .from('students')
  .select('*');

if (error) {
  console.error('Error fetching students:', error);
  process.exit(1);
}

console.log('Total rows:', data.length);
console.log('All rows:');
console.log(JSON.stringify(data, null, 2));
