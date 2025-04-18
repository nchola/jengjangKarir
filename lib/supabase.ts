import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Define the type for our Supabase client
type SupabaseClient = ReturnType<typeof createClient<Database>>

// URLs and keys - use environment variables with fallbacks for preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://btwgqfqfxddqrquzyvro.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0d2dxZnFmeGRkcXJxdXp5dnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODYwNzksImV4cCI6MjA2MDM2MjA3OX0.WqLNF4pxVDClkwbLXxXo6z3WE_VXK9fhy-x0FaItQvE"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0d2dxZnFmeGRkcXJxdXp5dnJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc4NjA3OSwiZXhwIjoyMDYwMzYyMDc5fQ.0wpWq3Jlm7u7gcJfawoy4XuXs_f__r4LClrPg9qIqro"

// Create a type for the global window object with our custom property
declare global {
  interface Window {
    supabaseClient: SupabaseClient | undefined
  }
}

// Server-side singleton
const serverClient: SupabaseClient | null = null

/**
 * Get the Supabase client for client-side usage
 * This implementation ensures only one instance is created
 */
export function getSupabaseClient(): SupabaseClient {
  try {
    // For server-side rendering, always create a new client
    if (typeof window === "undefined") {
      return createClient<Database>(supabaseUrl, supabaseAnonKey)
    }

    // For client-side, use the global window object to store the instance
    if (!window.supabaseClient) {
      window.supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          storageKey: "supabase.auth.token",
        },
      })
    }

    return window.supabaseClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a minimal client that won't crash the app
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
}

/**
 * Get the Supabase admin client for server-side usage
 * This should only be used in server components or server actions
 */
export function getSupabaseAdmin(): SupabaseClient {
  try {
    // Always create a new admin client for server-side operations
    return createClient<Database>(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase admin client:", error)
    // Return a minimal client that won't crash the app
    return createClient<Database>(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  }
}
