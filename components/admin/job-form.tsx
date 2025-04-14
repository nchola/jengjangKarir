"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { createJob, updateJob } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import type { Job, JobCategory, Company } from "@/types/job"

interface JobFormProps {
  job?: Job
  categories: JobCategory[]
  companies: Company[]
}

export default function JobForm({ job, categories, companies }: JobFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const validateForm = (formData: FormData) => {
    const requiredFields = {
      title: "Judul Lowongan",
      company_id: "Perusahaan",
      location: "Lokasi",
      job_type: "Tipe Pekerjaan",
      description: "Deskripsi Pekerjaan",
    }

    const errors: string[] = []

    for (const [field, label] of Object.entries(requiredFields)) {
      const value = formData.get(field)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors.push(`${label} wajib diisi`)
      }
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const errors = validateForm(formData)

      if (errors.length > 0) {
        toast({
          title: "Validasi Gagal",
          description: errors.join("\n"),
          variant: "destructive",
        })
        return
      }

      let result
      if (job) {
        result = await updateJob(job.id, formData)
      } else {
        result = await createJob(formData)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        router.push("/admin/jobs")
        router.refresh()
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
          <TabsTrigger value="details">Detail Lowongan</TabsTrigger>
          <TabsTrigger value="publish">Publikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Lowongan</Label>
              <Input
                id="title"
                name="title"
                defaultValue={job?.title}
                placeholder="Contoh: Senior Frontend Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_id">Perusahaan</Label>
              <Select name="company_id" defaultValue={job?.company_id?.toString()}>
                <SelectTrigger id="company_id">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                name="location"
                defaultValue={job?.location}
                placeholder="Contoh: Jakarta, Remote"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_type">Tipe Pekerjaan</Label>
              <Select name="job_type" defaultValue={job?.job_type || "full-time"}>
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
              <Label htmlFor="salary_display">Gaji</Label>
              <Input
                id="salary_display"
                name="salary_display"
                defaultValue={job?.salary_display || ""}
                placeholder="Contoh: Rp 10-15 juta/bulan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Kategori</Label>
              <Select name="category_id" defaultValue={job?.category_id?.toString() || ""}>
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
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Pekerjaan</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={job?.description || ""}
              placeholder="Deskripsi detail tentang posisi pekerjaan"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Persyaratan</Label>
            <Textarea
              id="requirements"
              name="requirements"
              defaultValue={job?.requirements || ""}
              placeholder="Daftar persyaratan untuk posisi ini (satu per baris)"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Tanggung Jawab</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              defaultValue={job?.responsibilities || ""}
              placeholder="Daftar tanggung jawab untuk posisi ini (satu per baris)"
              rows={5}
            />
          </div>
        </TabsContent>

        <TabsContent value="publish" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" name="is_featured" defaultChecked={job?.is_featured} />
            <Label htmlFor="is_featured">Tampilkan sebagai lowongan unggulan</Label>
          </div>

          {job && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={job.status}>
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

      <div className="mt-8 flex justify-end gap-3">
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
