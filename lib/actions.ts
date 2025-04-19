"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"

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

// Fungsi untuk mengambil lowongan berdasarkan kategori
export async function getJobsByCategory(categorySlug: string) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("[Server Action] Getting jobs for category:", categorySlug)

    // Get category first
    const { data: category, error: categoryError } = await supabase
      .from("job_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (categoryError || !category) {
      console.error("[Server Action] Error getting category:", categoryError)
      return []
    }

    console.log("[Server Action] Found category with ID:", category.id)

    // Then get jobs for this category
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("category_id", category.id)
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("posted_at", { ascending: false })

    if (jobsError) {
      console.error("[Server Action] Error getting jobs:", jobsError)
      return []
    }

    console.log("[Server Action] Found jobs:", jobs?.length || 0)
    return jobs || []
  } catch (error) {
    console.error("[Server Action] Error getting jobs by category:", error)
    return []
  }
}

// Fungsi untuk mengambil detail lowongan
export async function getJobBySlug(slug: string) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching job:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching job by slug:", error)
    return null
  }
}

// Fungsi untuk mengambil semua kategori
export async function getCategories() {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Server action: Fetching categories")

    const { data, error } = await supabase.from("job_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    console.log(`Server action: Found ${data?.length || 0} categories`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching categories:", error)
    return []
  }
}

// Fungsi untuk mengambil semua perusahaan
export async function getCompanies() {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Server action: Fetching companies")

    const { data, error } = await supabase.from("companies").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching companies:", error)
      return []
    }

    console.log(`Server action: Found ${data?.length || 0} companies`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching companies:", error)
    return []
  }
}

