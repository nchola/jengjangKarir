import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Clock, Briefcase, Building, Tag, DollarSign, Info, Globe, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getJobBySlug } from "@/lib/job-actions"
import { formatDate } from "@/lib/utils"

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug)

  if (!job) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-600 py-6 md:py-12">
        <div className="container mx-auto px-3 md:px-4">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{job.title}</h1>
          <div className="flex items-center text-white/80 text-sm md:text-base">
            <Building className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span>{job.company.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg"></div>
                  <Image
                    src={job.company.logo_url || "/placeholder.svg?height=64&width=64"}
                    alt={`${job.company.name} logo`}
                    fill
                    className="object-contain p-2 rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">{job.company.name}</h2>
                  <p className="text-gray-600 text-sm md:text-base">{job.company.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-sm">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-teal-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-sm">
                  <Briefcase className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-teal-500" />
                  <span>{job.job_type}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-sm">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-teal-500" />
                  <span>Diposting {formatDate(job.posted_at)}</span>
                </div>
                {job.category && (
                  <div className="flex items-center bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-sm">
                    <Tag className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-teal-500" />
                    <span>{job.category.name}</span>
                  </div>
                )}
              </div>

              {/* Salary information */}
              <div className="mb-4 md:mb-6">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Gaji</h3>
                <div className="flex items-center bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg inline-block text-sm">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-teal-500" />
                  <span className="text-gray-700">
                    {job.show_salary && job.salary_display ? job.salary_display : "Tidak ditampilkan"}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-gray-50 p-3 md:p-4 rounded-lg h-fit">
              <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Lamar Sekarang</h3>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 mb-2 md:mb-3 text-sm md:text-base">Lamar Pekerjaan</Button>
              <Button variant="outline" className="w-full text-sm md:text-base">
                Simpan Lowongan
              </Button>
            </div>
          </div>

          {/* Company Information Section */}
          {job.company && (
            <div className="mb-4 md:mb-6 bg-gray-50 p-3 md:p-4 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
                <Info className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-500" />
                Tentang Perusahaan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                {job.company.location && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm md:text-base">Lokasi</p>
                      <p className="text-gray-600 text-sm md:text-base">{job.company.location}</p>
                    </div>
                  </div>
                )}

                {job.company.website && (
                  <div className="flex items-start">
                    <Globe className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm md:text-base">Website</p>
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm md:text-base"
                      >
                        {job.company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}

                {job.company.company_size && (
                  <div className="flex items-start">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm md:text-base">Ukuran Perusahaan</p>
                      <p className="text-gray-600 text-sm md:text-base">{job.company.company_size} karyawan</p>
                    </div>
                  </div>
                )}
              </div>

              {job.company.background && (
                <div className="mt-3 md:mt-4">
                  <p className="text-gray-700 text-sm md:text-base">{job.company.background}</p>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Deskripsi Pekerjaan</h3>
            <div className="prose prose-sm md:prose max-w-none">
              <p className="text-sm md:text-base">{job.description}</p>
            </div>
          </div>

          {job.requirements && (
            <div className="mt-4 md:mt-6">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Persyaratan</h3>
              <div className="prose prose-sm md:prose max-w-none">
                <p className="text-sm md:text-base">{job.requirements}</p>
              </div>
            </div>
          )}

          {job.responsibilities && (
            <div className="mt-4 md:mt-6">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Tanggung Jawab</h3>
              <div className="prose prose-sm md:prose max-w-none">
                <p className="text-sm md:text-base">{job.responsibilities}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
