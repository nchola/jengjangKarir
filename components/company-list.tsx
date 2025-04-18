"use client"

import { useState, useEffect, useCallback } from "react"
import { CompanyCard } from "@/components/company-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useFilter } from "@/components/filter-provider"
import type { Company } from "@/types/job"

interface CompanyListProps {
  initialCompanies: Company[]
}

const CompanyList = ({ initialCompanies }: CompanyListProps) => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialCompanies.length >= 9)
  const companiesPerPage = 9
  const supabase = useSupabase()
  const { filterValues } = useFilter()

  // Reset state saat filter berubah
  useEffect(() => {
    setCompanies(initialCompanies)
    setPage(1)
    setHasMore(initialCompanies.length >= companiesPerPage)
  }, [initialCompanies])

  const loadMoreCompanies = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      // Build the query with filters
      let queryBuilder = supabase
        .from("companies")
        .select("*")
        .order("name", { ascending: true })
        .range(page * companiesPerPage, (page + 1) * companiesPerPage - 1)

      // Apply filters based on search parameters
      if (filterValues.q) {
        queryBuilder = queryBuilder.ilike("name", `%${filterValues.q}%`)
      }

      // Filter berdasarkan lokasi
      if (filterValues.location) {
        if (Array.isArray(filterValues.location)) {
          if (filterValues.location.length === 1) {
            queryBuilder = queryBuilder.ilike("location", `%${filterValues.location[0]}%`)
          } else if (filterValues.location.length > 1) {
            const locationFilters = filterValues.location.map((loc) => `location.ilike.%${loc}%`)
            queryBuilder = queryBuilder.or(locationFilters.join(","))
          }
        } else {
          queryBuilder = queryBuilder.ilike("location", `%${filterValues.location}%`)
        }
      }

      // Filter berdasarkan ukuran perusahaan
      if (filterValues.company_size) {
        if (Array.isArray(filterValues.company_size)) {
          if (filterValues.company_size.length === 1) {
            queryBuilder = queryBuilder.eq("company_size", filterValues.company_size[0])
          } else if (filterValues.company_size.length > 1) {
            queryBuilder = queryBuilder.in("company_size", filterValues.company_size)
          }
        } else {
          queryBuilder = queryBuilder.eq("company_size", filterValues.company_size)
        }
      }

      const { data, error } = await queryBuilder

      if (error) throw error

      if (data && data.length > 0) {
        setCompanies((prevCompanies) => [...prevCompanies, ...data])
        setPage((prevPage) => prevPage + 1)
        setHasMore(data.length === companiesPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more companies:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, supabase, page, companiesPerPage, filterValues])

  // Implement infinite scroll with useCallback to prevent infinite loop
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadMoreCompanies()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreCompanies, loading, hasMore])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menampilkan {companies.length} perusahaan</h2>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Tidak ada perusahaan yang tersedia dengan kriteria pencarian ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <Button onClick={loadMoreCompanies} disabled={loading} className="px-8">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CompanyList
