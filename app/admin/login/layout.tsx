import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - JengjangKarir",
  description: "Login ke dashboard admin JengjangKarir",
}

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-gray-100">{children}</div>
}
