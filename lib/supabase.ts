import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Define the type for our Supabase client
type SupabaseClient = ReturnType<typeof createClient<Database>>

// URLs and keys - use environment variables with fallbacks for preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bglmoctyencceighegfn.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbG1vY3R5ZW5jY2VpZ2hlZ2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTQ1OTIsImV4cCI6MjA2MDE5MDU5Mn0.DzhCTFrtcWIYnPzHubmP1ArVRn5hhbkzZODGywt0tis"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Log connection info
console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Anon Key available:", !!supabaseAnonKey)
console.log("Supabase Service Key available:", !!supabaseServiceKey)

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
      console.log("[SERVER] Creating server-side Supabase client")
      return createClient<Database>(supabaseUrl, supabaseAnonKey)
    }

    // For client-side, use the global window object to store the instance
    if (!window.supabaseClient) {
      console.log("[CLIENT] Creating client-side Supabase client")
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
    console.log("[SERVER] Creating admin Supabase client")
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
