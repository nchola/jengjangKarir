"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Search, MapPin, Briefcase, Tag, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { unsaveJob } from "@/lib/saved-jobs-actions"

interface SavedJobsListProps {
  savedJobs: any[]
}

export default function SavedJobsList({ savedJobs }: SavedJobsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [jobs, setJobs] = useState(savedJobs)

  const filteredJobs = jobs.filter(
    (item) =>
      item.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.job?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.job?.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUnsave = async (id: number, jobId: number) => {
    try {
      const result = await unsaveJob(jobId)

      if (result.success) {
        setJobs(jobs.filter((job) => job.id !== id))
        toast({
          title: "Berhasil",
          description: "Lowongan dihapus dari tersimpan",
        })
      } else {
        toast({
          title: "Gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error unsaving job:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Cari lowongan tersimpan..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Anda belum menyimpan lowongan pekerjaan</p>
          <Button asChild className="mt-4">
            <Link href="/jobs">Cari Lowongan</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:border-teal-200 transition-colors">
              <div className="flex items-start justify-between">
                <Link href={`/jobs/${item.job?.slug}`} className="flex items-start gap-3 flex-1">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={item.job?.company?.logo_url || "/placeholder.svg?height=48&width=48"}
                      alt={item.job?.company?.name || "Company"}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{item.job?.title || "Posisi tidak tersedia"}</h3>
                    <p className="text-sm text-gray-500">{item.job?.company?.name || "Perusahaan tidak tersedia"}</p>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-teal-500" />
                        <span>{item.job?.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1 text-teal-500" />
                        <span>{item.job?.job_type}</span>
                      </div>
                      {item.job?.category && (
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1 text-teal-500" />
                          <span>{item.job?.category?.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      Disimpan {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id })}
                    </div>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUnsave(item.id, item.job?.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Hapus dari tersimpan</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
