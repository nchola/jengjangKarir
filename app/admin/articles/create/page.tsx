import ArticleForm from "@/components/admin/article-form"

export default async function CreateArticlePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Artikel Baru</h1>
        <p className="text-gray-600">Buat dan publikasikan artikel baru</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <ArticleForm />
      </div>
    </div>
  )
}
