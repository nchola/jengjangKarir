"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  placeholder?: string
  targetPath?: string // Path tujuan pencarian jika tidak dalam FilterProvider
}

export function SearchBar({
  placeholder = "Posisi, keahlian, atau perusahaan",
  targetPath = "/jobs", // Default ke halaman jobs jika tidak ditentukan
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State lokal untuk input pencarian
  const [keyword, setKeyword] = useState("")

  // Gunakan useEffect dengan dependensi yang benar untuk menghindari loop
  useEffect(() => {
    const query = searchParams.get("q")
    if (query !== null) {
      setKeyword(query)
    }
  }, [searchParams])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Buat objek URLSearchParams baru
      const params = new URLSearchParams(searchParams.toString())

      // Update atau hapus parameter q
      if (keyword.trim()) {
        params.set("q", keyword)
      } else {
        params.delete("q")
      }

      // Reset halaman saat melakukan pencarian baru
      params.delete("page")

      // Tentukan path tujuan
      // Jika kita sudah di halaman jobs atau companies, tetap di halaman tersebut
      // Jika tidak, gunakan targetPath
      const currentPath = pathname
      const searchPath =
        currentPath.startsWith("/jobs") || currentPath.startsWith("/companies") ? currentPath : targetPath

      // Navigasi ke URL dengan parameter pencarian
      router.push(`${searchPath}?${params.toString()}`)
    },
    [keyword, router, searchParams, pathname, targetPath],
  )

  const clearSearch = useCallback(() => {
    setKeyword("")

    // Jika kita sudah di halaman pencarian, update URL
    if (pathname.startsWith("/jobs") || pathname.startsWith("/companies")) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("q")
      router.push(`${pathname}?${params.toString()}`)
    }
  }, [router, searchParams, pathname])

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 relative z-10 border border-gray-100 max-w-4xl mx-auto -mt-6 sm:-mt-8 md:-mt-10">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-10 pr-8 h-10 sm:h-11 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="h-10 sm:h-11 px-4 sm:px-6 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 min-w-[100px]"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Cari</span>
        </Button>
      </form>
    </div>
  )
}
