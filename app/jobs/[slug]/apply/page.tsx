import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import JobApplicationForm from "@/components/job-application-form"
import { getJobBySlug } from "@/lib/job-actions"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Lamar Pekerjaan - JenjangKarir",
  description: "Lamar pekerjaan di JenjangKarir",
}

export default async function ApplyJobPage({
  params,
}: {
  params: { slug: string }
}) {
  const job = await getJobBySlug(params.slug)

  if (!job) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/jobs/${params.slug}`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Kembali ke Detail Lowongan
            </Link>
          </Button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <JobApplicationForm jobId={job.id} jobTitle={job.title} companyName={job.company.name} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
