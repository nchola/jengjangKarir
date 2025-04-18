"use client"

import { useState, useEffect, useCallback } from "react"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useFilter } from "@/components/filter-provider"
import type { JobWithRelations } from "@/types/job"

interface JobListProps {
  initialJobs: JobWithRelations[]
}

const JobList = ({ initialJobs }: JobListProps) => {
  const [jobs, setJobs] = useState<JobWithRelations[]>(initialJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialJobs.length >= 5)
  const jobsPerPage = 5
  const supabase = useSupabase()
  const { filterValues } = useFilter()

  // Reset state saat filter berubah
  useEffect(() => {
    setJobs(initialJobs)
    setPage(1)
    setHasMore(initialJobs.length >= jobsPerPage)
  }, [initialJobs])

  const loadMoreJobs = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      // Build the query with filters
      let queryBuilder = supabase
        .from("jobs")
        .select(`
          *,
          company:companies(*),
          category:job_categories(*)
        `)
        .eq("status", "active")
        .order("posted_at", { ascending: false })
        .range(page * jobsPerPage, (page + 1) * jobsPerPage - 1)

      // Apply filters based on search parameters
      if (filterValues.q) {
        queryBuilder = queryBuilder.or(`title.ilike.%${filterValues.q}%,companies.name.ilike.%${filterValues.q}%`)
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

      // Filter berdasarkan tipe pekerjaan
      if (filterValues.job_type) {
        if (Array.isArray(filterValues.job_type)) {
          if (filterValues.job_type.length === 1) {
            queryBuilder = queryBuilder.eq("job_type", filterValues.job_type[0])
          } else if (filterValues.job_type.length > 1) {
            queryBuilder = queryBuilder.in("job_type", filterValues.job_type)
          }
        } else if (filterValues.job_type !== "all") {
          queryBuilder = queryBuilder.eq("job_type", filterValues.job_type)
        }
      }

      // Filter berdasarkan kategori
      if (filterValues.category) {
        if (Array.isArray(filterValues.category)) {
          if (filterValues.category.length === 1) {
            queryBuilder = queryBuilder.eq("category_id", filterValues.category[0])
          } else if (filterValues.category.length > 1) {
            queryBuilder = queryBuilder.in("category_id", filterValues.category)
          }
        } else {
          queryBuilder = queryBuilder.eq("category_id", filterValues.category)
        }
      }

      // Filter berdasarkan gaji
      if (filterValues.salary_min) {
        queryBuilder = queryBuilder.gte("salary_min", Number.parseInt(filterValues.salary_min) * 1000000)
      }

      if (filterValues.salary_max) {
        queryBuilder = queryBuilder.lte("salary_max", Number.parseInt(filterValues.salary_max) * 1000000)
      }

      const { data, error } = await queryBuilder

      if (error) throw error

      if (data && data.length > 0) {
        setJobs((prevJobs) => [...prevJobs, ...data])
        setPage((prevPage) => prevPage + 1)
        setHasMore(data.length === jobsPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more jobs:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, supabase, page, jobsPerPage, filterValues])

  // Implement infinite scroll with useCallback to prevent infinite loop
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadMoreJobs()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreJobs, loading, hasMore])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menampilkan {jobs.length} lowongan</h2>
        <div className="text-sm text-gray-500">
          Urutkan: <span className="font-medium text-blue-600">Terbaru</span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Tidak ada lowongan yang tersedia dengan kriteria pencarian ini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <Button onClick={loadMoreJobs} disabled={loading} className="px-8">
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

export default JobList
