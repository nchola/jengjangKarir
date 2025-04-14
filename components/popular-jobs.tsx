"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobCard, type JobCardProps } from "@/components/job-card"

const popularJobs: JobCardProps[] = [
  {
    id: 5,
    title: "Data Scientist",
    company: "AI Solutions",
    logo: "/placeholder.svg?height=56&width=56",
    location: "Jakarta",
    salary: "Rp 20-30 juta/bulan",
    jobType: "Full Time",
    postedAt: "1 hari yang lalu",
    isNew: true,
    isFeatured: true,
  },
  {
    id: 6,
    title: "Product Manager",
    company: "Tech Innovators",
    logo: "/placeholder.svg?height=56&width=56",
    location: "Jakarta",
    salary: "Rp 25-35 juta/bulan",
    jobType: "Full Time",
    postedAt: "3 hari yang lalu",
    isFeatured: true,
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Cloud Solutions",
    logo: "/placeholder.svg?height=56&width=56",
    location: "Remote",
    salary: "Rp 18-28 juta/bulan",
    jobType: "Full Time",
    postedAt: "2 hari yang lalu",
    isNew: true,
  },
  {
    id: 8,
    title: "Mobile App Developer",
    company: "App Studio",
    logo: "/placeholder.svg?height=56&width=56",
    location: "Surabaya",
    salary: "Rp 12-20 juta/bulan",
    jobType: "Full Time",
    postedAt: "4 hari yang lalu",
    isNew: true,
  },
  {
    id: 9,
    title: "Content Writer",
    company: "Digital Media",
    logo: "/placeholder.svg?height=56&width=56",
    location: "Remote",
    salary: "Rp 6-12 juta/bulan",
    jobType: "Full Time",
    postedAt: "1 minggu yang lalu",
  },
  {
    id: 10,
    title: "HR Manager",
    company: "Corporate Group",
    logo: "/placeholder.svg?height=56&width=56",
    location: "Jakarta",
    salary: "Rp 15-25 juta/bulan",
    jobType: "Full Time",
    postedAt: "5 hari yang lalu",
  },
]

const PopularJobs = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = direction === "left" ? -400 : 400
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
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
        className="flex overflow-x-auto gap-6 py-6 px-1 hide-scrollbar scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {popularJobs.map((job) => (
          <div key={job.id} className="flex-shrink-0 w-80 md:w-96" style={{ scrollSnapAlign: "start" }}>
            <JobCard {...job} />
          </div>
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
      `}</style>
    </div>
  )
}

export default PopularJobs
