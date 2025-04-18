import BackButton from "@/components/admin/back-button"
import JobForm from "@/components/admin/job-form"
import { getCategories, getCompanies } from "@/lib/actions"

export default async function CreateJobPage() {
  const [categories, companies] = await Promise.all([getCategories(), getCompanies()])

  return (
    <div>
      <BackButton />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Lowongan Baru</h1>
        <p className="text-gray-500 mt-1">Isi form berikut untuk membuat lowongan kerja baru</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <JobForm categories={categories} companies={companies} />
      </div>
    </div>
  )
}
