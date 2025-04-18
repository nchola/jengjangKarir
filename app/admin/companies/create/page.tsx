import CompanyForm from "@/components/admin/company-form"

export default function CreateCompanyPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Perusahaan Baru</h1>
        <p className="text-gray-600">Tambahkan data perusahaan baru</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <CompanyForm />
      </div>
    </div>
  )
}
