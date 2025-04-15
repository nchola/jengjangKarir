"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"
import {
  getMockJobs,
  getMockFeaturedJobs,
  getMockJobBySlug,
  getMockCategories,
  getMockCompanies,
  createMockJob,
  createMockCompany,
  createMockCategory,
  mockJobs,
} from "./mock-data"

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
      console.log("Falling back to mock data")
      return getMockJobs()
    }

    console.log(`Server action: Found ${data?.length || 0} jobs`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching jobs:", error)
    console.log("Falling back to mock data")
    return getMockJobs()
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
      console.log("Falling back to mock data")
      return getMockFeaturedJobs(limit)
    }

    console.log(`Server action: Found ${data?.length || 0} featured jobs`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching featured jobs:", error)
    console.log("Falling back to mock data")
    return getMockFeaturedJobs(limit)
  }
}

// Fungsi untuk mengambil lowongan berdasarkan kategori
export async function getJobsByCategory(categorySlug: string) {
  try {
    const supabase = getSupabaseAdmin()

    // Dapatkan ID kategori dari slug
    const { data: category, error: categoryError } = await supabase
      .from("job_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (categoryError || !category) {
      console.error("Error fetching category:", categoryError)
      // Return mock jobs filtered by category
      return getMockJobs().filter((job) => job.category?.slug === categorySlug)
    }

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("category_id", category.id)
      .order("posted_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs by category:", error)
      // Return mock jobs filtered by category
      return getMockJobs().filter((job) => job.category?.slug === categorySlug)
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching jobs by category:", error)
    // Return mock jobs filtered by category
    return getMockJobs().filter((job) => job.category?.slug === categorySlug)
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
      console.log("Falling back to mock data")
      return getMockJobBySlug(slug)
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching job by slug:", error)
    console.log("Falling back to mock data")
    return getMockJobBySlug(slug)
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
      console.log("Falling back to mock data")
      return getMockCategories()
    }

    console.log(`Server action: Found ${data?.length || 0} categories`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching categories:", error)
    console.log("Falling back to mock data")
    return getMockCategories()
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
      console.log("Falling back to mock data")
      return getMockCompanies()
    }

    console.log(`Server action: Found ${data?.length || 0} companies`)
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching companies:", error)
    console.log("Falling back to mock data")
    return getMockCompanies()
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
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(`${slug}-${Date.now()}`, logoFile)

      if (uploadError) {
        console.error("Error uploading logo:", uploadError)
        return { success: false, message: "Gagal mengupload logo" }
      }

      // Dapatkan URL publik
      const {
        data: { publicUrl },
      } = supabase.storage.from("company-logos").getPublicUrl(uploadData.path)

      logoUrl = publicUrl
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
      console.log("Falling back to mock data")
      return createMockCompany(formData)
    }

    revalidatePath("/admin/companies")
    return { success: true, message: "Perusahaan berhasil dibuat", data: data[0] }
  } catch (error) {
    console.error("Unexpected error creating company:", error)
    console.log("Falling back to mock data")
    return createMockCompany(formData)
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
      console.log("Falling back to mock data")
      return createMockCategory(formData)
    }

    revalidatePath("/admin/categories")
    return { success: true, message: "Kategori berhasil dibuat", data: data[0] }
  } catch (error) {
    console.error("Unexpected error creating category:", error)
    console.log("Falling back to mock data")
    return createMockCategory(formData)
  }
}

