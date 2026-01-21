'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile, Database } from '@/lib/supabase/types'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
}

/**
 * Hook for managing authentication with Supabase
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isConfigured: isSupabaseConfigured,
  })

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }, [])

  // Initialize auth state
  useEffect(() => {
    if (!supabase) {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let profile = null
      if (session?.user) {
        profile = await fetchProfile(session.user.id)
      }

      setState({
        user: session?.user ?? null,
        profile,
        session,
        isLoading: false,
        isConfigured: true,
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      let profile = null
      if (session?.user) {
        profile = await fetchProfile(session.user.id)
      }

      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        profile,
        session,
      }))
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  /**
   * Sign in with email and password
   */
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: new Error('Supabase not configured') }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { data, error }
    },
    []
  )

  /**
   * Sign up with email and password
   */
  const signUpWithEmail = useCallback(
    async (email: string, password: string, username?: string) => {
      if (!supabase) {
        return { error: new Error('Supabase not configured') }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      return { data, error }
    },
    []
  )

  /**
   * Sign in with OAuth provider
   */
  const signInWithOAuth = useCallback(
    async (provider: 'google' | 'github' | 'discord') => {
      if (!supabase) {
        return { error: new Error('Supabase not configured') }
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      return { data, error }
    },
    []
  )

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') }
    }

    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!supabase || !state.user) {
        return { error: new Error('Not authenticated') }
      }

      const { data, error } = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single()

      if (!error && data) {
        setState((prev) => ({ ...prev, profile: data }))
      }

      return { data, error }
    },
    [state.user]
  )

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
    updateProfile,
  }
}
