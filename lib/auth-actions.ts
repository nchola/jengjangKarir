"use server"

import { cookies } from "next/headers"
import { getSupabaseAdmin } from "./supabase"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

// Fungsi untuk login admin
export async function loginAdmin(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()
    const email = formData.get("email") as string
    const password = formData.get("password") as string // Password asli (belum di-hash)

    if (!email || !password) {
      return { success: false, message: "Email dan password wajib diisi" }
    }

    // Cari admin berdasarkan email
    const { data: admin, error } = await supabase.from("admins").select("*").eq("email", email).single()

    if (error || !admin) {
      console.error("Error finding admin:", error)
      return { success: false, message: "Email atau password salah" }
    }

    // Verifikasi password - membandingkan password yang diinput dengan hash yang tersimpan
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatch) {
      return { success: false, message: "Email atau password salah" }
    }

    // Set cookie untuk session
    const cookieStore = await cookies()
    cookieStore.set("adminLoggedIn", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax"
    })

    return { success: true, message: "Login berhasil" }
  } catch (error: any) {
    console.error("Unexpected error during login:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi untuk logout admin
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("adminLoggedIn")
  return { success: true }
}

// Fungsi untuk membuat admin baru (hanya untuk setup awal)
export async function createAdmin(email: string, password: string) {
  try {
    const supabase = getSupabaseAdmin()

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Cek apakah admin sudah ada
    const { data: existingAdmin } = await supabase.from("admins").select("*").eq("email", email).single()

    if (existingAdmin) {
      return { success: false, message: "Admin dengan email ini sudah ada" }
    }

    // Simpan admin baru
    const { data, error } = await supabase
      .from("admins")
      .insert({
        email,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error creating admin:", error)
      return { success: false, message: `Gagal membuat admin: ${error.message}` }
    }

    return { success: true, message: "Admin berhasil dibuat" }
  } catch (error: any) {
    console.error("Unexpected error creating admin:", error)
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}

// Fungsi helper untuk membuat admin pertama (dapat dijalankan dari route handler)
export async function setupInitialAdmin() {
  const email = "admin@jenjangkarir.id"
  const password = "admin123" // Ganti dengan password yang lebih kuat

  const result = await createAdmin(email, password)
  return result
}
