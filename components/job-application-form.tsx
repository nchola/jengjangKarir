"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { submitJobApplication } from "@/lib/application-actions"
import { getCurrentUser } from "@/lib/user-actions"
import { useEffect } from "react"

// Form validation schema
const applicationSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  coverLetter: z.string().min(50, "Cover letter minimal 50 karakter"),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

interface JobApplicationFormProps {
  jobId: number
  jobTitle: string
  companyName: string
}

export default function JobApplicationForm({ jobId, jobTitle, companyName }: JobApplicationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
    },
  })

  // Load user data if logged in
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
        form.setValue("fullName", user.full_name)
        form.setValue("email", user.email)
        if (user.phone) form.setValue("phone", user.phone)
      }
    }

    loadUser()
  }, [form])

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!resumeFile && !currentUser?.resume_url) {
      toast({
        title: "Resume diperlukan",
        description: "Silakan unggah resume Anda",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("jobId", jobId.toString())
      formData.append("fullName", data.fullName)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("coverLetter", data.coverLetter)

      if (resumeFile) {
        formData.append("resume", resumeFile)
      }

      const result = await submitJobApplication(formData)

      if (result.success) {
        toast({
          title: "Lamaran berhasil dikirim",
          description: "Kami akan menghubungi Anda jika ada perkembangan",
        })
        router.push("/dashboard/applications")
      } else {
        toast({
          title: "Gagal mengirim lamaran",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Application submission error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Lamar Pekerjaan</h2>
        <p className="text-gray-500">
          Anda melamar posisi <span className="font-medium">{jobTitle}</span> di{" "}
          <span className="font-medium">{companyName}</span>
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            placeholder="Masukkan nama lengkap"
            {...form.register("fullName")}
            disabled={isLoading}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@example.com"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input id="phone" placeholder="08xxxxxxxxxx" {...form.register("phone")} disabled={isLoading} />
          {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume</Label>
          {currentUser?.resume_url ? (
            <div className="flex items-center justify-between p-2 border rounded-md">
              <span className="text-sm truncate">Resume tersedia dari profil Anda</span>
              <a
                href={currentUser.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Lihat
              </a>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              disabled={isLoading}
            />
            {resumeFile && (
              <Button type="button" variant="outline" size="sm" onClick={() => setResumeFile(null)}>
                Reset
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">Format yang diterima: PDF, DOC, DOCX. Maksimal 5MB.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverLetter">Cover Letter</Label>
          <Textarea
            id="coverLetter"
            placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan mengapa Anda cocok untuk peran ini"
            rows={6}
            {...form.register("coverLetter")}
            disabled={isLoading}
          />
          {form.formState.errors.coverLetter && (
            <p className="text-sm text-red-500">{form.formState.errors.coverLetter.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Kirim Lamaran
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
