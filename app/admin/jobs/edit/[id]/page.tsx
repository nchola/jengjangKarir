import { notFound } from "next/navigation"
import BackButton from "@/components/admin/back-button"
import JobForm from "@/components/admin/job-form"
import { getCategories, getCompanies } from "@/lib/actions"
import { getSupabaseAdmin } from "@/lib/supabase"

interface EditJobPageProps {
  params: {
    id: string
  }
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    notFound()
  }

  const supabase = getSupabaseAdmin()
  const { data: job, error } = await supabase
    .from("jobs")
    .select(`
      *,
      company:companies(*),
      category:job_categories(*)
    `)
    .eq("id", id)
    .single()

  if (error || !job) {
    notFound()
  }

  const [categories, companies] = await Promise.all([getCategories(), getCompanies()])

  return (
    <div>
      <BackButton />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Lowongan</h1>
        <p className="text-gray-500 mt-1">Edit informasi lowongan kerja</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <JobForm job={job} categories={categories} companies={companies} />
      </div>
    </div>
  )
}
