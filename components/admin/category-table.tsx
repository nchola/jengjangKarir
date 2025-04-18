"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Search, MoreHorizontal, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { JobCategory } from "@/types/job"
import { deleteCategory } from "@/lib/category-actions"

export default function CategoryTable() {
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    title: string
    message: string
  } | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      console.log("Fetching categories...")
      const { data, error } = await supabase.from("job_categories").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
        throw error
      }

      console.log("Categories fetched:", data)
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data kategori. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Jika kategori memiliki lowongan terkait, penghapusan akan gagal.",
      )
    ) {
      try {
        const result = await deleteCategory(id)

        if (result.success) {
          setCategories(categories.filter((category) => category.id !== id))

          // Show success notification
          setNotification({
            type: "success",
            title: "Kategori Berhasil Dihapus",
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
            title: "Gagal Menghapus Kategori",
            message: result.message,
          })

          toast({
            title: "Gagal",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting category:", error)

        // Show error notification
        setNotification({
          type: "error",
          title: "Gagal Menghapus Kategori",
          message: "Terjadi kesalahan saat menghapus kategori. Silakan coba lagi.",
        })

        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus kategori",
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
            placeholder="Cari kategori..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchCategories} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-2">Memuat data kategori...</span>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Jumlah Lowongan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Tidak ada data kategori
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="text-2xl">{category.icon || "🔍"}</div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.job_count}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(category.id)}>
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
