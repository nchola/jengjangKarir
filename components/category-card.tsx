import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  slug: string
  icon?: string
  jobCount: number
}

export default function CategoryCard({ name, slug, icon, jobCount }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          {icon && (
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              {icon}
            </div>
          )}
          <h3 className="font-semibold mb-2 group-hover:text-teal-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-600">
            {jobCount} lowongan
          </p>
        </CardContent>
      </Card>
    </Link>
  )
} 