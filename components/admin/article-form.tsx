"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createArticle, updateArticle } from "@/lib/article-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Article } from "@/types/article"
import Image from "next/image"
import { Loader2, X, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

interface ArticleFormProps {
  article?: Article
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [imagePreview, setImagePreview] = useState<string | null>(article?.image || article?.image_url || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [resetImage, setResetImage] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    title: string
    message: string
  } | null>(null)

  // Form data state
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    author: article?.author || "",
    published: article?.published || false,
    featured: article?.featured || false,
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setResetImage(false)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image reset
  const handleImageReset = () => {
    setImagePreview(null)
    setImageFile(null)
    setResetImage(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title || !formData.content) {
      setNotification({
        type: "error",
        title: "Validasi Gagal",
        message: "Judul dan konten artikel wajib diisi.",
      })

      setTimeout(() => setNotification(null), 5000)

      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Add image if selected
      if (imageFile) {
        formDataObj.append("image", imageFile)
      }

      // Add reset image flag
      formDataObj.append("reset_image", resetImage.toString())

      let result
      if (article) {
        result = await updateArticle(article.id, formDataObj)
      } else {
        result = await createArticle(formDataObj)
      }

      if (result.success) {
        setNotification({
          type: "success",
          title: "Berhasil",
          message: result.message,
        })

        setTimeout(() => {
          router.push("/admin/articles")
        }, 2000)
      } else {
        setNotification({
          type: "error",
          title: "Gagal",
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setNotification({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menyimpan data",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {notification && (
        <Alert
          className={`mb-6 ${notification.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
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
            <div className="flex items-center gap-2">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleImageReset}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

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