// Fungsi untuk membuat lowongan baru
export async function createJob(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const title = formData.get("title") as string
    const companyId = Number.parseInt(formData.get("company_id") as string)
    const location = formData.get("location") as string
    const jobType = formData.get("job_type") as string
    const salaryDisplay = formData.get("salary_display") as string
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
        description,
        requirements,
        responsibilities,
        category_id: categoryId,
        is_featured: isFeatured,
        status: "active",
        posted_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari
      })
      .select()

    if (error) {
      console.error("Error creating job:", error)
      console.log("Falling back to mock data")
      return createMockJob(formData)
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
  } catch (error) {
    console.error("Unexpected error creating job:", error)
    console.log("Falling back to mock data")
    return createMockJob(formData)
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
    const description = formData.get("description") as string
    const requirements = formData.get("requirements") as string
    const responsibilities = formData.get("responsibilities") as string
    const categoryId = formData.get("category_id") ? Number.parseInt(formData.get("category_id") as string) : null
    const isFeatured = formData.get("is_featured") === "on"
    const status = formData.get("status") as "active" | "expired"

    if (!title || !companyId || !location || !jobType || !description) {
      return { success: false, message: "Semua field wajib diisi" }
    }

    // Update data lowongan
    const { data, error } = await supabase
      .from("jobs")
      .update({
        title,
        company_id: companyId,
        location,
        job_type: jobType,
        salary_display: salaryDisplay,
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
      // For mock data, find and update the job
      const jobIndex = mockJobs.findIndex((job) => job.id === id)
      if (jobIndex !== -1) {
        const updatedJob = {
          ...mockJobs[jobIndex],
          title,
          company_id: companyId,
          location,
          job_type: jobType,
          salary_display: salaryDisplay,
          description,
          requirements,
          responsibilities,
          category_id: categoryId,
          is_featured: isFeatured,
          status,
        }
        mockJobs[jobIndex] = updatedJob
        return { success: true, message: "Lowongan berhasil diupdate (mock)", data: updatedJob }
      }
      return { success: false, message: "Gagal mengupdate lowongan: " + error.message }
    }

    // Update job counts for categories if category changed
    if (currentJob && currentJob.category_id !== categoryId) {
      // Decrement old category count
      if (currentJob.category_id) {
        const { data: oldCategory } = await supabase
          .from("job_categories")
          .select("job_count")
          .eq("id", currentJob.category_id)
          .single()

        if (oldCategory && oldCategory.job_count > 0) {
          await supabase
            .from("job_categories")
            .update({ job_count: oldCategory.job_count - 1 })
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
  } catch (error) {
    console.error("Unexpected error updating job:", error)
    return { success: false, message: "Terjadi kesalahan yang tidak terduga" }
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
      // For mock data, filter out the job
      const jobIndex = mockJobs.findIndex((job) => job.id === id)
      if (jobIndex !== -1) {
        mockJobs.splice(jobIndex, 1)
        return { success: true, message: "Lowongan berhasil dihapus (mock)" }
      }
      return { success: false, message: "Gagal menghapus lowongan: " + error.message }
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
  } catch (error) {
    console.error("Unexpected error deleting job:", error)
    return { success: false, message: "Terjadi kesalahan yang tidak terduga" }
  }
}

// Fungsi untuk mencari lowongan
export async function searchJobs(query: string, location?: string, jobType?: string) {
  try {
    const supabase = getSupabaseAdmin()

    let queryBuilder = supabase
      .from("jobs")
      .select(`
        *,
        company:companies(*),
        category:job_categories(*)
      `)
      .eq("status", "active")
      .order("posted_at", { ascending: false })

    // Filter berdasarkan query
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`)
    }

    // Filter berdasarkan lokasi
    if (location) {
      queryBuilder = queryBuilder.ilike("location", `%${location}%`)
    }

    // Filter berdasarkan tipe pekerjaan
    if (jobType) {
      queryBuilder = queryBuilder.eq("job_type", jobType)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error searching jobs:", error)
      // Filter mock jobs based on search criteria
      let filteredJobs = getMockJobs()
      if (query) {
        filteredJobs = filteredJobs.filter((job) => job.title.toLowerCase().includes(query.toLowerCase()))
      }
      if (location) {
        filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
      }
      if (jobType) {
        filteredJobs = filteredJobs.filter((job) => job.job_type === jobType)
      }
      return filteredJobs
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error searching jobs:", error)
    return []
  }
}
