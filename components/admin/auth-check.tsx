"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { parseCookies } from "nookies"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check if the user is logged in using cookies
    const cookies = parseCookies()
    const isLoggedIn = cookies.adminLoggedIn === "true"

    if (!isLoggedIn) {
      router.push("/admin/login")
    }
  }, [router])

  return <>{children}</>
}
