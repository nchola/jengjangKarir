"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCompany, updateCompany } from "@/lib/company-actions"
import { toast } from "@/components/ui/use-toast"
import type { Company } from "@/types/job"

interface CompanyFormProps {
  company?: Company
}

export default function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_url || null)
  const [resetLogo, setResetLogo] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Use controlled form state to ensure values are properly tracked
  const [formData, setFormData] = useState({
    name: company?.name || "",
    location: company?.location || "",
    website: company?.website || "",
    company_size: company?.company_size || "",
    background: company?.background || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
        setResetLogo(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetLogo = () => {
    setLogoPreview(null)
    setResetLogo(true)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama perusahaan wajib diisi"
    }

    // Optional validation for other fields if needed
    // if (!formData.website.trim()) {
    //   newErrors.website = "Website perusahaan wajib diisi"
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validasi gagal",
        description: "Silakan periksa kembali form Anda",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()

      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Add logo file if exists
      const logoInput = document.getElementById("logo") as HTMLInputElement
      if (logoInput && logoInput.files && logoInput.files[0]) {
        formDataObj.append("logo", logoInput.files[0])
      }

      // Add reset logo flag if needed
      if (resetLogo) {
        formDataObj.append("reset_logo", "true")
      }

      console.log("Form data being submitted:", Object.fromEntries(formDataObj.entries()))

      let result
      if (company) {
        result = await updateCompany(company.id, formDataObj)
      } else {
        result = await createCompany(formDataObj)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
            Nama Perusahaan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: Acme Corporation"
            required
            className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Lokasi</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Contoh: Jakarta, Indonesia"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className={errors.website ? "text-red-500" : ""}>
            Website Perusahaan
          </Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Contoh: https://www.acme.com"
            type="url"
            className={errors.website ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_size" className={errors.company_size ? "text-red-500" : ""}>
            Ukuran Perusahaan
          </Label>
          <Select
            name="company_size"
            value={formData.company_size}
            onValueChange={(value) => handleSelectChange("company_size", value)}
          >
            <SelectTrigger id="company_size" className={errors.company_size ? "border-red-500 focus:ring-red-500" : ""}>
              <SelectValue placeholder="Pilih ukuran perusahaan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 karyawan</SelectItem>
              <SelectItem value="11-50">11-50 karyawan</SelectItem>
              <SelectItem value="51-200">51-200 karyawan</SelectItem>
              <SelectItem value="201-500">201-500 karyawan</SelectItem>
              <SelectItem value="501-1000">501-1000 karyawan</SelectItem>
              <SelectItem value="1000+">1000+ karyawan</SelectItem>
            </SelectContent>
          </Select>
          {errors.company_size && <p className="text-sm text-red-500">{errors.company_size}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="background" className={errors.background ? "text-red-500" : ""}>
            Latar Belakang Perusahaan
          </Label>
          <Textarea
            id="background"
            name="background"
            value={formData.background}
            onChange={handleInputChange}
            placeholder="Deskripsi singkat tentang perusahaan, visi, misi, dan budaya kerja"
            rows={4}
            className={errors.background ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.background && <p className="text-sm text-red-500">{errors.background}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo">Logo Perusahaan</Label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {logoPreview && (
              <div className="relative h-20 w-20 border rounded-md overflow-hidden bg-gray-50">
                <Image src={logoPreview || "/placeholder.svg"} alt="Logo preview" fill className="object-contain p-2" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Upload logo perusahaan (format: JPG, PNG, SVG. Ukuran maksimal: 2MB)
              </p>
              {company?.logo_url && !resetLogo && (
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="reset_logo" checked={resetLogo} onCheckedChange={handleResetLogo} />
                  <Label htmlFor="reset_logo" className="text-sm">
                    Hapus logo
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 -mx-4 -mb-4 mt-8 flex gap-3 justify-end">
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
