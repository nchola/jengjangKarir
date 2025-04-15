import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, User, Tag } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getArticleBySlug, getFeaturedArticles } from "@/lib/article-actions"
import RelatedArticles from "@/components/related-articles"
import Markdown from "react-markdown"

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  // Get related articles (featured articles for now)
  const relatedArticles = await getFeaturedArticles(3)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center text-white/80 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {article.date || new Date(article.created_at || article.published_at).toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              <span>{article.category?.name || article.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={article.image || article.image_url || "/placeholder.svg?height=384&width=768"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="prose max-w-none">
              <Markdown>{article.content}</Markdown>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
          <RelatedArticles articles={relatedArticles.filter((a) => a.id !== article.id)} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
