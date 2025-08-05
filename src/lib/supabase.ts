import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Use hardcoded values as fallback since env loading has issues
const supabaseUrl = 'https://gqtngairiewzposercli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdG5nYWlyaWV3enBvc2VyY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MjQ2MjIsImV4cCI6MjA3MDAwMDYyMn0.bZySZsLJH2M3Oj2mqulFIqbxzSPR8Kxq_ugA7d8k6cw';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables. URL: ${JSON.stringify(supabaseUrl)}, Key present: ${!!supabaseAnonKey}`
  );
}

if (!supabaseUrl.startsWith('https://')) {
  throw new Error(
    `Invalid Supabase URL: ${JSON.stringify(supabaseUrl)}. URL must start with https://`
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }
});