import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpjghzmaykgpwsxfwjbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamdoem1heWtncHdzeGZ3amJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQ4MjY1NSwiZXhwIjoyMTA4MDU4NjU1fQ.Ssdd5m7TRNYTOE4I71MLayLS0t0T_Qjp2CMwFfw6NLo';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamdoem1heWtncHdzeGZ3amJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODI2NTUsImV4cCI6MjEwODA1ODY1NX0.WMCHVWwGEgrS0B1TyiVnVTzeeBO2fjZP0EtBhbA5w34';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing connection to Supabase...');
  const { data, error } = await supabase.from('portfolio_works').select('*').limit(5);
  if (error) {
    console.log('Table portfolio_works query result:', error.message, error.code);
  } else {
    console.log('Table portfolio_works exists! Rows found:', data?.length);
  }
}

check();
