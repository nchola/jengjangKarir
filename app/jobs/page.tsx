import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { Skeleton } from "@/components/ui/skeleton"
import JobFilters from "@/components/job-filters"
import JobList from "@/components/job-list"
import { FilterChips } from "@/components/filter-chips"
import { FilterProvider } from "@/components/filter-provider"
import { getCategories, searchJobs } from "@/lib/actions"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract search parameters
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined
  const jobType = typeof searchParams.job_type === "string" ? searchParams.job_type : undefined
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined
  const salaryMin = typeof searchParams.salary_min === "string" ? searchParams.salary_min : undefined
  const salaryMax = typeof searchParams.salary_max === "string" ? searchParams.salary_max : undefined

  // Get jobs and categories
  const [jobsResult, categories] = await Promise.all([
    searchJobs({
      query,
      location,
      jobType,
      categoryId,
      salaryMin,
      salaryMax,
      limit: 10,
    }),
    getCategories(),
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">Temukan Lowongan Kerja</h1>
          <SearchBar />
        </div>
      </div>

      <FilterProvider filterType="job">
        <div className="container mx-auto px-4 py-8">
          <FilterChips />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                <JobFilters categories={categories} />
              </Suspense>
            </div>

            <div className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-40 w-full" />
                    ))}
                  </div>
                }
              >
                <JobList initialJobs={jobsResult.data} initialCursor={jobsResult.nextCursor} />
              </Suspense>
            </div>
          </div>
        </div>
      </FilterProvider>

      <Footer />
    </main>
  )
}
