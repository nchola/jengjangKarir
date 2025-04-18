import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { config, validateConfig } from "./config"

// Define the type for our Supabase client
type SupabaseClient = ReturnType<typeof createClient<Database>>

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
    const { url, anonKey } = config.supabase

    // For server-side rendering, always create a new client
    if (typeof window === "undefined") {
      if (!validateConfig()) {
        throw new Error("Invalid Supabase configuration")
      }
      return createClient<Database>(url!, anonKey!)
    }

    // For client-side, use the global window object to store the instance
    if (!window.supabaseClient) {
      if (!validateConfig()) {
        throw new Error("Invalid Supabase configuration")
      }
      window.supabaseClient = createClient<Database>(url!, anonKey!, {
        auth: {
          persistSession: true,
          storageKey: "supabase.auth.token",
        },
      })
    }

    return window.supabaseClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

/**
 * Get the Supabase admin client for server-side usage
 * This should only be used in server components or server actions
 */
export function getSupabaseAdmin(): SupabaseClient {
  try {
    const { url, serviceKey } = config.supabase

    if (!validateConfig() || !serviceKey) {
      throw new Error("Invalid Supabase configuration or missing service key")
    }

    return createClient<Database>(url!, serviceKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase admin client:", error)
    throw error
  }
}
