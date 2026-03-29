import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export type SupabaseClientType = SupabaseClient<Database>;

export type User = Database['public']['Tables']['profiles']['Row'] & {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin';
};

