import type React from "react"
import type { Metadata } from "next"
import AdminLayoutClient from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - JengjangKarir",
  description: "Panel admin untuk mengelola lowongan kerja dan konten",
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // This is the only place where AdminLayoutClient should be used
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
