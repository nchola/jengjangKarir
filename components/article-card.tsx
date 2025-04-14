"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ArticleCardProps {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  date: string
}

export function ArticleCard({ id, title, excerpt, image, category, author, date }: ArticleCardProps) {
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

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 group",
        "hover:shadow-xl hover:translate-y-[-4px]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg?height=208&width=384"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-500 text-white">
            {category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
          <Link href={`/articles/${id}`}>{title}</Link>
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-teal-500" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-teal-500" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
