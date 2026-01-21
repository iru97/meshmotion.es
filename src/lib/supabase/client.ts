import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

/**
 * Supabase client instance
 * Will be null if environment variables are not configured
 */
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null

/**
 * Get Supabase client with error if not configured
 */
export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    )
  }
  return supabase
}
