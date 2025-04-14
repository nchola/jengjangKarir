"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { JobCategory } from "@/types/job"

interface JobFiltersProps {
  categories: JobCategory[]
}

const JobFilters = ({ categories }: JobFiltersProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [salaryRange, setSalaryRange] = useState([5, 30])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const handleSalaryChange = (value: number[]) => {
    setSalaryRange(value)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleJobTypeChange = (jobType: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType) ? prev.filter((type) => type !== jobType) : [...prev, jobType],
    )
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location],
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Clear existing filters
    params.delete("category")
    params.delete("job_type")
    params.delete("location")
    params.delete("salary_min")
    params.delete("salary_max")

    // Add new filters
    selectedCategories.forEach((category) => {
      params.append("category", category)
    })

    selectedJobTypes.forEach((jobType) => {
      params.append("job_type", jobType)
    })

    selectedLocations.forEach((location) => {
      params.append("location", location)
    })

    params.set("salary_min", salaryRange[0].toString())
    params.set("salary_max", salaryRange[1].toString())

    router.push(`/jobs?${params.toString()}`)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedJobTypes([])
    setSelectedLocations([])
    setSalaryRange([5, 30])
    router.push("/jobs")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Filter Lowongan</h2>

      <Accordion type="multiple" defaultValue={["category", "jobType", "salary", "location"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Kategori</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id.toString())}
                    onCheckedChange={() => handleCategoryChange(category.id.toString())}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name} ({category.job_count})
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jobType">
          <AccordionTrigger>Tipe Pekerjaan</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["full-time", "part-time", "contract", "freelance", "remote"].map((jobType) => (
                <div key={jobType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`jobtype-${jobType}`}
                    checked={selectedJobTypes.includes(jobType)}
                    onCheckedChange={() => handleJobTypeChange(jobType)}
                  />
                  <label
                    htmlFor={`jobtype-${jobType}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {jobType === "full-time"
                      ? "Full Time"
                      : jobType === "part-time"
                        ? "Part Time"
                        : jobType === "contract"
                          ? "Contract"
                          : jobType === "freelance"
                            ? "Freelance"
                            : "Remote"}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary">
          <AccordionTrigger>Gaji (Juta Rupiah)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 px-1 pt-2">
              <Slider
                defaultValue={[5, 30]}
                max={50}
                min={1}
                step={1}
                value={salaryRange}
                onValueChange={handleSalaryChange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">Rp {salaryRange[0]} juta</span>
                <span className="text-sm">Rp {salaryRange[1]} juta</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Lokasi</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Remote"].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => handleLocationChange(location)}
                  />
                  <label
                    htmlFor={`location-${location}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full" onClick={applyFilters}>
          Terapkan Filter
        </Button>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>
    </div>
  )
}

export default JobFilters
