"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Search, Filter, MoreHorizontal, Eye, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { deleteJob } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { useSupabase } from "@/components/supabase-provider"
import type { JobWithRelations } from "@/types/job"

export default function JobListingTable() {
  const [jobs, setJobs] = useState<JobWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = useSupabase()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching jobs...")

      // Check if Supabase URL and key are available
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Not available")
      console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Not available")

      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          company:companies(*),
          category:job_categories(*)
        `)
        .order("posted_at", { ascending: false })

      if (error) {
        console.error("Error fetching jobs:", error)
        setError(`Error: ${error.message}`)
        throw error
      }

      console.log("Jobs fetched:", data)
      setJobs(data || [])
    } catch (error: any) {
      console.error("Error fetching jobs:", error)
      setError(error?.message || "Failed to fetch jobs")
      toast({
        title: "Error",
        description: "Gagal memuat data lowongan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) {
      try {
        const result = await deleteJob(id)
        if (result.success) {
          setJobs(jobs.filter((job) => job.id !== id))
          toast({
            title: "Berhasil",
            description: result.message,
          })
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
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Kedaluwarsa</Badge>
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Cari lowongan..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={fetchJobs} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-2">Memuat data lowongan...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-8 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <div>
            <p className="font-semibold">Error loading data</p>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tanggal Posting</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2">Tidak ada data lowongan</p>
                      <p className="text-sm text-gray-500">
                        Silakan tambahkan lowongan baru atau periksa koneksi database
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company?.name || "-"}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.category?.name || "-"}</TableCell>
                    <TableCell>{formatDate(job.posted_at)}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/jobs/${job.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/jobs/${job.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(job.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
