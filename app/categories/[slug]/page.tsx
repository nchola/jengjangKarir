"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { getJobsByCategory, getCategoryBySlug } from "@/lib/job-actions"
import JobCard from "@/components/job-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FilterProvider } from "@/components/filter-provider"
import JobFilters from "@/components/job-filters"
import { getCategories } from "@/lib/actions"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load category and categories data first
        const [categoryData, categoriesData] = await Promise.all([
          getCategoryBySlug(params.slug),
          getCategories()
        ])

        if (!categoryData) {
          notFound()
          return
        }

        setCategory(categoryData)
        setCategories(categoriesData)

        // Then load jobs for the category using slug instead of ID
        const jobsData = await getJobsByCategory(params.slug)
        setJobs(jobsData)
      } catch (error) {
        console.error("Error loading category data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <FilterProvider filterType="job">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
            
            <h1 className="text-2xl font-bold mb-2">Lowongan {category.name}</h1>
            <p className="text-gray-600">
              {jobs.length} lowongan tersedia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter sidebar */}
            <div className="lg:col-span-1">
              <JobFilters categories={categories} />
            </div>

            {/* Job listings */}
            <div className="lg:col-span-3">
              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      {...job}
                      isNew={
                        new Date(job.posted_at).getTime() >
                        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada lowongan untuk kategori ini</p>
                  <Button asChild className="mt-4">
                    <Link href="/">Lihat Semua Lowongan</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
} 
 