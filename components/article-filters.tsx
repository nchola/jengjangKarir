"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ArticleFiltersProps {
  categories: string[] | any[]
}

const ArticleFilters = ({ categories }: ArticleFiltersProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.getAll("category") || [])

  // Extract category names if they're objects
  const categoryNames = categories.map((cat) => (typeof cat === "object" ? cat.name : cat))

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery) {
      params.set("q", searchQuery)
    }

    selectedCategories.forEach((category) => {
      params.append("category", category)
    })

    router.push(`/articles?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    router.push("/articles")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Filter Artikel</h2>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Cari artikel..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Kategori</h3>
        <div className="space-y-2">
          {categoryNames.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={applyFilters}>
          Terapkan Filter
        </Button>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>
    </div>
  )
}

export default ArticleFilters
