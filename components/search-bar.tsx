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
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-12 relative z-10 border border-gray-100">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-12 pr-10 h-14 rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto h-14 px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Search className="mr-2 h-5 w-5" />
          Cari
        </Button>
      </form>
    </div>
  )
}
