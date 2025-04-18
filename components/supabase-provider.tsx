"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

// URLs and keys - use environment variables with fallbacks for preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://btwgqfqfxddqrquzyvro.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0d2dxZnFmeGRkcXJxdXp5dnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODYwNzksImV4cCI6MjA2MDM2MjA3OX0.WqLNF4pxVDClkwbLXxXo6z3WE_VXK9fhy-x0FaItQvE"

// Create a context for the Supabase client
type SupabaseContext = {
  supabase: SupabaseClient<Database>
  isConnected: boolean
  connectionError: string | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

// Create a single instance of the Supabase client
const createSupabaseClient = () => {
  console.log("Creating Supabase client with URL:", supabaseUrl ? supabaseUrl.substring(0, 20) + "..." : "Not set")
  console.log("Supabase Anon Key available:", !!supabaseAnonKey)

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase URL or Anon Key not provided. Creating minimal client.")
      // Create a minimal client that won't crash but will fail gracefully
      return createClient<Database>("https://example.supabase.co", "dummy-key", {
        auth: { persistSession: false },
      })
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "supabase.auth.token",
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a minimal client that won't crash the app
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  }
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseClient())
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [connectionTested, setConnectionTested] = useState(false)

  // Test the connection on mount
  useEffect(() => {
    const testConnection = async () => {
      if (connectionTested) return

      try {
        console.log("Testing Supabase connection...")

        // Simple ping test
        const { data, error } = await supabase.from("companies").select("count()", { count: "exact", head: true })

        if (error) {
          console.error("Supabase connection test failed:", error)
          setConnectionError(error.message)
          setIsConnected(false)
        } else {
          console.log("Supabase connection test successful")
          setIsConnected(true)
          setConnectionError(null)
        }
      } catch (err: any) {
        console.error("Unexpected error testing Supabase connection:", err)
        setConnectionError(err?.message || "Unknown connection error")
        setIsConnected(false)
      } finally {
        setConnectionTested(true)
      }
    }

    testConnection()
  }, [supabase, connectionTested])

  return <Context.Provider value={{ supabase, isConnected, connectionError }}>{children}</Context.Provider>
}

// Hook to use the Supabase client
export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context.supabase
}

// Hook to check connection status
export function useSupabaseConnection() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabaseConnection must be used within a SupabaseProvider")
  }
  return { isConnected: context.isConnected, error: context.connectionError }
}
