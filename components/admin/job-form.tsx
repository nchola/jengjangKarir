"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { createJob, updateJob } from "@/lib/job-actions"
import { getCompanyById } from "@/lib/company-actions"
import { toast } from "@/components/ui/use-toast"
import type { Job, JobCategory, Company } from "@/types/job"
import { Globe, Users } from "lucide-react"

interface JobFormProps {
  job?: Job
  categories: JobCategory[]
  companies: Company[]
}

export default function JobForm({ job, categories, companies }: JobFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form data state to keep track of all fields across tabs
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company_id: job?.company_id?.toString() || "",
    location: job?.location || "",
    job_type: job?.job_type || "full-time",
    salary_display: job?.salary_display || "",
    show_salary: job?.show_salary !== undefined ? job?.show_salary : true, // Default to true for new jobs
    category_id: job?.category_id?.toString() || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    responsibilities: job?.responsibilities || "",
    is_featured: job?.is_featured || false,
    status: job?.status || "active",
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Fetch company details when company is selected
    if (name === "company_id" && value) {
      fetchCompanyDetails(Number.parseInt(value))
    }
  }

  // Fetch company details when company is selected
  const fetchCompanyDetails = async (companyId: number) => {
    try {
      const company = await getCompanyById(companyId)
      if (company) {
        setSelectedCompany(company)
        console.log("Fetched company details:", company)
      }
    } catch (error) {
      console.error("Error fetching company details:", error)
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Judul lowongan wajib diisi"
    }

    if (!formData.company_id) {
      newErrors.company_id = "Perusahaan wajib dipilih"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi wajib diisi"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Load company details when editing a job
  useEffect(() => {
    if (job && job.company_id) {
      fetchCompanyDetails(job.company_id)
    }
  }, [job])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      // Find which tab has errors
      const tabWithErrors = Object.keys(errors).some((field) =>
        ["title", "company_id", "location", "job_type"].includes(field),
      )
        ? "basic"
        : Object.keys(errors).some((field) => ["description", "requirements", "responsibilities"].includes(field))
          ? "details"
          : "publish"

      // Switch to tab with errors
      setActiveTab(tabWithErrors)

      toast({
        title: "Validasi gagal",
        description: "Semua field wajib diisi. Periksa semua tab form.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()

      // Add all form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            // Handle checkbox values
            formDataObj.append(key, value ? "on" : "off")
          } else {
            formDataObj.append(key, value.toString())
          }
        }
      })

      let result
      if (job) {
        result = await updateJob(job.id, formDataObj)
      } else {
        result = await createJob(formDataObj)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        router.push("/admin/jobs")
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
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="mb-6 w-full sm:w-auto inline-flex">
            <TabsTrigger value="basic" className="text-sm">
              Informasi Dasar
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm">
              Detail Lowongan
            </TabsTrigger>
            <TabsTrigger value="publish" className="text-sm">
              Publikasi
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
                Judul Lowongan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Contoh: Senior Frontend Developer"
                required
                className={errors.title ? "border-red-500 focus:ring-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_id" className={errors.company_id ? "text-red-500" : ""}>
                Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Select
                name="company_id"
                value={formData.company_id}
                onValueChange={(value) => handleSelectChange("company_id", value)}
              >
                <SelectTrigger id="company_id" className={errors.company_id ? "border-red-500 focus:ring-red-500" : ""}>
                  <SelectValue placeholder="Pilih perusahaan" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className={errors.location ? "text-red-500" : ""}>
                Lokasi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Contoh: Jakarta, Remote"
                required
                className={errors.location ? "border-red-500 focus:ring-red-500" : ""}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_type">
                Tipe Pekerjaan <span className="text-red-500">*</span>
              </Label>
              <Select
                name="job_type"
                value={formData.job_type}
                onValueChange={(value) => handleSelectChange("job_type", value)}
              >
                <SelectTrigger id="job_type">
                  <SelectValue placeholder="Pilih tipe pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Kategori</Label>
              <Select
                name="category_id"
                value={formData.category_id}
                onValueChange={(value) => handleSelectChange("category_id", value)}
              >
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Salary section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_salary"
                  checked={formData.show_salary}
                  onCheckedChange={(checked) => handleCheckboxChange("show_salary", checked as boolean)}
                />
                <Label htmlFor="show_salary" className="text-sm">
                  Tampilkan informasi gaji
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_display">Informasi Gaji</Label>
                <Input
                  id="salary_display"
                  name="salary_display"
                  value={formData.salary_display}
                  onChange={handleInputChange}
                  placeholder="Contoh: Rp 10-15 juta/bulan"
                />
                <p className="text-xs text-gray-500">
                  Masukkan informasi gaji dalam format yang mudah dibaca, misalnya &quot;Rp 10-15 juta/bulan&quot;
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Company Information */}
          {selectedCompany && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Informasi Perusahaan</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Nama:</strong> {selectedCompany.name}
                </p>
                <p>
                  <strong>Lokasi:</strong> {selectedCompany.location || "-"}
                </p>
                {selectedCompany.website && (
                  <div className="flex items-start">
                    <Globe className="h-4 w-4 mr-2 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedCompany.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
                {selectedCompany.company_size && (
                  <div className="flex items-start">
                    <Users className="h-4 w-4 mr-2 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Ukuran Perusahaan</p>
                      <p className="text-gray-600">{selectedCompany.company_size} karyawan</p>
                    </div>
                  </div>
                )}
                {selectedCompany.background && (
                  <div className="mt-4">
                    <p className="font-medium">Latar Belakang:</p>
                    <p className="text-gray-600">{selectedCompany.background}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
              Deskripsi Pekerjaan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Deskripsi detail tentang posisi pekerjaan"
              rows={5}
              required
              className={`min-h-[120px] ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Persyaratan</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Daftar persyaratan untuk posisi ini (satu per baris)"
              rows={5}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Tanggung Jawab</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              placeholder="Daftar tanggung jawab untuk posisi ini (satu per baris)"
              rows={5}
              className="min-h-[120px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="publish" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
            />
            <Label htmlFor="is_featured" className="text-sm">
              Tampilkan sebagai lowongan unggulan
            </Label>
          </div>

          {job && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="expired">Kedaluwarsa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 -mx-4 -mb-4 mt-8 flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-teal-500 hover:bg-teal-600">
          {isSubmitting ? "Menyimpan..." : job ? "Update Lowongan" : "Simpan Lowongan"}
        </Button>
      </div>
    </form>
  )
}
