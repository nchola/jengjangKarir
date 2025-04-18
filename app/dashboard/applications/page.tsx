import type { Metadata } from "next"
import { getUserApplications } from "@/lib/application-actions"
import ApplicationList from "@/components/dashboard/application-list"

export const metadata: Metadata = {
  title: "Lamaran Saya - JenjangKarir",
  description: "Kelola lamaran pekerjaan Anda",
}

export default async function ApplicationsPage() {
  const applications = await getUserApplications()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lamaran Saya</h1>
        <p className="text-gray-500">Pantau status lamaran pekerjaan Anda</p>
      </div>

      <ApplicationList applications={applications} />
    </div>
  )
}
