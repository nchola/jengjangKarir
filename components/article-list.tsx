"use client"

import { useState, useEffect } from "react"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Article } from "@/types/article"

interface ArticleListProps {
  articles: Article[]
  initialLimit?: number
}

const ArticleList = ({ articles: initialArticles, initialLimit = 6 }: ArticleListProps) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [limit, setLimit] = useState(initialLimit)
  const [loading, setLoading] = useState(false)

  // Ensure articles are properly displayed even if they come from server
  useEffect(() => {
    setArticles(initialArticles)
  }, [initialArticles])

  const loadMore = () => {
    setLoading(true)
    // Simulate loading
    setTimeout(() => {
      setLimit(limit + 6)
      setLoading(false)
    }, 500)
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Belum ada artikel</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, limit).map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      {limit < articles.length && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} disabled={loading} className="px-8">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ArticleList
