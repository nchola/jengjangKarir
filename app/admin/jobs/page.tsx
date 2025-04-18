import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getJobs } from "@/lib/actions"
import JobTable from "@/components/admin/job-table"

export const dynamic = "force-dynamic"

export default async function AdminJobsPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Lowongan Kerja</h1>
          <p className="text-gray-500 mt-1">Tambah, edit, dan hapus lowongan kerja</p>
        </div>
        <Link href="/admin/jobs/create">
          <Button className="bg-teal-500 hover:bg-teal-600 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Lowongan
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <JobTable jobs={jobs} />
      </div>
    </div>
  )
}
