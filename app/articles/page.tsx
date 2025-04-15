import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { getArticles, getArticleCategories } from "@/lib/article-actions"
import ArticleList from "@/components/article-list"
import ArticleFilters from "@/components/article-filters"

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([getArticles(), getArticleCategories()])

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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <ArticleFilters categories={categories} />
            </Suspense>
          </div>

          <div className="w-full md:w-3/4">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              }
            >
              <ArticleList articles={articles} />
            </Suspense>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
