import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl.startsWith('https://')
  && supabaseUrl.includes('.supabase.co')
  && supabaseAnonKey
  && !supabaseAnonKey.includes('your_supabase'),
);

// Keep public routes renderable when a developer has not filled frontend/.env.
// Auth actions call assertSupabaseConfigured before making a request.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  },
);

export const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.');
  }
};

export const getSupabaseSession = async () => {
  assertSupabaseConfigured();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
};
