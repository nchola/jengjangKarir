import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import JobCategories from "@/components/job-categories"
import FeaturedJobs from "@/components/featured-jobs"
import LatestArticles from "@/components/latest-articles"
import Footer from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getFeaturedJobs, getJobs } from "@/lib/actions"
import { getFeaturedArticles } from "@/lib/article-actions"
import JobCard from "@/components/job-card"

export default async function Home() {
  // Ambil data dari Supabase
  const [featuredJobs, latestJobs, categories, featuredArticles] = await Promise.all([
    getFeaturedJobs(4),
    getJobs(),
    getCategories(),
    getFeaturedArticles(3),
  ])

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
        {/* Pada halaman utama, kita tentukan targetPath ke /jobs */}
        <SearchBar targetPath="/jobs" />

        <section className="my-6 sm:my-12">
          <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Kategori Lowongan
            </span>
          </h2>
          <Suspense
            fallback={
              <div className="h-32 sm:h-40 flex items-center justify-center">
                <Skeleton className="h-32 sm:h-40 w-full" />
              </div>
            }
          >
            <JobCategories categories={categories} />
          </Suspense>
        </section>

        <section className="my-6 sm:my-12">
          <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Lowongan Unggulan
            </span>
          </h2>
          <Suspense
            fallback={
              <div className="h-60 sm:h-80 flex items-center justify-center">
                <Skeleton className="h-60 sm:h-80 w-full" />
              </div>
            }
          >
            <FeaturedJobs jobs={featuredJobs} />
          </Suspense>
        </section>

        <section className="my-6 sm:my-12">
          <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Lowongan Terbaru
            </span>
          </h2>
          <Suspense
            fallback={
              <div className="h-60 sm:h-80 flex items-center justify-center">
                <Skeleton className="h-60 sm:h-80 w-full" />
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              {latestJobs.slice(0, 4).map((job) => (
                <JobCard key={job.id} {...job} isNew={true} />
              ))}
            </div>
          </Suspense>
        </section>

        <section className="my-6 sm:my-12">
          <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Artikel Terbaru
            </span>
          </h2>
          <Suspense
            fallback={
              <div className="h-60 sm:h-80 flex items-center justify-center">
                <Skeleton className="h-60 sm:h-80 w-full" />
              </div>
            }
          >
            <LatestArticles articles={featuredArticles} />
          </Suspense>
        </section>
      </div>

      <Footer />
    </main>
  )
}
