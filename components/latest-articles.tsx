"use client"

import { ArticleCard } from "@/components/article-card"
import type { Article } from "@/types/article"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

interface LatestArticlesProps {
  articles: Article[]
}

const LatestArticles = ({ articles: initialArticles }: LatestArticlesProps) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles || [])

  // Ensure articles are properly displayed even if they come from server
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      console.log("Latest articles received:", initialArticles)
      setArticles(initialArticles)
    }
  }, [initialArticles])

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Belum ada artikel</p>
      </div>
    )
  }

  // Only display up to 4 articles
  const displayArticles = articles.slice(0, 4)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayArticles.map((article) => (
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
