import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { getCompanies } from "@/lib/company-actions"
import CompanyList from "@/components/company-list"
import CompanyFilters from "@/components/company-filters"
import { SearchBar } from "@/components/search-bar"
import { FilterProvider } from "@/components/filter-provider"
import { FilterChips } from "@/components/filter-chips"

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract search parameters
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined
  const location = searchParams.location
  const size = searchParams.company_size

  // Get companies based on search parameters
  const companies = await getCompanies(query, location, size)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">Temukan Perusahaan</h1>
          <SearchBar placeholder="Cari perusahaan..." />
        </div>
      </div>

      <FilterProvider filterType="company">
        <div className="container mx-auto px-4 py-8">
          <FilterChips />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                <CompanyFilters />
              </Suspense>
            </div>

            <div className="w-full md:w-3/4">
              <Suspense
                fallback={
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-40 w-full" />
                    ))}
                  </div>
                }
              >
                <CompanyList initialCompanies={companies} />
              </Suspense>
            </div>
          </div>
        </div>
      </FilterProvider>

      <Footer />
    </main>
  )
}
