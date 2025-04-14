import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Clock, Briefcase, Building, Tag } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getJobBySlug } from "@/lib/actions"
import { formatDate } from "@/lib/utils"

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug)

  if (!job) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
          <div className="flex items-center text-white/80">
            <Building className="h-4 w-4 mr-1" />
            <span>{job.company.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg"></div>
                  <Image
                    src={job.company.logo_url || "/placeholder.svg?height=64&width=64"}
                    alt={`${job.company.name} logo`}
                    fill
                    className="object-contain p-2 rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{job.company.name}</h2>
                  <p className="text-gray-600">{job.company.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <Briefcase className="h-4 w-4 mr-2 text-teal-500" />
                  <span>{job.job_type}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 mr-2 text-teal-500" />
                  <span>Diposting {formatDate(job.posted_at)}</span>
                </div>
                {job.category && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Tag className="h-4 w-4 mr-2 text-teal-500" />
                    <span>{job.category.name}</span>
                  </div>
                )}
              </div>

              {job.salary_display && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Gaji</h3>
                  <p className="text-teal-600 font-medium">{job.salary_display}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Lamar Sekarang</h3>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 mb-3">Lamar Pekerjaan</Button>
              <Button variant="outline" className="w-full">
                Simpan Lowongan
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Deskripsi Pekerjaan</h3>
            <div className="prose max-w-none">
              <p>{job.description}</p>
            </div>
          </div>

          {job.requirements && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Persyaratan</h3>
              <div className="prose max-w-none">
                <p>{job.requirements}</p>
              </div>
            </div>
          )}

          {job.responsibilities && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Tanggung Jawab</h3>
              <div className="prose max-w-none">
                <p>{job.responsibilities}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
