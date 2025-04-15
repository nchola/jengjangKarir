"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createArticle, updateArticle } from "@/lib/article-actions"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Article } from "@/types/article"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface ArticleFormProps {
  article?: Article
  categories?: string[]
}

export default function ArticleForm({ article, categories = [] }: ArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [imagePreview, setImagePreview] = useState<string | null>(article?.image || null)

  // Form data state
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    category: article?.category || "",
    author: article?.author || "",
    published: article?.published || false,
    featured: article?.featured || false,
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title || !formData.content) {
      toast({
        title: "Validasi gagal",
        description: "Judul dan konten artikel wajib diisi.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData(e.currentTarget)

      let result
      if (article) {
        result = await updateArticle(article.id, formDataObj)
      } else {
        result = await createArticle(formDataObj)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        router.push("/admin/articles")
      } else {
        toast({
          title: "Gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="publish">Publikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Judul artikel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Ringkasan singkat artikel (akan ditampilkan di halaman daftar artikel)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <div className="flex gap-2">
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Kategori artikel"
                list="category-options"
                className="flex-1"
              />
              <datalist id="category-options">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            <p className="text-sm text-gray-500">Pilih dari kategori yang ada atau ketik kategori baru</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Penulis</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Nama penulis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Gambar Artikel</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />

            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div className="relative w-full h-48 border rounded-md overflow-hidden">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Konten Artikel</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Konten artikel (mendukung format Markdown)"
              rows={20}
              required
            />
            <p className="text-sm text-gray-500">Gunakan format Markdown untuk styling konten artikel</p>
          </div>
        </TabsContent>

        <TabsContent value="publish" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              name="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleCheckboxChange("published", checked as boolean)}
            />
            <Label htmlFor="published">Publikasikan artikel</Label>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Artikel yang tidak dipublikasikan tidak akan ditampilkan di halaman publik
          </p>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="featured"
              name="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
            />
            <Label htmlFor="featured">Jadikan artikel unggulan</Label>
          </div>
          <p className="text-sm text-gray-500 ml-6">Artikel unggulan akan ditampilkan di bagian atas halaman utama</p>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-teal-500 hover:bg-teal-600">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {article ? "Menyimpan..." : "Membuat..."}
            </>
          ) : article ? (
            "Update Artikel"
          ) : (
            "Simpan Artikel"
          )}
        </Button>
      </div>
    </form>
  )
}
