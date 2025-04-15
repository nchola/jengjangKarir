import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import ArticleForm from "@/components/admin/article-form"
import { getArticleCategories } from "@/lib/article-actions"
import AuthCheck from "@/components/admin/auth-check"

export default async function CreateArticlePage() {
  // Get existing categories for dropdown
  const categories = await getArticleCategories()

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Tambah Artikel Baru</h1>
              <p className="text-gray-600">Buat dan publikasikan artikel baru</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <ArticleForm categories={categories} />
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
