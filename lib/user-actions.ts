"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { getSupabaseAdmin } from "./supabase"

// Register a new user
export async function registerUser({
  fullName,
  email,
  password,
}: {
  fullName: string
  email: string
  password: string
}) {
  try {
    const supabase = getSupabaseAdmin()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return { success: false, message: "Email sudah terdaftar" }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error creating user:", error)
      return { success: false, message: `Gagal membuat akun: ${error.message}` }
    }

    return { success: true, message: "Registrasi berhasil" }
  } catch (error: any) {
    console.error("Unexpected error during registration:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Login user
export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  try {
    const supabase = getSupabaseAdmin()

    // Find user by email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return { success: false, message: "Email atau password salah" }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return { success: false, message: "Email atau password salah" }
    }

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // Set cookies for session
    cookies().set("userLoggedIn", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    cookies().set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return { success: true, message: "Login berhasil" }
  } catch (error: any) {
    console.error("Unexpected error during login:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Logout user
export async function logoutUser() {
  cookies().delete("userLoggedIn")
  cookies().delete("userId")
  revalidatePath("/")
  return { success: true }
}

// Get current user
export async function getCurrentUser() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, email, full_name, phone, profile_image_url, resume_url, headline, bio, location, created_at, last_login",
      )
      .eq("id", userId)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return { success: false, message: "Tidak terautentikasi" }
  }

  try {
    const supabase = getSupabaseAdmin()

    const fullName = formData.get("fullName") as string
    const phone = formData.get("phone") as string
    const headline = formData.get("headline") as string
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string
    const profileImage = formData.get("profileImage") as File
    const resume = formData.get("resume") as File

    // Prepare update data
    const updateData: any = {
      full_name: fullName,
      phone,
      headline,
      bio,
      location,
      updated_at: new Date().toISOString(),
    }

    // Upload profile image if provided
    if (profileImage && profileImage.size > 0) {
      try {
        const fileName = `profile-${userId}-${Date.now()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileImage)

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("profile-images").getPublicUrl(uploadData.path)

          updateData.profile_image_url = publicUrl
        }
      } catch (error) {
        console.error("Error uploading profile image:", error)
      }
    }

    // Upload resume if provided
    if (resume && resume.size > 0) {
      try {
        const fileName = `resume-${userId}-${Date.now()}`
        const { data: uploadData, error: uploadError } = await supabase.storage.from("resumes").upload(fileName, resume)

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("resumes").getPublicUrl(uploadData.path)

          updateData.resume_url = publicUrl
        }
      } catch (error) {
        console.error("Error uploading resume:", error)
      }
    }

    // Update user data
    const { error } = await supabase.from("users").update(updateData).eq("id", userId)

    if (error) {
      return { success: false, message: `Gagal memperbarui profil: ${error.message}` }
    }

    revalidatePath("/dashboard/profile")
    return { success: true, message: "Profil berhasil diperbarui" }
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}
