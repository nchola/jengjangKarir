import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import JobForm from "@/components/admin/job-form"
import { getCategories, getCompanies } from "@/lib/actions"
import { getSupabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AuthCheck from "@/components/admin/auth-check"

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const jobId = Number.parseInt(params.id)

  // Ambil data lowongan, kategori, dan perusahaan
  const supabase = getSupabaseAdmin()
  const { data: job, error } = await supabase.from("jobs").select("*").eq("id", jobId).single()

  if (error || !job) {
    notFound()
  }

  const [categories, companies] = await Promise.all([getCategories(), getCompanies()])

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Edit Lowongan</h1>
              <p className="text-gray-600">Perbarui informasi lowongan pekerjaan</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <JobForm job={job} categories={categories} companies={companies} />
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
