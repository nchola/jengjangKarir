"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface MobileWrapperProps {
  children: React.ReactNode
  className?: string
  type?: "text" | "heading" | "subheading" | "card" | "container" | "button" | "icon" | "input" | "table" | "spacing"
}

export function MobileWrapper({ children, className, type = "text" }: MobileWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  const mobileClass = `admin-mobile-${type}`

  return <div className={cn(mobileClass, className)}>{children}</div>
}
