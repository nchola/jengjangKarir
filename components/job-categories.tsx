"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { JobCategory } from "@/types/job"

interface JobCategoriesProps {
  categories: JobCategory[]
}

const JobCategories = ({ categories }: JobCategoriesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = direction === "left" ? -300 : 300
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Belum ada kategori lowongan</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg bg-white border-0 h-12 w-12"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Scroll left</span>
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 py-6 px-1 hide-scrollbar scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/jobs/category/${category.slug}`}
            className={cn(
              "flex-shrink-0 w-64 h-36 rounded-xl overflow-hidden relative group",
              "shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer",
              "scroll-snap-align-start",
            )}
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-teal-500 opacity-80 group-hover:opacity-90 transition-opacity"></div>

            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:20px_20px] opacity-30"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <div className="text-4xl mb-2">{category.icon || "🔍"}</div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-white/80">{category.job_count} lowongan</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg bg-white border-0 h-12 w-12"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  )
}

export default JobCategories
