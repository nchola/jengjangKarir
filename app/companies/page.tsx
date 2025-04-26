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

      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-teal-500 py-12">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6"></h1>
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
