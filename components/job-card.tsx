"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Briefcase, BookmarkPlus } from "lucide-react"
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
        "bg-white rounded-xl shadow-md border border-gray-100 p-5 transition-all duration-500",
        "hover:shadow-xl hover:border-teal-100 hover:translate-y-[-4px]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg"></div>
          <Image
            src={company.logo_url || "/placeholder.svg?height=56&width=56"}
            alt={`${company.name} logo`}
            fill
            className="object-contain p-2 rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg text-gray-900 truncate">
              <Link href={`/jobs/${slug}`} className="hover:text-teal-600">
                {title}
              </Link>
            </h3>
            <Button variant="ghost" size="icon" className="flex-shrink-0 text-gray-400 hover:text-teal-500">
              <BookmarkPlus className="h-5 w-5" />
              <span className="sr-only">Simpan lowongan</span>
            </Button>
          </div>

          <p className="text-gray-600 mb-2">{company.name}</p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500" />
              <span>{location}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
              <Briefcase className="h-3.5 w-3.5 mr-1 text-teal-500" />
              <span>{job_type}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5 mr-1 text-teal-500" />
              <span>{posted_at ? timeAgo(posted_at) : "Baru"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-teal-600 font-medium">{salary_display}</div>
            <div className="flex gap-2">
              {isNew && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Baru
                </span>
              )}
              {is_featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
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
