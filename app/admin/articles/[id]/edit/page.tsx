import ArticleForm from "@/components/admin/article-form"
import { getSupabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { getMockArticles } from "@/lib/mock-data"

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const articleId = Number.parseInt(params.id)

  // Get article data
  const supabase = getSupabaseAdmin()
  const { data: article, error } = await supabase.from("articles").select("*").eq("id", articleId).single()

  // If error, try to get from mock data
  const mockArticle = error ? getMockArticles().find((a) => a.id === articleId) : null

  if (error && !mockArticle) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Artikel</h1>
        <p className="text-gray-600">Perbarui informasi artikel</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <ArticleForm article={article || mockArticle} />
      </div>
    </div>
  )
}
