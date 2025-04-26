import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Suspense, lazy } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  BookmarkPlus,
  Share2,
  CheckCircle2,
  Mail
} from "lucide-react"
import { getJobBySlug, getJobsByCategory } from "@/lib/job-actions"
import { formatDate } from "@/lib/utils"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

// Lazy load non-critical components
const ServiceBanner = lazy(() => import("@/components/ServiceBanner"))

// Loading skeleton for job details
function JobDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-xl p-6">
        <div className="flex gap-6">
          <div className="h-48 w-48 bg-gray-200 rounded-xl" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Detail Lowongan | JenjangKarir",
  description: "Informasi detail lowongan kerja",
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug)

  if (!job) {
    notFound()
  }

  // Fetch related jobs in parallel with job details
  const relatedJobsPromise = job.category ? getJobsByCategory(job.category.slug) : Promise.resolve([])
  const relatedJobs = await relatedJobsPromise
  const filteredRelatedJobs = relatedJobs
    .filter(relatedJob => relatedJob.id !== job.id)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<JobDetailSkeleton />}>
              {/* Header Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
                  <div className="relative h-48 w-48 flex-shrink-0 mx-auto md:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl"></div>
                    <Image
                      src={job.company.logo_url || "/placeholder.svg"}
                      alt={`${job.company.name} logo`}
                      fill
                      className="object-contain p-4"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-xl text-gray-600 mb-3">{job.company.name}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                        {job.job_type}
                      </Badge>
                      {job.category && (
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                          {job.category.name}
                        </Badge>
                      )}
                      {job.is_remote && (
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                          Remote
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{job.location}</span>
                  </div>
                  {job.show_salary && job.salary_display && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{job.salary_display}</span>
                    </div>
                  )}
                  {job.company.company_size && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{job.company.company_size} karyawan</span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Batas: {formatDate(job.deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Diposting {formatDate(job.posted_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookmarkPlus className="h-4 w-4" />
                      Simpan
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </div>

              {/* Service Banner - Lazy loaded */}
              <Suspense fallback={<div className="h-[200px] bg-gray-100 rounded-xl animate-pulse" />}>
                <ServiceBanner />
              </Suspense>

              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi Pekerjaan</h2>
                <div className="prose prose-gray max-w-none">
                  <p>{job.description}</p>
                  
                  {job.responsibilities && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">Tanggung Jawab:</h3>
                      <ul className="space-y-2">
                        {job.responsibilities.split('\n').map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {job.requirements && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">Kualifikasi:</h3>
                      <ul className="space-y-2">
                        {job.requirements.split('\n').map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            <Suspense fallback={<div className="h-[200px] bg-gray-100 rounded-xl animate-pulse" />}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lamar Sekarang</h2>
                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
                    Lamar Pekerjaan
                  </Button>
                  {job.company.email && (
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">atau kirim CV ke:</span>
                      </div>
                      <a 
                        href={`mailto:${job.company.email}`}
                        className="font-medium text-gray-900 hover:text-teal-600 transition-colors"
                      >
                        {job.company.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Suspense>

            {/* Company Card */}
            <Suspense fallback={<div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />}>
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tentang Perusahaan</h2>
                {job.company.background && (
                  <p className="text-sm text-gray-600 mb-4">{job.company.background}</p>
                )}
                <div className="space-y-3">
                  {job.company.industry && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{job.company.industry}</span>
                    </div>
                  )}
                  {job.company.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{job.company.location}</span>
                    </div>
                  )}
                  {job.company.company_size && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{job.company.company_size} karyawan</span>
                    </div>
                  )}
                </div>
                {job.company.website && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/companies/${job.company.slug}`}>
                      Profil Perusahaan
                    </Link>
                  </Button>
                )}
              </div>
            </Suspense>

            {/* Related Jobs Card */}
            {filteredRelatedJobs.length > 0 && (
              <Suspense fallback={<div className="h-[400px] bg-gray-100 rounded-xl animate-pulse" />}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Lowongan Serupa</h2>
                  <div className="space-y-4">
                    {filteredRelatedJobs.map((relatedJob) => (
                      <a 
                        key={relatedJob.id}
                        href={`/jobs/${relatedJob.slug}`}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"></div>
                          <Image 
                            src={relatedJob.company.logo_url || "/placeholder.svg"}
                            alt={`${relatedJob.company.name} logo`}
                            className="absolute inset-0 w-full h-full object-contain p-3"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-base mb-1">{relatedJob.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{relatedJob.company.name}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="text-sm">
                              {relatedJob.job_type}
                            </Badge>
                            <span className="text-sm text-gray-500">{relatedJob.location}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Suspense>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
