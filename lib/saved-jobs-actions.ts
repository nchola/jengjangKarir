"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"

// Save job
export async function saveJob(jobId: number) {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return { success: false, message: "Silakan login untuk menyimpan lowongan" }
  }

  try {
    const supabase = getSupabaseAdmin()

    // Check if already saved
    const { data: existingSaved } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("job_id", jobId)
      .eq("user_id", userId)
      .single()

    if (existingSaved) {
      return { success: false, message: "Lowongan sudah disimpan" }
    }

    // Save job
    const { error } = await supabase.from("saved_jobs").insert({
      user_id: Number.parseInt(userId),
      job_id: jobId,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving job:", error)
      return { success: false, message: `Gagal menyimpan lowongan: ${error.message}` }
    }

    revalidatePath("/dashboard/saved-jobs")
    return { success: true, message: "Lowongan berhasil disimpan" }
  } catch (error: any) {
    console.error("Unexpected error saving job:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Unsave job
export async function unsaveJob(jobId: number) {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return { success: false, message: "Silakan login untuk menghapus lowongan tersimpan" }
  }

  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("user_id", userId)

    if (error) {
      console.error("Error unsaving job:", error)
      return { success: false, message: `Gagal menghapus lowongan tersimpan: ${error.message}` }
    }

    revalidatePath("/dashboard/saved-jobs")
    return { success: true, message: "Lowongan berhasil dihapus dari tersimpan" }
  } catch (error: any) {
    console.error("Unexpected error unsaving job:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Check if job is saved
export async function isJobSaved(jobId: number) {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return false
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data } = await supabase.from("saved_jobs").select("id").eq("job_id", jobId).eq("user_id", userId).single()

    return !!data
  } catch (error) {
    console.error("Error checking if job is saved:", error)
    return false
  }
}

// Get saved jobs
export async function getSavedJobs() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return []
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("saved_jobs")
      .select(`
        id,
        created_at,
        job:jobs(
          id,
          title,
          slug,
          location,
          job_type,
          salary_display,
          company:companies(
            id,
            name,
            logo_url
          ),
          category:job_categories(
            id,
            name
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching saved jobs:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching saved jobs:", error)
    return []
  }
}
