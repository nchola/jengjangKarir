"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Search, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ApplicationListProps {
  applications: any[]
}

export default function ApplicationList({ applications }: ApplicationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Ditinjau
          </Badge>
        )
      case "shortlisted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Shortlist
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredApplications = applications.filter(
    (app) =>
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Cari lamaran..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Anda belum memiliki lamaran pekerjaan</p>
          <Button asChild className="mt-4">
            <Link href="/jobs">Cari Lowongan</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4 hover:border-teal-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={application.job?.company?.logo_url || "/placeholder.svg?height=48&width=48"}
                      alt={application.job?.company?.name || "Company"}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{application.job?.title || "Posisi tidak tersedia"}</h3>
                    <p className="text-sm text-gray-500">
                      {application.job?.company?.name || "Perusahaan tidak tersedia"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(application.status)}
                      <span className="text-xs text-gray-500">
                        Dilamar {formatDistanceToNow(new Date(application.created_at), { addSuffix: true, locale: id })}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/applications/${application.id}`}>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
