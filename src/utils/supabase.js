import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  console.error('Required: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log('Supabase client initialized:', {
  url: supabaseUrl ? '✓ Set' : '✗ Missing',
  key: supabaseAnonKey ? '✓ Set' : '✗ Missing'
});

// Helper function to test if a table exists
export const testTableExists = async (tableName) => {
  try {
    const { data, error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    if (error) {
      console.error(`Table "${tableName}" error:`, error);
      return false;
    }
    console.log(`Table "${tableName}" exists and is accessible`);
    return true;
  } catch (err) {
    console.error(`Table "${tableName}" test failed:`, err);
    return false;
  }
};

