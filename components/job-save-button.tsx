"use client"

import { useState, useEffect } from "react"
import { BookmarkPlus, BookmarkCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { saveJob, unsaveJob, isJobSaved } from "@/lib/saved-jobs-actions"
import { useRouter } from "next/navigation"

interface JobSaveButtonProps {
  jobId: number
  variant?: "default" | "outline" | "ghost" | "icon"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function JobSaveButton({ jobId, variant = "outline", size = "default" }: JobSaveButtonProps) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const isSaved = await isJobSaved(jobId)
        setSaved(isSaved)
      } catch (error) {
        console.error("Error checking saved status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSavedStatus()
  }, [jobId])

  const handleToggleSave = async () => {
    try {
      setActionLoading(true)

      if (saved) {
        const result = await unsaveJob(jobId)
        if (result.success) {
          setSaved(false)
          toast({
            title: "Berhasil",
            description: "Lowongan dihapus dari tersimpan",
          })
        } else {
          toast({
            title: "Gagal",
            description: result.message,
            variant: "destructive",
          })
        }
      } else {
        const result = await saveJob(jobId)
        if (result.success) {
          setSaved(true)
          toast({
            title: "Berhasil",
            description: "Lowongan berhasil disimpan",
          })
        } else {
          if (result.message === "Silakan login untuk menyimpan lowongan") {
            toast({
              title: "Login diperlukan",
              description: "Silakan login untuk menyimpan lowongan",
            })
            router.push("/login")
          } else {
            toast({
              title: "Gagal",
              description: result.message,
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Loading</span>
      </Button>
    )
  }

  if (size === "icon") {
    return (
      <Button variant={variant} size={size} onClick={handleToggleSave} disabled={actionLoading}>
        {actionLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <BookmarkCheck className="h-4 w-4 text-teal-500" />
        ) : (
          <BookmarkPlus className="h-4 w-4" />
        )}
        <span className="sr-only">{saved ? "Hapus dari tersimpan" : "Simpan lowongan"}</span>
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} onClick={handleToggleSave} disabled={actionLoading}>
      {actionLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="mr-2 h-4 w-4" />
      ) : (
        <BookmarkPlus className="mr-2 h-4 w-4" />
      )}
      {saved ? "Tersimpan" : "Simpan Lowongan"}
    </Button>
  )
}
