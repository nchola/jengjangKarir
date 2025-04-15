export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  image_url?: string
  category?:
    | string
    | {
        id: number
        name: string
        slug: string
      }
  author?: string
  date?: string
  created_at?: string
  published_at?: string
  is_published?: boolean
  published?: boolean
  is_featured?: boolean
  featured?: boolean
}
