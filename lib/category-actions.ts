"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { slugify } from "./utils"

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

// Fungsi untuk menghapus kategori
export async function deleteCategory(id: number) {
  try {
    const supabase = getSupabaseAdmin()

    // Check if category has jobs
    const { count, error: countError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if (countError) {
      console.error("Error checking category jobs:", countError)
      return { success: false, message: `Gagal memeriksa lowongan kategori: ${countError.message}` }
    }

    if (count && count > 0) {
      return {
        success: false,
        message: `Kategori ini memiliki ${count} lowongan aktif. Hapus lowongan terlebih dahulu atau ubah kategori lowongan sebelum menghapus kategori.`,
      }
    }

    const { error } = await supabase.from("job_categories").delete().eq("id", id)

    if (error) {
      console.error("Error deleting category:", error)
      return { success: false, message: `Gagal menghapus kategori: ${error.message}` }
    }

    revalidatePath("/admin/categories")
    return { success: true, message: "Kategori berhasil dihapus" }
  } catch (error: any) {
    console.error("Unexpected error deleting category:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}
