import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ChevronLeft, MapPin, Briefcase, Calendar, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getApplicationDetails } from "@/lib/application-actions"

export const metadata: Metadata = {
  title: "Detail Lamaran - JenjangKarir",
  description: "Detail lamaran pekerjaan",
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const applicationId = Number.parseInt(params.id)
  const application = await getApplicationDetails(applicationId)

  if (!application) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-800">Ditinjau</Badge>
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800">Shortlist</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/applications">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>

        <div>{getStatusBadge(application.status)}</div>
      </div>

      <div className="border-b pb-6">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={application.job?.company?.logo_url || "/placeholder.svg?height=64&width=64"}
              alt={application.job?.company?.name || "Company"}
              fill
              className="object-contain rounded-md"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{application.job?.title}</h1>
            <p className="text-gray-600">{application.job?.company?.name}</p>

            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-teal-500" />
                <span>{application.job?.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1 text-teal-500" />
                <span>{application.job?.job_type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-teal-500" />
                <span>Dilamar pada {format(new Date(application.created_at), "dd MMMM yyyy", { locale: id })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Informasi Lamaran</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-medium">{application.full_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{application.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nomor Telepon</p>
              <p className="font-medium">{application.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Resume</p>
              {application.resume_url ? (
                <Button variant="outline" size="sm" asChild className="mt-1">
                  <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Resume
                  </a>
                </Button>
              ) : (
                <p className="text-gray-500">Tidak tersedia</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Cover Letter</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="whitespace-pre-line">{application.cover_letter}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">Deskripsi Pekerjaan</h2>
        <p className="whitespace-pre-line">{application.job?.description}</p>

        <Button variant="outline" asChild className="mt-4">
          <Link href={`/jobs/${application.job?.slug}`} target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            Lihat Detail Lowongan
          </Link>
        </Button>
      </div>
    </div>
  )
}
