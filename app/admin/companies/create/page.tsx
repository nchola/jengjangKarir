import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import CompanyForm from "@/components/admin/company-form"
import AuthCheck from "@/components/admin/auth-check"

export default function CreateCompanyPage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Tambah Perusahaan Baru</h1>
              <p className="text-gray-600">Tambahkan data perusahaan baru</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <CompanyForm />
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
