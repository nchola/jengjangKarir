"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { JobWithRelations } from "@/types/job"
import { searchJobs } from "@/lib/actions"
import { useFilter } from "@/components/filter-provider"

interface JobListProps {
  initialJobs: JobWithRelations[]
  initialCursor?: string | null
}

export default function JobList({ initialJobs, initialCursor }: JobListProps) {
  const [jobs, setJobs] = useState<JobWithRelations[]>(initialJobs)
  const [cursor, setCursor] = useState<string | null>(initialCursor || null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { filterValues } = useFilter()

  // Reset state saat filter berubah
  useEffect(() => {
    setJobs(initialJobs)
    setCursor(initialCursor || null)
  }, [initialJobs, initialCursor])

  const loadMore = async () => {
    if (loading || !cursor) return

    setLoading(true)
    try {
      const result = await searchJobs({
        ...filterValues,
        cursor,
        limit: 10,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setJobs(prev => [...prev, ...result.data])
      setCursor(result.nextCursor)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load more jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada lowongan yang ditemukan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            {...job}
            isNew={new Date(job.posted_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
          />
        ))}
      </div>

      {cursor && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white"
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
    </div>
  )
}
