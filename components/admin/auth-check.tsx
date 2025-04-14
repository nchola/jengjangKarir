"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/admin/login")
    }
  }, [router])

  return <>{children}</>
}
