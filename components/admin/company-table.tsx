"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Search, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { Company } from "@/types/job"
import { deleteCompany } from "@/lib/company-actions" // Fixed import path

export default function CompanyTable() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    title: string
    message: string
  } | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      console.log("Fetching companies...")
      const { data, error } = await supabase.from("companies").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching companies:", error)
        throw error
      }

      console.log("Companies fetched:", data)
      setCompanies(data || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data perusahaan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus perusahaan ini? Jika perusahaan memiliki lowongan terkait, penghapusan akan gagal.",
      )
    ) {
      try {
        const result = await deleteCompany(id)

        if (result.success) {
          setCompanies(companies.filter((company) => company.id !== id))

          // Show success notification
          setNotification({
            type: "success",
            title: "Perusahaan Berhasil Dihapus",
            message: result.message,
          })

          // Auto-dismiss after 5 seconds
          setTimeout(() => setNotification(null), 5000)

          toast({
            title: "Berhasil",
            description: result.message,
          })
        } else {
          // Show error notification
          setNotification({
            type: "error",
            title: "Gagal Menghapus Perusahaan",
            message: result.message,
          })

          toast({
            title: "Gagal",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting company:", error)

        // Show error notification
        setNotification({
          type: "error",
          title: "Gagal Menghapus Perusahaan",
          message: "Terjadi kesalahan saat menghapus perusahaan. Silakan coba lagi.",
        })

        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus perusahaan",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div>
      {notification && (
        <Alert
          className={`mb-4 ${notification.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          variant="default"
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
            {notification.title}
          </AlertTitle>
          <AlertDescription className={notification.type === "success" ? "text-green-700" : "text-red-700"}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Cari perusahaan..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchCompanies} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-2">Memuat data perusahaan...</span>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Tidak ada data perusahaan
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      {company.logo_url ? (
                        <Image
                          src={company.logo_url || "/placeholder.svg"}
                          alt={company.name}
                          width={40}
                          height={40}
                          className="rounded-md object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.location || "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/companies/${company.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(company.id)}>
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
