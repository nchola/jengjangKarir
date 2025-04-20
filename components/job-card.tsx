"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Briefcase, BookmarkPlus, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { timeAgo } from "@/lib/utils"
import type { JobWithRelations } from "@/types/job"

export interface JobCardProps extends Partial<JobWithRelations> {
  isNew?: boolean
}

export function JobCard({
  id,
  title,
  company,
  location,
  job_type,
  salary_display,
  show_salary,
  posted_at,
  is_featured,
  slug,
  isNew = false,
}: JobCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  if (!id || !title || !company) return null

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-500",
        "hover:shadow-md hover:border-teal-100 hover:translate-y-[-2px]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg"></div>
          <Image
            src={company.logo_url || "/placeholder.svg?height=48&width=48"}
            alt={`${company.name} logo`}
            fill
            className="object-contain p-1.5 rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base text-gray-900 truncate">
              <Link href={`/jobs/${slug}`} className="hover:text-teal-600">
                {title}
              </Link>
            </h3>
            <Button variant="ghost" size="icon" className="flex-shrink-0 text-gray-400 hover:text-teal-500 h-8 w-8">
              <BookmarkPlus className="h-4 w-4" />
              <span className="sr-only">Simpan lowongan</span>
            </Button>
          </div>

          <p className="text-gray-600 text-sm mb-1.5">{company.name}</p>

          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
            <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded-full">
              <MapPin className="h-3 w-3 mr-1 text-teal-500" />
              <span>{location}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded-full">
              <Briefcase className="h-3 w-3 mr-1 text-teal-500" />
              <span>{job_type}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded-full">
              <Clock className="h-3 w-3 mr-1 text-teal-500" />
              <span>{posted_at ? timeAgo(posted_at) : "Baru"}</span>
            </div>
            {show_salary && salary_display && (
              <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded-full">
                <DollarSign className="h-3 w-3 mr-1 text-teal-500" />
                <span>{salary_display}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {isNew && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                  Baru
                </span>
              )}
              {is_featured && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800">
                  Unggulan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard
