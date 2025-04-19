import { Suspense } from "react"
import { Metadata } from "next"
import { getJobs } from "@/lib/actions"
import JobCard from "@/components/job-card"
import { SearchBar } from "@/components/search-bar"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Lowongan Terbaru | JenjangKarir",
  description: "Temukan lowongan kerja terbaru dari berbagai perusahaan terpercaya di Indonesia.",
}

export default async function LatestJobsPage() {
  // Get latest jobs
  const latestJobs = await getJobs()

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Lowongan Terbaru
            </span>
          </h1>
          <p className="text-gray-600">
            Temukan peluang karir terbaru yang sesuai dengan keahlian dan minat Anda
          </p>
        </div>

        <div className="mb-8">
          <SearchBar targetPath="/jobs" />
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestJobs.map((job) => (
              <JobCard key={job.id} {...job} isNew={true} />
            ))}
          </div>
        </Suspense>
      </div>
    </main>
  )
} 