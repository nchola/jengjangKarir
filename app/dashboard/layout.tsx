import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import DashboardSidebar from "@/components/dashboard/sidebar"
import Navbar from "@/components/navbar"
import { getCurrentUser } from "@/lib/user-actions"

export const metadata: Metadata = {
  title: "Dashboard - JenjangKarir",
  description: "Kelola profil dan lamaran pekerjaan Anda",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is logged in
  const userLoggedIn = cookies().get("userLoggedIn")?.value

  if (!userLoggedIn) {
    redirect("/login")
  }

  // Get current user
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <DashboardSidebar />

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
