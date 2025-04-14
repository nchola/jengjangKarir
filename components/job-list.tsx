"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
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

  const loadMoreJobs = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          company:companies(*),
          category:job_categories(*)
        `)
        .eq("status", "active")
        .order("posted_at", { ascending: false })
        .range(page * jobsPerPage, (page + 1) * jobsPerPage - 1)

      if (error) throw error

      if (data && data.length > 0) {
        setJobs([...jobs, ...data])
        setPage(page + 1)
        setHasMore(data.length === jobsPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Implement infinite scroll
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
  }, [jobs, loading, hasMore])

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
          <p className="text-gray-500">Tidak ada lowongan yang tersedia</p>
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
