"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  label?: string
}

export default function BackButton({ label = "Kembali" }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button variant="ghost" size="sm" className="mb-4 text-gray-600 hover:text-gray-900" onClick={() => router.back()}>
      <ChevronLeft className="h-4 w-4 mr-1" />
      {label}
    </Button>
  )
}
