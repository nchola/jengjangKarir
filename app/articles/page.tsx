import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { getArticles } from "@/lib/article-actions"
import ArticleList from "@/components/article-list"

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Artikel & Tips Karir</h1>
          <p className="text-white/80">
            Temukan berbagai artikel, tips, dan panduan untuk membantu perjalanan karir Anda
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          }
        >
          <ArticleList articles={articles} />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
