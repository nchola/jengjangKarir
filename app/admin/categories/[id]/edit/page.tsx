import CategoryForm from "@/components/admin/category-form"
import { getSupabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categoryId = Number.parseInt(params.id)

  // Get category data
  const supabase = getSupabaseAdmin()
  const { data: category, error } = await supabase.from("job_categories").select("*").eq("id", categoryId).single()

  if (error || !category) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Kategori</h1>
        <p className="text-gray-600">Perbarui informasi kategori</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  )
}
