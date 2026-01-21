/**
 * Supabase Database Types
 *
 * This file defines the database schema types for Supabase.
 * Update this file when you modify your Supabase tables.
 *
 * You can auto-generate this file using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      models: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          file_path: string
          file_size: number
          thumbnail_path: string | null
          is_public: boolean
          tags: string[]
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          file_path: string
          file_size: number
          thumbnail_path?: string | null
          is_public?: boolean
          tags?: string[]
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          file_path?: string
          file_size?: number
          thumbnail_path?: string | null
          is_public?: boolean
          tags?: string[]
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      temporary_links: {
        Row: {
          id: string
          user_id: string
          model_id: string
          short_code: string
          expires_at: string
          max_views: number | null
          view_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          model_id: string
          short_code: string
          expires_at: string
          max_views?: number | null
          view_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          model_id?: string
          short_code?: string
          expires_at?: string
          max_views?: number | null
          view_count?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Model = Database['public']['Tables']['models']['Row']
export type TemporaryLink = Database['public']['Tables']['temporary_links']['Row']
