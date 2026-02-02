// Supabase client initialization
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './types/database';

// Create and export the Supabase client with proper typing
export const supabase = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
);
