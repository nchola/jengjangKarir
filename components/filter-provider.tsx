"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

// Tipe untuk filter yang didukung
export type FilterType = "job" | "company" | "article"

// Tipe untuk nilai filter
export interface FilterValues {
  q?: string
  location?: string[]
  job_type?: string[]
  category?: string[]
  salary_min?: string
  salary_max?: string
  company_size?: string[]
  sort?: string
  page?: string
  [key: string]: string | string[] | undefined
}

// Tipe untuk context filter
interface FilterContextType {
  filterValues: FilterValues
  setFilter: (key: string, value: string | string[] | undefined) => void
  setMultipleFilters: (values: Partial<FilterValues>) => void
  removeFilter: (key: string) => void
  resetFilters: () => void
  applyFilters: () => void
  activeFilterCount: number
  isFilterChanged: boolean
  filterType: FilterType
}

// Buat context
const FilterContext = createContext<FilterContextType | undefined>(undefined)

// Provider component
export function FilterProvider({
  children,
  filterType,
  initialFilters = {},
}: {
  children: React.ReactNode
  filterType: FilterType
  initialFilters?: Partial<FilterValues>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Gunakan useRef untuk melacak apakah ini adalah render pertama
  const isFirstRender = useRef(true)

  // State untuk menyimpan nilai filter
  const [filterValues, setFilterValues] = useState<FilterValues>({})

  // State untuk menandai apakah filter telah berubah sejak terakhir diterapkan
  const [isFilterChanged, setIsFilterChanged] = useState(false)

  // Inisialisasi filter dari URL saat komponen dimuat
  useEffect(() => {
    if (isFirstRender.current) {
      const params: FilterValues = {}

      // Ekstrak semua parameter dari URL
      for (const [key, value] of searchParams.entries()) {
        // Handle multi-value parameters (arrays)
        if (params[key] !== undefined) {
          if (Array.isArray(params[key])) {
            ;(params[key] as string[]).push(value)
          } else {
            params[key] = [params[key] as string, value]
          }
        } else {
          params[key] = value
        }
      }

      // Gabungkan dengan initial filters jika ada
      setFilterValues({ ...initialFilters, ...params })
      setIsFilterChanged(false)
      isFirstRender.current = false
    }
  }, [searchParams, initialFilters])

  // Fungsi untuk mengatur nilai filter tunggal
  const setFilter = useCallback((key: string, value: string | string[] | undefined) => {
    setFilterValues((prev) => {
      // Jika nilai undefined atau string kosong, hapus filter
      if (value === undefined || (typeof value === "string" && value.trim() === "")) {
        const newValues = { ...prev }
        delete newValues[key]
        return newValues
      }
      return { ...prev, [key]: value }
    })
    setIsFilterChanged(true)
  }, [])

  // Fungsi untuk mengatur beberapa nilai filter sekaligus
  const setMultipleFilters = useCallback((values: Partial<FilterValues>) => {
    setFilterValues((prev) => {
      const newValues = { ...prev }

      // Proses setiap pasangan key-value
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || (typeof value === "string" && value.trim() === "")) {
          delete newValues[key]
        } else {
          newValues[key] = value
        }
      })

      return newValues
    })
    setIsFilterChanged(true)
  }, [])

  // Fungsi untuk menghapus filter
  const removeFilter = useCallback((key: string) => {
    setFilterValues((prev) => {
      const newValues = { ...prev }
      delete newValues[key]
      return newValues
    })
    setIsFilterChanged(true)
  }, [])

  // Fungsi untuk mereset semua filter
  const resetFilters = useCallback(() => {
    // Simpan query pencarian jika ada
    const query = filterValues.q
    setFilterValues(query ? { q: query } : {})
    setIsFilterChanged(true)
  }, [filterValues.q])

  // Fungsi untuk menerapkan filter ke URL
  const applyFilters = useCallback(() => {
    // Buat objek URLSearchParams baru
    const params = new URLSearchParams()

    // Tambahkan setiap filter ke params
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          // Handle array values
          value.forEach((v) => {
            if (v && v.trim() !== "") {
              params.append(key, v)
            }
          })
        } else if (typeof value === "string" && value.trim() !== "") {
          params.set(key, value)
        }
      }
    })

    // Update URL dengan parameter baru
    router.push(`${pathname}?${params.toString()}`)
    setIsFilterChanged(false)
  }, [pathname, router, filterValues])

  // Hitung jumlah filter aktif (tidak termasuk query pencarian dan pagination)
  const activeFilterCount = useMemo(() => {
    return Object.entries(filterValues).filter(
      ([key, value]) =>
        key !== "q" &&
        key !== "page" &&
        value !== undefined &&
        (typeof value === "string" ? value.trim() !== "" : value.length > 0),
    ).length
  }, [filterValues])

  // Nilai yang akan disediakan oleh context
  const contextValue = useMemo<FilterContextType>(
    () => ({
      filterValues,
      setFilter,
      setMultipleFilters,
      removeFilter,
      resetFilters,
      applyFilters,
      activeFilterCount,
      isFilterChanged,
      filterType,
    }),
    [
      filterValues,
      setFilter,
      setMultipleFilters,
      removeFilter,
      resetFilters,
      applyFilters,
      activeFilterCount,
      isFilterChanged,
      filterType,
    ],
  )

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>
}

// Hook untuk menggunakan filter context
export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}

// Hook untuk mengecek apakah komponen berada dalam FilterProvider
export function useOptionalFilter() {
  return useContext(FilterContext)
}