// Fungsi untuk membuat perusahaan baru
export async function createCompany(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const logoFile = formData.get("logo") as File

    if (!name) {
      return { success: false, message: "Nama perusahaan wajib diisi" }
    }

    // Generate slug dari nama
    const slug = slugify(name)

    // Upload logo jika ada
    let logoUrl = null
    if (logoFile && logoFile.size > 0) {
      try {
        // Try to upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("company-logos")
          .upload(`${slug}-${Date.now()}`, logoFile)

        if (uploadError) {
          console.error("Error uploading logo:", uploadError)
          // If bucket doesn't exist, use a placeholder image instead
          logoUrl = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(name.charAt(0))}`
        } else {
          // Dapatkan URL publik
          const {
            data: { publicUrl },
          } = supabase.storage.from("company-logos").getPublicUrl(uploadData.path)

          logoUrl = publicUrl
        }
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr)
        // Fallback to placeholder
        logoUrl = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(name.charAt(0))}`
      }
    }

    // Simpan data perusahaan
    const { data, error } = await supabase
      .from("companies")
      .insert({
        name,
        slug,
        location,
        logo_url: logoUrl,
      })
      .select()

    if (error) {
      console.error("Error creating company:", error)
      return { success: false, message: `Gagal membuat perusahaan: ${error.message}` }
    }

    revalidatePath("/admin/companies")
    return { success: true, message: "Perusahaan berhasil dibuat", data: data[0] }
  } catch (error: any) {
    console.error("Unexpected error creating company:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk mengupdate perusahaan
export async function updateCompany(id: number, formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const logoFile = formData.get("logo") as File
    const resetLogo = formData.get("reset_logo") === "true"

    if (!name) {
      return { success: false, message: "Nama perusahaan wajib diisi" }
    }

    // Get current company data
    const { data: currentCompany } = await supabase.from("companies").select("logo_url").eq("id", id).single()

    // Generate slug dari nama
    const slug = slugify(name)

    // Prepare update data
    const updateData: any = {
      name,
      slug,
      location,
    }

    // Reset logo if requested
    if (resetLogo) {
      updateData.logo_url = null
    }
    // Upload new logo if provided
    else if (logoFile && logoFile.size > 0) {
      try {
        // Try to upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("company-logos")
          .upload(`${slug}-${Date.now()}`, logoFile)

        if (uploadError) {
          console.error("Error uploading logo:", uploadError)
          // If bucket doesn't exist, use a placeholder image instead
          updateData.logo_url = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(name.charAt(0))}`
        } else {
          // Dapatkan URL publik
          const {
            data: { publicUrl },
          } = supabase.storage.from("company-logos").getPublicUrl(uploadData.path)

          updateData.logo_url = publicUrl
        }
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr)
        // Fallback to placeholder
        updateData.logo_url = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(name.charAt(0))}`
      }
    }

    // Update company data
    const { data, error } = await supabase.from("companies").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Error updating company:", error)
      return { success: false, message: `Gagal mengupdate perusahaan: ${error.message}` }
    }

    revalidatePath("/admin/companies")
    return { success: true, message: "Perusahaan berhasil diupdate", data: data[0] }
  } catch (error: any) {
    console.error("Unexpected error updating company:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk membuat kategori baru
export async function createCategory(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const name = formData.get("name") as string
    const icon = formData.get("icon") as string

    if (!name) {
      return { success: false, message: "Nama kategori wajib diisi" }
    }

    // Generate slug dari nama
    const slug = slugify(name)

    // Simpan data kategori
    const { data, error } = await supabase
      .from("job_categories")
      .insert({
        name,
        slug,
        icon,
        job_count: 0, // Default value
      })
      .select()

    if (error) {
      console.error("Error creating category:", error)
      return { success: false, message: `Gagal membuat kategori: ${error.message}` }
    }

    revalidatePath("/admin/categories")
    return { success: true, message: "Kategori berhasil dibuat", data: data[0] }
  } catch (error: any) {
    console.error("Unexpected error creating category:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk mengupdate kategori
export async function updateCategory(id: number, formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const name = formData.get("name") as string
    const icon = formData.get("icon") as string

    if (!name) {
      return { success: false, message: "Nama kategori wajib diisi" }
    }

    // Generate slug dari nama
    const slug = slugify(name)

    // Update data kategori
    const { data, error } = await supabase
      .from("job_categories")
      .update({
        name,
        slug,
        icon,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating category:", error)
      return { success: false, message: `Gagal mengupdate kategori: ${error.message}` }
    }

    revalidatePath("/admin/categories")
    return { success: true, message: "Kategori berhasil diupdate", data: data[0] }
  } catch (error: any) {
    console.error("Unexpected error updating category:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Update the createJob function to handle the show_salary field
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

// Update the updateJob function to handle the show_salary field
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

interface SearchJobsParams {
  query?: string
  location?: string | string[]
  jobType?: string | string[]
  categoryId?: string | string[]
  salaryMin?: string
  salaryMax?: string
  cursor?: string
  limit?: number
}

export async function searchJobs({
  query,
  location,
  jobType,
  categoryId,
  salaryMin,
  salaryMax,
  cursor,
  limit = 10,
}: SearchJobsParams) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Searching jobs with params:", {
      query,
      location,
      jobType,
      categoryId,
      salaryMin,
      salaryMax,
      cursor,
      limit,
    })

    let queryBuilder = supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("status", "active")

    // Implementasi cursor-based pagination
    if (cursor) {
      queryBuilder = queryBuilder.lt("posted_at", cursor)
    }

    // Pencarian Full-Text dengan ranking
    if (query && query.trim()) {
      const searchQuery = query.trim()
      queryBuilder = queryBuilder
        .textSearch(
          "tsv",
          searchQuery
            .split(/\s+/)
            .map(term => term + ":*")
            .join(" & "),
          {
            config: "indonesian",
            type: "websearch",
          }
        )
        .order("is_featured", { ascending: false })
        .order("posted_at", { ascending: false })
    } else {
      // Jika tidak ada query pencarian, urutkan berdasarkan featured dan tanggal
      queryBuilder = queryBuilder
        .order("is_featured", { ascending: false })
        .order("posted_at", { ascending: false })
    }

    // Filter lokasi menggunakan GIN index
    if (location) {
      if (Array.isArray(location)) {
        queryBuilder = queryBuilder.in("location", location)
      } else {
        queryBuilder = queryBuilder.ilike("location", `%${location}%`)
      }
    }

    // Filter tipe pekerjaan menggunakan B-tree index
    if (jobType && jobType !== "all") {
      if (Array.isArray(jobType)) {
        queryBuilder = queryBuilder.in("job_type", jobType)
      } else {
        queryBuilder = queryBuilder.eq("job_type", jobType)
      }
    }

    // Filter kategori menggunakan B-tree index
    if (categoryId) {
      if (Array.isArray(categoryId)) {
        queryBuilder = queryBuilder.in("category_id", categoryId)
      } else {
        queryBuilder = queryBuilder.eq("category_id", categoryId)
      }
    }

    // Filter gaji
    if (salaryMin) {
      queryBuilder = queryBuilder.gte("salary_min", Number.parseInt(salaryMin) * 1000000)
    }

    if (salaryMax) {
      queryBuilder = queryBuilder.lte("salary_max", Number.parseInt(salaryMax) * 1000000)
    }

    // Terapkan limit untuk pagination
    queryBuilder = queryBuilder.limit(limit)

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error searching jobs:", error)
      return {
        data: [],
        nextCursor: null,
        error: error.message,
      }
    }

    // Tentukan cursor berikutnya dari item terakhir
    const nextCursor = data.length === limit ? data[data.length - 1].posted_at : null

    console.log(`Found ${data?.length || 0} jobs matching criteria`)
    return {
      data: data || [],
      nextCursor,
      error: null,
    }
  } catch (error) {
    console.error("Unexpected error searching jobs:", error)
    return {
      data: [],
      nextCursor: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Fungsi untuk mengambil lowongan berdasarkan perusahaan
export async function getJobsByCompany(companyId: number) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("company_id", companyId)
      .eq("status", "active")
      .order("posted_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs by company:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching jobs by company:", error)
    return []
  }
}
