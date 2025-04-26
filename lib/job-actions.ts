"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"
import { JobCategory } from '@/lib/types'
import { cache } from 'react'

// Fungsi untuk mengambil semua lowongan
export async function getJobs() {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Server action: Fetching jobs")

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .order("posted_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs:", error)
      return []
    }

    console.log(`Server action: Found ${data?.length || 0} jobs`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching jobs:", error)
    return []
  }
}

// Fungsi untuk mengambil lowongan unggulan
export async function getFeaturedJobs(limit = 4) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Server action: Fetching featured jobs")

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("is_featured", true)
      .order("posted_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching featured jobs:", error)
      return []
    }

    console.log(`Server action: Found ${data?.length || 0} featured jobs`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching featured jobs:", error)
    return []
  }
}

// Optimized and cached getJobsByCategory function
export const getJobsByCategory = cache(async (categorySlug: string, limit?: number) => {
  if (!categorySlug) {
    console.error("[Server Action] No category slug provided")
    return []
  }

  try {
    const supabase = getSupabaseAdmin()
    
    let query = supabase
      .from("jobs")
      .select(`
        id,
        title,
        slug,
        job_type,
        location,
        is_featured,
        posted_at,
        company:companies!inner(
          id,
          name,
          logo_url
        )
      `)
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('posted_at', { ascending: false })

    // First get the category ID
    const { data: category } = await supabase
      .from('job_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data: jobs, error } = await query

    if (error) {
      console.error("[Server Action] Database error:", error.message)
      return []
    }

    return jobs || []
  } catch (error) {
    console.error("[Server Action] Error getting jobs by category:", error)
    return []
  }
})

// Cache the job detail query
export const getJobBySlug = cache(async (slug: string) => {
  if (!slug) {
    console.error("[Server Action] No slug provided")
    return null
  }

  try {
    const supabase = getSupabaseAdmin()
    
    const { data: job, error } = await supabase
      .from("jobs")
      .select(`
        id,
        title,
        slug,
        location,
        job_type,
        salary_display,
        description,
        requirements,
        responsibilities,
        posted_at,
        show_salary,
        is_featured,
        company:companies!inner(
          id,
          name,
          logo_url,
          location,
          company_size,
          background,
          website,
          slug
        ),
        category:job_categories(
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error("[Server Action] Database error:", error.message)
      return null
    }

    if (!job) {
      console.error("[Server Action] Job not found for slug:", slug)
      return null
    }

    return job
  } catch (error) {
    console.error("[Server Action] Unexpected error:", error)
    return null
  }
})

// Fungsi untuk membuat lowongan baru
export async function createJob(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()
    const now = new Date()

    const title = formData.get("title") as string
    const companyId = Number.parseInt(formData.get("company_id") as string)
    const location = formData.get("location") as string
    const jobType = formData.get("job_type") as string
    const salaryDisplay = formData.get("salary_display") as string
    const showSalary = formData.get("show_salary") === "on"
    const description = formData.get("description") as string
    const requirements = formData.get("requirements") as string
    const responsibilities = formData.get("responsibilities") as string
    const categoryId = formData.get("category_id") ? Number.parseInt(formData.get("category_id") as string) : null
    const isFeatured = formData.get("is_featured") === "on"

    if (!title || !companyId || !location || !jobType || !description) {
      return { success: false, message: "Semua field wajib diisi" }
    }

    // Generate slug dari judul
    const slug = slugify(title)

    // Simpan data lowongan
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title,
        slug,
        company_id: companyId,
        location,
        job_type: jobType,
        salary_display: salaryDisplay,
        show_salary: showSalary,
        description,
        requirements,
        responsibilities,
        category_id: categoryId,
        is_featured: isFeatured,
        status: "active",
        posted_at: now.toISOString(),
        expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari
      })
      .select()

    if (error) {
      console.error("Error creating job:", error)
      return { success: false, message: `Gagal membuat lowongan: ${error.message}` }
    }

    // Update job count for the category if a category was selected
    if (categoryId) {
      const { data: category } = await supabase.from("job_categories").select("job_count").eq("id", categoryId).single()

      if (category) {
        await supabase
          .from("job_categories")
          .update({ job_count: (category.job_count || 0) + 1 })
          .eq("id", categoryId)
      }
    }

    revalidatePath("/admin/jobs")
    revalidatePath("/jobs")
    revalidatePath("/")
    return { success: true, message: "Lowongan berhasil dibuat", data: data[0] }
  } catch (error: any) {
    console.error("Unexpected error creating job:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk mengupdate lowongan
export async function updateJob(id: number, formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    // Get the current job to check if category changed
    const { data: currentJob } = await supabase.from("jobs").select("category_id").eq("id", id).single()

    const title = formData.get("title") as string
    const companyId = Number.parseInt(formData.get("company_id") as string)
    const location = formData.get("location") as string
    const jobType = formData.get("job_type") as string
    const salaryDisplay = formData.get("salary_display") as string
    const showSalary = formData.get("show_salary") === "on"
    const description = formData.get("description") as string
    const requirements = formData.get("requirements") as string
    const responsibilities = formData.get("responsibilities") as string
    const categoryId = formData.get("category_id") ? Number.parseInt(formData.get("category_id") as string) : null
    const isFeatured = formData.get("is_featured") === "on"
    const status = formData.get("status") as "active" | "expired"

    if (!title || !companyId || !location || !jobType || !description) {
      return { success: false, message: "Semua field wajib diisi" }
    }

    // Generate slug dari judul
    const slug = slugify(title)

    // Update data lowongan
    const { data, error } = await supabase
      .from("jobs")
      .update({
        title,
        slug,
        company_id: companyId,
        location,
        job_type: jobType,
        salary_display: salaryDisplay,
        show_salary: showSalary,
        description,
        requirements,
        responsibilities,
        category_id: categoryId,
        is_featured: isFeatured,
        status,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating job:", error)
      return { success: false, message: `Gagal mengupdate lowongan: ${error.message}` }
    }

    // Update job counts for categories if category changed
    if (currentJob && currentJob.category_id !== categoryId) {
      // Decrement old category count
      if (currentJob.category_id) {
        const { data: oldCategoryData } = await supabase
          .from("job_categories")
          .select("job_count")
          .eq("id", currentJob.category_id)
          .single()

        if (oldCategoryData && oldCategoryData.job_count > 0) {
          await supabase
            .from("job_categories")
            .update({ job_count: oldCategoryData.job_count - 1 })
            .eq("id", currentJob.category_id)
        }
      }

      // Increment new category count
      if (categoryId) {
        const { data: newCategory } = await supabase
          .from("job_categories")
          .select("job_count")
          .eq("id", categoryId)
          .single()

        if (newCategory) {
          await supabase
            .from("job_categories")
            .update({ job_count: (newCategory.job_count || 0) + 1 })
            .eq("id", categoryId)
        }
      }
    }

    revalidatePath("/admin/jobs")
    revalidatePath(`/jobs/${data[0].slug}`)
    revalidatePath("/jobs")
    revalidatePath("/")
    return { success: true, message: "Lowongan berhasil diupdate", data: data[0] }
  } catch (error: any) {
    console.error("Unexpected error updating job:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk menghapus lowongan
export async function deleteJob(id: number) {
  try {
    const supabase = getSupabaseAdmin()

    // Get the job to update category count
    const { data: job } = await supabase.from("jobs").select("category_id").eq("id", id).single()

    const { error } = await supabase.from("jobs").delete().eq("id", id)

    if (error) {
      console.error("Error deleting job:", error)
      return { success: false, message: `Gagal menghapus lowongan: ${error.message}` }
    }

    // Update category job count
    if (job && job.category_id) {
      const { data: category } = await supabase
        .from("job_categories")
        .select("job_count")
        .eq("id", job.category_id)
        .single()

      if (category && category.job_count > 0) {
        await supabase
          .from("job_categories")
          .update({ job_count: category.job_count - 1 })
          .eq("id", job.category_id)
      }
    }

    revalidatePath("/admin/jobs")
    revalidatePath("/jobs")
    revalidatePath("/")
    return { success: true, message: "Lowongan berhasil dihapus" }
  } catch (error: any) {
    console.error("Unexpected error deleting job:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk mencari lowongan
export async function searchJobs(query: string, location?: string, jobType?: string, categoryId?: string) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Searching jobs with params:", { query, location, jobType, categoryId })

    let queryBuilder = supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("status", "active")
      .order("posted_at", { ascending: false })

    // Filter berdasarkan query (judul lowongan atau nama perusahaan)
    if (query && query.trim() !== "") {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,company.name.ilike.%${query}%`)
    }

    // Filter berdasarkan lokasi
    if (location && location.trim() !== "") {
      queryBuilder = queryBuilder.ilike("location", `%${location}%`)
    }

    // Filter berdasarkan tipe pekerjaan
    if (jobType && jobType !== "all") {
      queryBuilder = queryBuilder.eq("job_type", jobType)
    }

    // Filter berdasarkan kategori
    if (categoryId) {
      queryBuilder = queryBuilder.eq("category_id", categoryId)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error searching jobs:", error)
      return []
    }

    console.log(`Found ${data?.length || 0} jobs matching criteria`)
    return data || []
  } catch (error) {
    console.error("Unexpected error searching jobs:", error)
    return []
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("[Server Action] Getting category by slug:", slug)

    const { data: category, error } = await supabase
      .from("job_categories")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("[Server Action] Error getting category:", error)
      return null
    }

    console.log("[Server Action] Found category:", category?.name)
    return category
  } catch (error) {
    console.error("[Server Action] Error getting category:", error)
    return null
  }
}

export async function getCategories(): Promise<JobCategory[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('job_categories')
    .select('id, name, slug, icon, job_count, created_at')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}
