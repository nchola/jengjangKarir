"use client"

import { ArticleCard } from "@/components/article-card"
import type { Article } from "@/types/article"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface LatestArticlesProps {
  articles: Article[]
}

const LatestArticles = ({ articles }: LatestArticlesProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Belum ada artikel</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/articles">
          <Button variant="outline" className="px-8">
            Lihat Semua Artikel
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default LatestArticles
