"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory, updateCategory } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import type { JobCategory } from "@/types/job"
import { Loader2 } from "lucide-react"

interface CategoryFormProps {
  category?: JobCategory
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string>(category?.icon || "🔍")
  const [formData, setFormData] = useState({
    name: category?.name || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const icons = [
    "💻",
    "💰",
    "📊",
    "🎨",
    "📚",
    "🏥",
    "🛒",
    "📝",
    "📱",
    "🏨",
    "🍔",
    "✈️",
    "🏭",
    "🏢",
    "🔧",
    "📈",
    "🎓",
    "🎭",
    "🚗",
    "⚙️",
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Validasi gagal",
        description: "Nama kategori wajib diisi",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("icon", selectedIcon)

      let result
      if (category) {
        result = await updateCategory(category.id, formDataObj)
      } else {
        result = await createCategory(formDataObj)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        router.push("/admin/categories")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Kategori</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nama kategori"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-10 gap-2">
          {icons.map((icon) => (
            <Button
              key={icon}
              type="button"
              variant="outline"
              className={`text-2xl h-12 ${selectedIcon === icon ? "border-teal-500 bg-teal-50" : ""}`}
              onClick={() => setSelectedIcon(icon)}
            >
              {icon}
            </Button>
          ))}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Icon terpilih: <span className="text-2xl">{selectedIcon}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-teal-500 hover:bg-teal-600">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {category ? "Menyimpan..." : "Membuat..."}
            </>
          ) : category ? (
            "Update Kategori"
          ) : (
            "Simpan Kategori"
          )}
        </Button>
      </div>
    </form>
  )
}
