export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  // Add other configs here if needed
} as const

// Type-safe config access
export type Config = typeof config

// Validation function
export function validateConfig() {
  const required = ['url', 'anonKey'] as const
  const missing = required.filter(key => !config.supabase[key])
  
  if (missing.length > 0) {
    console.warn(
      `Missing required Supabase configuration: ${missing.join(', ')}. ` +
      'Please check your environment variables.'
    )
    return false
  }
  return true
} 