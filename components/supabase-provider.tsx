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

  try {
    if (!validateConfig()) {
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
        // Simple ping test
        const { data, error } = await supabase.from("companies").select("count()", { count: "exact", head: true })

        if (error) {
          setConnectionError(error.message)
          setIsConnected(false)
        } else {
          setIsConnected(true)
          setConnectionError(null)
        }
      } catch (err: any) {
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
