"use client"

import React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Building, MapPin, Globe, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Company } from "@/types/job"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [jobCount, setJobCount] = useState<number | null>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)

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

  // Fetch job count for this company
  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        const response = await fetch(`/api/companies/${company.id}/job-count`)
        if (response.ok) {
          const data = await response.json()
          setJobCount(data.count)
        }
      } catch (error) {
        console.error("Error fetching job count:", error)
      }
    }

    if (isVisible) {
      fetchJobCount()
    }
  }, [company.id, isVisible])

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 h-full",
        "hover:shadow-xl hover:translate-y-[-4px]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      <Link href={`/companies/${company.slug}`} className="block h-full">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-lg"></div>
              <Image
                src={
                  company.logo_url ||
                  `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(company.name.charAt(0))}`
                }
                alt={company.name}
                fill
                className="object-contain p-2 rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
              {company.location && (
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500" />
                  <span>{company.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {company.company_size && (
              <div className="flex items-center text-gray-600 text-sm">
                <Building className="h-4 w-4 mr-2 text-teal-500" />
                <span>{company.company_size} karyawan</span>
              </div>
            )}

            {company.website && (
              <div className="flex items-center text-gray-600 text-sm">
                <Globe className="h-4 w-4 mr-2 text-teal-500" />
                <span className="truncate">{company.website.replace(/^https?:\/\//, "")}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600 text-sm">
              <Briefcase className="h-4 w-4 mr-2 text-teal-500" />
              <span>{jobCount !== null ? `${jobCount} lowongan aktif` : "Memuat lowongan..."}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
