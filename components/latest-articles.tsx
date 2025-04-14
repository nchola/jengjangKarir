"use client"

import { ArticleCard } from "@/components/article-card"

const articles = [
  {
    id: 1,
    title: "Tips Membuat CV yang Menarik Perhatian Recruiter",
    excerpt:
      "Pelajari cara membuat CV yang efektif dan menonjol di antara ratusan lamaran lainnya dengan tips dari para HR profesional.",
    image: "/placeholder.svg?height=192&width=384",
    category: "Tips Karir",
    author: "Budi Santoso",
    date: "10 Apr 2023",
  },
  {
    id: 2,
    title: "Skill yang Paling Dicari di Industri Teknologi 2023",
    excerpt:
      "Mengenal berbagai keterampilan yang sedang tinggi permintaannya di industri teknologi dan bagaimana cara mempelajarinya.",
    image: "/placeholder.svg?height=192&width=384",
    category: "Teknologi",
    author: "Dewi Lestari",
    date: "5 Apr 2023",
  },
  {
    id: 3,
    title: "Cara Menjawab Pertanyaan Interview dengan Percaya Diri",
    excerpt:
      "Panduan lengkap menghadapi berbagai pertanyaan interview yang sering diajukan beserta contoh jawaban terbaiknya.",
    image: "/placeholder.svg?height=192&width=384",
    category: "Interview",
    author: "Andi Wijaya",
    date: "28 Mar 2023",
  },
]

const LatestArticles = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  )
}

export default LatestArticles
