"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase"
import { getCurrentUser } from "./user-actions"

// Submit job application
export async function submitJobApplication(formData: FormData) {
  const userId = cookies().get("userId")?.value
  const user = userId ? await getCurrentUser() : null

  try {
    const supabase = getSupabaseAdmin()

    const jobId = Number.parseInt(formData.get("jobId") as string)
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const coverLetter = formData.get("coverLetter") as string
    const resumeFile = formData.get("resume") as File

    // Check if user has already applied for this job
    if (userId) {
      const { data: existingApplication } = await supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("user_id", userId)
        .single()

      if (existingApplication) {
        return { success: false, message: "Anda sudah melamar untuk posisi ini" }
      }
    }

    // Prepare application data
    const applicationData: any = {
      job_id: jobId,
      full_name: fullName,
      email,
      phone,
      cover_letter: coverLetter,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add user_id if logged in
    if (userId) {
      applicationData.user_id = Number.parseInt(userId)
    }

    // Use existing resume from user profile if available and no new resume uploaded
    if (user?.resume_url && (!resumeFile || resumeFile.size === 0)) {
      applicationData.resume_url = user.resume_url
    }
    // Upload resume if provided
    else if (resumeFile && resumeFile.size > 0) {
      try {
        const fileName = `resume-${Date.now()}-${resumeFile.name.replace(/\s+/g, "-")}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile)

        if (uploadError) {
          return { success: false, message: `Gagal mengunggah resume: ${uploadError.message}` }
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("resumes").getPublicUrl(uploadData.path)

        applicationData.resume_url = publicUrl
      } catch (error: any) {
        console.error("Error uploading resume:", error)
        return { success: false, message: `Gagal mengunggah resume: ${error.message}` }
      }
    } else {
      return { success: false, message: "Resume diperlukan untuk melamar pekerjaan" }
    }

    // Insert application
    const { data, error } = await supabase.from("job_applications").insert(applicationData).select()

    if (error) {
      console.error("Error submitting application:", error)
      return { success: false, message: `Gagal mengirim lamaran: ${error.message}` }
    }

    revalidatePath("/dashboard/applications")
    return { success: true, message: "Lamaran berhasil dikirim" }
  } catch (error: any) {
    console.error("Unexpected error submitting application:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Get user applications
export async function getUserApplications() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return []
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        job:jobs(
          id,
          title,
          slug,
          company:companies(
            id,
            name,
            logo_url
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching applications:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching applications:", error)
    return []
  }
}

// Get application details
export async function getApplicationDetails(applicationId: number) {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        job:jobs(
          id,
          title,
          slug,
          location,
          job_type,
          salary_display,
          description,
          company:companies(
            id,
            name,
            logo_url
          )
        )
      `)
      .eq("id", applicationId)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching application details:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching application details:", error)
    return null
  }
}
