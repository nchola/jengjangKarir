export interface Job {
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
  status: "active" | "expired"
  posted_at: string
  expires_at: string
  show_salary: boolean
  company_background: string | null
  company?: Company
  category?: JobCategory
}

export interface Company {
  id: number
  name: string
  slug: string
  logo_url: string | null
  description: string | null
  website: string | null
  company_size: string | null
  industry: string | null
  company_background: string | null
  location: string | null
  created_at: string
}

export interface JobCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  job_count: number
  created_at: string
} 