"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import JobList from "@/components/job-list"
import FilterPanel from "@/components/filter-panel"
import { getCategoryBySlug, getJobsByCategory, getCategories } from "@/lib/job-actions"
import { JobCategory } from "@/lib/types"
import JobFilters from "@/components/job-filters"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<JobCategory | null>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryData, jobsData, categoriesData] = await Promise.all([
          getCategoryBySlug(params.slug),
          getJobsByCategory(params.slug),
          getCategories(),
        ])

        if (!categoryData) {
          notFound()
        }

        setCategory(categoryData)
        setJobs(jobsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lowongan {category.name}</h1>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hidden md:block">
          <JobFilters categories={categories} />
        </div>
        <div className="md:col-span-3">
          <JobList initialJobs={jobs} />
        </div>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
      />
    </div>
  )
} 
 