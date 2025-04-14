import { createClient } from "@supabase/supabase-js"

// Singleton pattern untuk client-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bglmoctyencceighegfn.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbG1vY3R5ZW5jY2VpZ2hlZ2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTQ1OTIsImV4cCI6MjA2MDE5MDU5Mn0.DzhCTFrtcWIYnPzHubmP1ArVRn5hhbkzZODGywt0tis",
  )

  return supabaseClient
}

// Server-side Supabase client dengan service role key
export function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL || "https://bglmoctyencceighegfn.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbG1vY3R5ZW5jY2VpZ2hlZ2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDYxNDU5MiwiZXhwIjoyMDYwMTkwNTkyfQ.BXyfLMb1zcqfGXCcm7Hutuux9hcB0t-GEZ8ZtF03muc",
    {
      auth: {
        persistSession: false,
      },
    },
  )
}
