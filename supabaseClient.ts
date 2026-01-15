import { createClient } from '@supabase/supabase-js'

// Supabase configuration for Kasi Navi
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://swtxnhcmpgozzspghisn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dHhuaGNtcGdvenpzcGdoaXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODU5MDksImV4cCI6MjA3Mjk2MTkwOX0.arS7WCnzAXmQNvZIaSFTjEmNjxhNAqXSDPIpWKvZKfI'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },
}
