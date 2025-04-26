import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Globe, Users, Briefcase } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getCompanyBySlug } from "@/lib/company-actions"
import { getJobsByCompany } from "@/lib/actions"
import JobList from "@/components/job-list"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterProvider } from "@/components/filter-provider"

export default async function CompanyDetailPage({ params }: { params: { slug: string } }) {
  const company = await getCompanyBySlug(params.slug)

  if (!company) {
    notFound()
  }

  const jobs = await getJobsByCompany(company.id)

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
          <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
          {company.location && (
            <div className="flex items-center text-white/80">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{company.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg"></div>
                  <Image
                    src={
                      company.logo_url ||
                      `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(company.name.charAt(0))}`
                    }
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain p-2 rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{company.name}</h2>
                  {company.location && <p className="text-gray-600">{company.location}</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {company.website && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Globe className="h-4 w-4 mr-2 text-teal-500" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {company.company_size && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Users className="h-4 w-4 mr-2 text-teal-500" />
                    <span>{company.company_size} karyawan</span>
                  </div>
                )}
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <Briefcase className="h-4 w-4 mr-2 text-teal-500" />
                  <span>{jobs.length} lowongan aktif</span>
                </div>
              </div>

              {company.background && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Tentang Perusahaan</h3>
                  <p className="text-gray-700">{company.background}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Kontak Perusahaan</h3>
              {company.website && (
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600 mb-3">
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    Kunjungi Website
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Lihat Semua Lowongan
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Lowongan Terkait</h2>
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            }
          >
            {jobs.length > 0 ? (
              <FilterProvider filterType="job">
                <JobList initialJobs={jobs} />
              </FilterProvider>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-500">Tidak ada lowongan aktif saat ini</p>
              </div>
            )}
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  )
}
