"use client"

import { JobCard } from "@/components/job-card"
import type { JobWithRelations } from "@/types/job"

interface FeaturedJobsProps {
  jobs: JobWithRelations[]
}

const FeaturedJobs = ({ jobs }: FeaturedJobsProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Belum ada lowongan unggulan</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  )
}

export default FeaturedJobs
