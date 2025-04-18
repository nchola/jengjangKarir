"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOptionalFilter } from "@/components/filter-provider"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"

export function FilterChips() {
  const filterContext = useOptionalFilter()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Fungsi untuk mendapatkan label yang lebih user-friendly
  const getFilterLabel = useCallback((key: string, value: string) => {
    switch (key) {
      case "location":
        return `Lokasi: ${value}`
      case "job_type":
        return `Tipe: ${
          value === "full-time"
            ? "Full Time"
            : value === "part-time"
              ? "Part Time"
              : value === "contract"
                ? "Contract"
                : value === "freelance"
                  ? "Freelance"
                  : value === "remote"
                    ? "Remote"
                    : value === "hybrid"
                      ? "Hybrid"
                      : value
        }`
      case "category":
        return `Kategori: ${value}`
      case "company_size":
        return `Ukuran: ${value} karyawan`
      case "salary_min":
        return `Gaji Min: Rp ${value} juta`
      case "salary_max":
        return `Gaji Max: Rp ${value} juta`
      default:
        return `${key}: ${value}`
    }
  }, [])

  const handleRemoveFilter = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        // Jika ada multiple values untuk key ini, hapus hanya value yang dipilih
        const values = params.getAll(key)
        params.delete(key)
        values.forEach((v) => {
          if (v !== value) params.append(key, v)
        })
      } else {
        // Hapus semua values untuk key ini
        params.delete(key)
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  const handleResetAll = useCallback(() => {
    const params = new URLSearchParams()
    // Simpan query pencarian jika ada
    const query = searchParams.get("q")
    if (query) params.set("q", query)

    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  // Hitung jumlah filter aktif dan kumpulkan filter aktif
  const { activeFilterCount, activeFilters } = useMemo(() => {
    let count = 0
    const filters: Array<{ key: string; value: string }> = []

    // Kumpulkan semua filter aktif
    for (const [key, value] of searchParams.entries()) {
      if (key !== "q" && key !== "page" && value.trim() !== "") {
        count++
        filters.push({ key, value })
      }
    }

    return { activeFilterCount: count, activeFilters: filters }
  }, [searchParams])

  if (filterContext) {
    const { filterValues, removeFilter, resetFilters, applyFilters, activeFilterCount } = filterContext

    if (activeFilterCount === 0) {
      if (activeFilterCount === 0 && activeFilters.length === 0) {
        return null
      }
    }

    // Render chips untuk setiap filter aktif
    return (
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(filterValues).map(([key, value]) => {
          // Skip query pencarian dan pagination
          if (key === "q" || key === "page") return null

          // Handle array values
          if (Array.isArray(value)) {
            return value.map((v, i) => (
              <Button
                key={`${key}-${i}`}
                variant="outline"
                size="sm"
                className="h-8 bg-gray-50 hover:bg-gray-100 border-gray-200"
                onClick={() => {
                  // Hapus nilai ini dari array
                  const newValues = value.filter((_, idx) => idx !== i)
                  if (newValues.length === 0) {
                    removeFilter(key)
                  } else {
                    // Update filter dengan array baru
                    filterContext.setFilter(key, newValues)
                  }
                  applyFilters()
                }}
              >
                {getFilterLabel(key, v)}
                <X className="ml-1 h-3 w-3" />
              </Button>
            ))
          }

          // Handle single values
          if (typeof value === "string" && value.trim() !== "") {
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-8 bg-gray-50 hover:bg-gray-100 border-gray-200"
                onClick={() => {
                  removeFilter(key)
                  applyFilters()
                }}
              >
                {getFilterLabel(key, value)}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )
          }

          return null
        })}

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-gray-500 hover:text-red-500"
            onClick={() => {
              resetFilters()
              applyFilters()
            }}
          >
            Reset Semua
          </Button>
        )}
      </div>
    )
  }

  if (activeFilterCount === 0 && activeFilters.length === 0) {
    return null
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {activeFilters.map(({ key, value }, index) => (
        <Button
          key={`${key}-${index}`}
          variant="outline"
          size="sm"
          className="h-8 bg-gray-50 hover:bg-gray-100 border-gray-200"
          onClick={() => handleRemoveFilter(key, value)}
        >
          {getFilterLabel(key, value)}
          <X className="ml-1 h-3 w-3" />
        </Button>
      ))}

      <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-red-500" onClick={handleResetAll}>
        Reset Semua
      </Button>
    </div>
  )
}
