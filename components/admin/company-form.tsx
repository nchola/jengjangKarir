"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCompany } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import type { Company } from "@/types/job"

interface CompanyFormProps {
  company?: Company
}

export default function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_url || null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      let result
      if (company) {
        // Implementasi update company jika diperlukan
      } else {
        result = await createCompany(formData)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        router.push("/admin/companies")
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
        <Label htmlFor="name">Nama Perusahaan</Label>
        <Input id="name" name="name" defaultValue={company?.name} placeholder="Nama perusahaan" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lokasi</Label>
        <Input id="location" name="location" defaultValue={company?.location || ""} placeholder="Lokasi perusahaan" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo Perusahaan</Label>
        <Input id="logo" name="logo" type="file" accept="image/*" onChange={handleLogoChange} />

        {logoPreview && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <img
              src={logoPreview || "/placeholder.svg"}
              alt="Logo preview"
              className="w-32 h-32 object-contain border rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-teal-500 hover:bg-teal-600">
          {isSubmitting ? "Menyimpan..." : company ? "Update Perusahaan" : "Simpan Perusahaan"}
        </Button>
      </div>
    </form>
  )
}
