"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Search, MoreHorizontal, Eye, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { deleteArticle } from "@/lib/article-actions"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import type { Article } from "@/types/article"

export default function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    title: string
    message: string
  } | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching articles...")

      const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching articles:", error)

        // Check if the error is because the table doesn't exist
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          console.log("Articles table doesn't exist, falling back to mock data")
          // Import mock articles data
          const { getMockArticles } = await import("@/lib/mock-data")
          const mockArticles = getMockArticles()
          setArticles(mockArticles)
          return
        }

        setError(`Error: ${error.message}`)
        throw error
      }

      console.log("Articles fetched:", data)
      setArticles(data || [])
    } catch (error: any) {
      console.error("Error fetching articles:", error)
      setError(error?.message || "Failed to fetch articles")

      // Fall back to mock data in case of any error
      try {
        const { getMockArticles } = await import("@/lib/mock-data")
        const mockArticles = getMockArticles()
        setArticles(mockArticles)
        toast({
          title: "Using mock data",
          description: "Couldn't connect to the database. Using mock data instead.",
          variant: "default",
        })
      } catch (mockError) {
        toast({
          title: "Error",
          description: "Failed to load articles data. Please try again later.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const title = article.title?.toLowerCase() || ""
    const category = typeof article.category === "string" ? article.category.toLowerCase() : ""
    const author = article.author?.toLowerCase() || ""
    const query = searchQuery.toLowerCase()

    return title.includes(query) || category.includes(query) || author.includes(query)
  })

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        const result = await deleteArticle(id)
        if (result.success) {
          setArticles(articles.filter((article) => article.id !== id))

          // Show success notification
          setNotification({
            type: "success",
            title: "Artikel Berhasil Dihapus",
            message: "Data artikel telah berhasil dihapus dari sistem.",
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
            title: "Gagal Menghapus Artikel",
            message: result.message || "Terjadi kesalahan saat menghapus artikel. Silakan coba lagi.",
          })

          toast({
            title: "Gagal",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting article:", error)

        // Show error notification
        setNotification({
          type: "error",
          title: "Error",
          message: "Terjadi kesalahan saat menghapus artikel",
        })

        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus artikel",
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
            placeholder="Cari artikel..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchArticles} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-2">Memuat data artikel...</span>
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
                <TableHead>Gambar</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2">Tidak ada data artikel</p>
                      <p className="text-sm text-gray-500">
                        Silakan tambahkan artikel baru atau periksa koneksi database
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="relative w-16 h-12 rounded-md overflow-hidden">
                        <Image
                          src={article.image_url || article.image || "/placeholder.svg?height=48&width=64"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                    <TableCell>{typeof article.category === "string" ? article.category : "-"}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      {new Date(article.published_at || article.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {article.is_published || article.published ? (
                        <Badge className="bg-green-100 text-green-800">Dipublikasikan</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/articles/${article.slug}`} target="_blank">
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/articles/${article.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(article.id)}>
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
