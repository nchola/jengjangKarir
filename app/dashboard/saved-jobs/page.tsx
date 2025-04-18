import type { Metadata } from "next"
import { getSavedJobs } from "@/lib/saved-jobs-actions"
import SavedJobsList from "@/components/dashboard/saved-jobs-list"

export const metadata: Metadata = {
  title: "Lowongan Tersimpan - JenjangKarir",
  description: "Kelola lowongan pekerjaan yang Anda simpan",
}

export default async function SavedJobsPage() {
  const savedJobs = await getSavedJobs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lowongan Tersimpan</h1>
        <p className="text-gray-500">Lowongan pekerjaan yang Anda simpan</p>
      </div>

      <SavedJobsList savedJobs={savedJobs} />
    </div>
  )
}
