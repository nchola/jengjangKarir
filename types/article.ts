export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  image_url?: string
  author?: string
  date?: string
  created_at?: string
}
