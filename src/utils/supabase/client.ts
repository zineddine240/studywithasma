import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/utils/env'

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null as any
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
