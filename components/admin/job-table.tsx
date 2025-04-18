"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { deleteJob } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import type { JobWithRelations } from "@/types/job"

interface JobTableProps {
  jobs: JobWithRelations[]
}

export default function JobTable({ jobs }: JobTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [jobToDelete, setJobToDelete] = useState<JobWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const itemsPerPage = 10
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = async () => {
    if (!jobToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteJob(jobToDelete.id)
      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        router.refresh()
      } else {
        toast({
          title: "Gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus lowongan",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setJobToDelete(null)
    }
  }

  return (
    <div>
      <div className="p-4 border-b admin-mobile-container">
        <Input
          placeholder="Cari lowongan..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm admin-mobile-input"
          prefix={<Search className="h-4 w-4 text-gray-400 admin-mobile-icon" />}
        />
      </div>

      {paginatedJobs.length === 0 ? (
        <div className="p-8 text-center admin-mobile-container">
          <p className="text-gray-500 admin-mobile-text">Tidak ada lowongan yang ditemukan</p>
        </div>
      ) : (
        <>
          {/* Mobile view - card layout */}
          <div className="md:hidden divide-y">
            {paginatedJobs.map((job) => (
              <div key={job.id} className="p-4 space-y-3 admin-mobile-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium admin-mobile-subheading">{job.title}</h3>
                    <p className="text-sm text-gray-500 admin-mobile-text">{job.company.name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="admin-mobile-button">
                        <MoreHorizontal className="h-4 w-4 admin-mobile-icon" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/jobs/edit/${job.id}`} className="admin-mobile-text">
                          <Edit className="h-4 w-4 mr-2 admin-mobile-icon" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 admin-mobile-text"
                        onClick={() => setJobToDelete(job)}
                      >
                        <Trash2 className="h-4 w-4 mr-2 admin-mobile-icon" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-2 text-xs admin-mobile-spacing">
                  <Badge variant={job.status === "active" ? "success" : "secondary"} className="admin-mobile-text">
                    {job.status === "active" ? "Aktif" : "Kedaluwarsa"}
                  </Badge>
                  {job.is_featured && (
                    <Badge variant="outline" className="admin-mobile-text">
                      Unggulan
                    </Badge>
                  )}
                  <span className="text-gray-500 admin-mobile-text">Diposting: {formatDate(job.posted_at)}</span>
                </div>

                <div className="flex gap-2 mt-2 admin-mobile-spacing">
                  <Button asChild size="sm" variant="outline" className="text-xs h-8 admin-mobile-button">
                    <Link href={`/jobs/${job.slug}`}>Lihat</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs h-8 admin-mobile-button">
                    <Link href={`/admin/jobs/edit/${job.id}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - table layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Judul</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Perusahaan</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Lokasi</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Tanggal</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{job.title}</div>
                      {job.is_featured && (
                        <Badge variant="outline" className="mt-1">
                          Unggulan
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{job.company.name}</td>
                    <td className="px-4 py-3">{job.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={job.status === "active" ? "success" : "secondary"}>
                        {job.status === "active" ? "Aktif" : "Kedaluwarsa"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(job.posted_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/jobs/${job.slug}`}>Lihat</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/jobs/edit/${job.id}`}>Edit</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setJobToDelete(job)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex justify-between items-center admin-mobile-container">
          <div className="text-sm text-gray-500 admin-mobile-text">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredJobs.length)} dari{" "}
            {filteredJobs.length} lowongan
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="admin-mobile-button"
            >
              <ChevronLeft className="h-4 w-4 admin-mobile-icon" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="hidden sm:inline-flex admin-mobile-button"
              >
                {page}
              </Button>
            ))}
            <span className="flex items-center px-2 sm:hidden admin-mobile-text">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="admin-mobile-button"
            >
              <ChevronRight className="h-4 w-4 admin-mobile-icon" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!jobToDelete}>
        <AlertDialogContent className="admin-mobile-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="admin-mobile-heading">Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription className="admin-mobile-text">
              Apakah Anda yakin ingin menghapus lowongan "{jobToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setJobToDelete(null)} className="admin-mobile-button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 admin-mobile-button"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
