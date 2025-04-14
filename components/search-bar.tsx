"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (keyword) params.set("q", keyword)
    if (location) params.set("location", location)
    if (jobType) params.set("job_type", jobType)

    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-12 relative z-10 border border-gray-100">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Posisi, keahlian, atau perusahaan"
            className="pl-12 h-14 rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Lokasi"
            className="pl-12 h-14 rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-full h-14 rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500">
              <div className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                <SelectValue placeholder="Tipe Pekerjaan" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto h-14 px-8 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white rounded-xl"
        >
          Cari Lowongan
        </Button>
      </form>
    </div>
  )
}
