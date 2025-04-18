import CompanyForm from "@/components/admin/company-form"
import { getSupabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  const companyId = Number.parseInt(params.id)

  // Get company data
  const supabase = getSupabaseAdmin()
  const { data: company, error } = await supabase.from("companies").select("*").eq("id", companyId).single()

  if (error || !company) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Perusahaan</h1>
        <p className="text-gray-600">Perbarui informasi perusahaan</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <CompanyForm company={company} />
      </div>
    </div>
  )
}
