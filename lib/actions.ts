"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"

// Fungsi untuk mengambil semua lowongan
export async function getJobs() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:companies(*),
      category:job_categories(*)
    `)
    .eq("status", "active")
    .order("posted_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  return data
}

// Fungsi untuk mengambil lowongan unggulan
export async function getFeaturedJobs(limit = 4) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:companies(*),
      category:job_categories(*)
    `)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("posted_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured jobs:", error)
    return []
  }

  return data
}

// Fungsi untuk mengambil lowongan berdasarkan kategori
export async function getJobsByCategory(categorySlug: string) {
  const supabase = getSupabaseAdmin()

  // Dapatkan ID kategori dari slug
  const { data: category, error: categoryError } = await supabase
    .from("job_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError)
    return []
  }

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:companies(*),
      category:job_categories(*)
    `)
    .eq("status", "active")
    .eq("category_id", category.id)
    .order("posted_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs by category:", error)
    return []
  }

  return data
}

// Fungsi untuk mengambil detail lowongan
export async function getJobBySlug(slug: string) {
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
}

// Fungsi untuk mengambil semua kategori
export async function getCategories() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.from("job_categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

// Fungsi untuk mengambil semua perusahaan
export async function getCompanies() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.from("companies").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching companies:", error)
    return []
  }

  return data
}

// Fungsi untuk membuat perusahaan baru
export async function createCompany(formData: FormData) {
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
    return { success: false, message: "Gagal membuat perusahaan" }
  }

  revalidatePath("/admin/companies")
  return { success: true, message: "Perusahaan berhasil dibuat", data: data[0] }
}

// Fungsi untuk membuat kategori baru
export async function createCategory(formData: FormData) {
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
    })
    .select()

  if (error) {
    console.error("Error creating category:", error)
    return { success: false, message: "Gagal membuat kategori" }
  }

  revalidatePath("/admin/categories")
  return { success: true, message: "Kategori berhasil dibuat", data: data[0] }
}

// Fungsi untuk membuat lowongan baru
export async function createJob(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Creating job with form data:", Object.fromEntries(formData))

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
      console.error("Missing required fields:", { title, companyId, location, jobType, description })
      return { success: false, message: "Semua field wajib diisi" }
    }

    // Generate slug dari judul
    const slug = slugify(title)
    console.log("Generated slug:", slug)

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
      return { success: false, message: `Gagal membuat lowongan: ${error.message}` }
    }

    console.log("Job created successfully:", data[0])
    revalidatePath("/admin/jobs")
    revalidatePath("/jobs")
    revalidatePath("/")
    return { success: true, message: "Lowongan berhasil dibuat", data: data[0] }
  } catch (error) {
    console.error("Unexpected error in createJob:", error)
    return { success: false, message: "Terjadi kesalahan yang tidak terduga" }
  }
}

// Fungsi untuk mengupdate lowongan
export async function updateJob(id: number, formData: FormData) {
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
    return { success: false, message: "Gagal mengupdate lowongan" }
  }

  revalidatePath("/admin/jobs")
  revalidatePath(`/jobs/${data[0].slug}`)
  revalidatePath("/jobs")
  revalidatePath("/")
  return { success: true, message: "Lowongan berhasil diupdate", data: data[0] }
}

// Fungsi untuk menghapus lowongan
export async function deleteJob(id: number) {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from("jobs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting job:", error)
    return { success: false, message: "Gagal menghapus lowongan" }
  }

  revalidatePath("/admin/jobs")
  revalidatePath("/jobs")
  revalidatePath("/")
  return { success: true, message: "Lowongan berhasil dihapus" }
}

// Fungsi untuk mencari lowongan
export async function searchJobs(query: string, location?: string, jobType?: string) {
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
    return []
  }

  return data
}
