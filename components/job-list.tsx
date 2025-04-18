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
      // Build the base query
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

      // Apply filters only if they exist
      if (filterValues.q) {
        queryBuilder = queryBuilder.or(`title.ilike.%${filterValues.q}%,companies.name.ilike.%${filterValues.q}%`)
      }

      if (filterValues.location) {
        const locations = Array.isArray(filterValues.location) 
          ? filterValues.location 
          : [filterValues.location]
        const locationFilters = locations.map(loc => `location.ilike.%${loc}%`)
        queryBuilder = queryBuilder.or(locationFilters.join(","))
      }

      if (filterValues.job_type) {
        const jobTypes = Array.isArray(filterValues.job_type)
          ? filterValues.job_type
          : [filterValues.job_type]
        queryBuilder = queryBuilder.in("job_type", jobTypes)
      }

      if (filterValues.category) {
        const categories = Array.isArray(filterValues.category)
          ? filterValues.category
          : [filterValues.category]
        queryBuilder = queryBuilder.in("category_id", categories)
      }

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

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          title={job.title}
          company={job.company}
          location={job.location}
          job_type={job.job_type}
          salary_display={job.salary_display}
          show_salary={job.show_salary}
          posted_at={job.posted_at}
          is_featured={job.is_featured}
          slug={job.slug}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMoreJobs}
            disabled={loading}
            className="w-full md:w-auto"
          >
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

      {!loading && jobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada lowongan yang ditemukan</p>
        </div>
      )}
    </div>
  )
}

export default JobList
