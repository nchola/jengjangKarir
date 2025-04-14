export interface JobCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  job_count: number
  created_at: string
}

export interface Company {
  id: number
  name: string
  slug: string
  logo_url: string | null
  location: string | null
  created_at: string
}

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

  // Relasi
  company?: Company
  category?: JobCategory
}

export interface JobWithRelations extends Job {
  company: Company
  category: JobCategory | null
}
