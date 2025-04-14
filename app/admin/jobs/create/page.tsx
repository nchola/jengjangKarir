import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import JobForm from "@/components/admin/job-form"
import { getCategories, getCompanies } from "@/lib/actions"
import AuthCheck from "@/components/admin/auth-check"

export default async function CreateJobPage() {
  // Ambil data kategori dan perusahaan untuk dropdown
  const [categories, companies] = await Promise.all([getCategories(), getCompanies()])

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Tambah Lowongan Baru</h1>
              <p className="text-gray-600">Buat dan publikasikan lowongan pekerjaan baru</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <JobForm categories={categories} companies={companies} />
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
