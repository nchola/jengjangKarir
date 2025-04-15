export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: number
          name: string
          slug: string
          logo_url: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          logo_url?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          logo_url?: string | null
          location?: string | null
          created_at?: string
        }
      }
      job_categories: {
        Row: {
          id: number
          name: string
          slug: string
          icon: string | null
          job_count: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          icon?: string | null
          job_count?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          icon?: string | null
          job_count?: number
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: number
          title: string
          slug: string
          company_id: number
          location: string
          job_type: string
          salary_display: string | null
          description: string
          requirements: string | null
          responsibilities: string | null
          category_id: number | null
          is_featured: boolean
          status: string
          posted_at: string
          expires_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          company_id: number
          location: string
          job_type: string
          salary_display?: string | null
          description: string
          requirements?: string | null
          responsibilities?: string | null
          category_id?: number | null
          is_featured?: boolean
          status?: string
          posted_at?: string
          expires_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          company_id?: number
          location?: string
          job_type?: string
          salary_display?: string | null
          description?: string
          requirements?: string | null
          responsibilities?: string | null
          category_id?: number | null
          is_featured?: boolean
          status?: string
          posted_at?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
