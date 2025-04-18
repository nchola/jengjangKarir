import type { Metadata } from "next"
import { getCategoryBySlug } from "@/lib/job-actions"

interface CategoryLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: "Kategori tidak ditemukan - JenjangKarir",
      description: "Kategori lowongan yang Anda cari tidak ditemukan",
    }
  }

  return {
    title: `Lowongan ${category.name} - JenjangKarir`,
    description: `Temukan lowongan kerja ${category.name} terbaru di JenjangKarir`,
  }
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return children
} 