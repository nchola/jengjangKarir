"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { updateUserProfile } from "@/lib/user-actions"

// Form validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  phone: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: any
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user?.profile_image_url || null)
  const [resume, setResume] = useState<File | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || "",
      phone: user?.phone || "",
      headline: user?.headline || "",
      bio: user?.bio || "",
      location: user?.location || "",
    },
  })

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0])
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("fullName", data.fullName)
      if (data.phone) formData.append("phone", data.phone)
      if (data.headline) formData.append("headline", data.headline)
      if (data.bio) formData.append("bio", data.bio)
      if (data.location) formData.append("location", data.location)

      if (profileImage) {
        formData.append("profileImage", profileImage)
      }

      if (resume) {
        formData.append("resume", resume)
      }

      const result = await updateUserProfile(formData)

      if (result.success) {
        toast({
          title: "Profil berhasil diperbarui",
          description: result.message,
        })
      } else {
        toast({
          title: "Gagal memperbarui profil",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border">
              {profileImagePreview ? (
                <Image src={profileImagePreview || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <Label htmlFor="profileImage" className="cursor-pointer text-sm text-blue-600 hover:underline">
                Ubah foto
              </Label>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" {...form.register("fullName")} disabled={isLoading} />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="Contoh: Frontend Developer | React Specialist"
                {...form.register("headline")}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Ceritakan tentang diri Anda, pengalaman, dan keahlian"
            rows={4}
            {...form.register("bio")}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" placeholder="08xxxxxxxxxx" {...form.register("phone")} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              placeholder="Contoh: Jakarta, Indonesia"
              {...form.register("location")}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume</Label>
          <div className="flex items-center gap-2">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              disabled={isLoading}
            />
            {user?.resume_url && !resume && (
              <a
                href={user.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline whitespace-nowrap"
              >
                Lihat Resume
              </a>
            )}
          </div>
          <p className="text-xs text-gray-500">Format yang diterima: PDF, DOC, DOCX. Maksimal 5MB.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  )
}
