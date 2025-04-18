"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"
import type { Company } from "@/types/job"

// Fungsi untuk mengambil semua perusahaan dengan filter yang lebih baik
export async function getCompanies(query?: string, location?: string | string[], size?: string | string[]) {
  try {
    const supabase = getSupabaseAdmin()
    console.log("Fetching companies with filters:", { query, location, size })

    let queryBuilder = supabase.from("companies").select("*").order("name", { ascending: true })

    // Filter berdasarkan query pencarian
    if (query && query.trim() !== "") {
      queryBuilder = queryBuilder.ilike("name", `%${query}%`)
    }

    // Filter berdasarkan lokasi
    if (location) {
      if (Array.isArray(location)) {
        if (location.length === 1) {
          queryBuilder = queryBuilder.ilike("location", `%${location[0]}%`)
        } else if (location.length > 1) {
          const locationFilters = location.map((loc) => `location.ilike.%${loc}%`)
          queryBuilder = queryBuilder.or(locationFilters.join(","))
        }
      } else {
        queryBuilder = queryBuilder.ilike("location", `%${location}%`)
      }
    }

    // Filter berdasarkan ukuran perusahaan
    if (size) {
      if (Array.isArray(size)) {
        if (size.length === 1) {
          queryBuilder = queryBuilder.eq("company_size", size[0])
        } else if (size.length > 1) {
          queryBuilder = queryBuilder.in("company_size", size)
        }
      } else {
        queryBuilder = queryBuilder.eq("company_size", size)
      }
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error fetching companies:", error)
      return []
    }

    console.log(`Found ${data?.length || 0} companies matching criteria`)
    return data || []
  } catch (error) {
    console.error("Error fetching companies:", error)
    return []
  }
}

// Fungsi untuk mengambil perusahaan berdasarkan slug
export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("companies").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching company by slug:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching company by slug:", error)
    return null
  }
}

// Fungsi untuk mengambil perusahaan berdasarkan ID
export async function getCompanyById(id: number): Promise<Company | null> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from("companies").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching company:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching company:", error)
    return null
  }
}

// Fungsi untuk membuat perusahaan baru
export async function createCompany(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const website = formData.get("website") as string
    const companySize = formData.get("company_size") as string
    const background = formData.get("background") as string
    const logoFile = formData.get("logo") as File

    if (!name) {
      return { success: false, message: "Nama perusahaan wajib diisi" }
    }

    console.log("Creating company with data:", {
      name,
      location,
      website,
      companySize,
      background,
      hasLogo: !!logoFile,
    })

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

    // Ensure empty strings instead of null for optional fields
    const companyData = {
      name,
      slug,
      location: location || "",
      logo_url: logoUrl,
      website: website || "",
      company_size: companySize || "",
      background: background || "",
    }

    console.log("Final company data to insert:", companyData)

    // Simpan data perusahaan
    const { data, error } = await supabase.from("companies").insert(companyData).select()

    if (error) {
      console.error("Error creating company:", error)
      return { success: false, message: `Gagal membuat perusahaan: ${error.message}` }
    }

    revalidatePath("/admin/companies")
    return { success: true, message: "Perusahaan berhasil dibuat", data: data[0] }
  } catch (error: any) {
    console.error("Error creating company:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk mengupdate perusahaan
export async function updateCompany(id: number, formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const website = formData.get("website") as string
    const companySize = formData.get("company_size") as string
    const background = formData.get("background") as string
    const logoFile = formData.get("logo") as File
    const resetLogo = formData.get("reset_logo") === "true"

    if (!name) {
      return { success: false, message: "Nama perusahaan wajib diisi" }
    }

    console.log("Updating company with data:", {
      id,
      name,
      location,
      website,
      companySize,
      background,
      hasLogo: !!logoFile,
      resetLogo,
    })

    // Get current company data
    const { data: currentCompany } = await supabase.from("companies").select("logo_url").eq("id", id).single()

    // Generate slug dari nama
    const slug = slugify(name)

    // Prepare update data
    const updateData: any = {
      name,
      slug,
      location: location || "",
      website: website || "",
      company_size: companySize || "",
      background: background || "",
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

    console.log("Final company data to update:", updateData)

    // Update company data
    const { data, error } = await supabase.from("companies").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Error updating company:", error)
      return { success: false, message: `Gagal mengupdate perusahaan: ${error.message}` }
    }

    revalidatePath("/admin/companies")
    return { success: true, message: "Perusahaan berhasil diupdate", data: data[0] }
  } catch (error: any) {
    console.error("Error updating company:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk menghapus perusahaan
export async function deleteCompany(id: number) {
  try {
    const supabase = getSupabaseAdmin()

    // Check if company has jobs
    const { count, error: countError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", id)

    if (countError) {
      console.error("Error checking company jobs:", countError)
      return { success: false, message: `Gagal memeriksa lowongan perusahaan: ${countError.message}` }
    }

    if (count && count > 0) {
      return {
        success: false,
        message: `Perusahaan ini memiliki ${count} lowongan aktif. Hapus lowongan terlebih dahulu sebelum menghapus perusahaan.`,
      }
    }

    const { error } = await supabase.from("companies").delete().eq("id", id)

    if (error) {
      console.error("Error deleting company:", error)
      return { success: false, message: `Gagal menghapus perusahaan: ${error.message}` }
    }

    revalidatePath("/admin/companies")
    return { success: true, message: "Perusahaan berhasil dihapus" }
  } catch (error: any) {
    console.error("Error deleting company:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}
