import CategoryForm from "@/components/admin/category-form"

export default function CreateCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Kategori Baru</h1>
        <p className="text-gray-600">Tambahkan kategori lowongan baru</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <CategoryForm />
      </div>
    </div>
  )
}
