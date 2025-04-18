"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"
import { config, validateConfig } from "@/lib/config"

// Create a context for the Supabase client
type SupabaseContext = {
  supabase: SupabaseClient<Database>
  isConnected: boolean
  connectionError: string | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

// Create a single instance of the Supabase client
const createSupabaseClient = () => {
  const { url, anonKey } = config.supabase
  
  console.log("Creating Supabase client with URL:", url ? url.substring(0, 20) + "..." : "Not set")
  console.log("Supabase Anon Key available:", !!anonKey)

  try {
    if (!validateConfig()) {
      console.warn("Supabase configuration is invalid. Creating minimal client.")
      return createClient<Database>("https://example.supabase.co", "dummy-key", {
        auth: { persistSession: false },
      })
    }

    return createClient<Database>(url!, anonKey!, {
      auth: {
        persistSession: true,
        storageKey: "supabase.auth.token",
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createClient<Database>("https://example.supabase.co", "dummy-key", {
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
