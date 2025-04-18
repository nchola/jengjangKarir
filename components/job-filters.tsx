"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, RefreshCw } from "lucide-react"
import { useFilter } from "@/components/filter-provider"
import type { JobCategory } from "@/types/job"

interface JobFiltersProps {
  categories: JobCategory[]
}

const JobFilters = ({ categories }: JobFiltersProps) => {
  const { filterValues, setFilter, resetFilters, applyFilters, activeFilterCount, isFilterChanged } = useFilter()

  // State lokal untuk slider gaji
  const [salaryRange, setSalaryRange] = useState([
    Number.parseInt(filterValues.salary_min || "5"),
    Number.parseInt(filterValues.salary_max || "30"),
  ])

  // Update state lokal saat filter berubah dari luar
  useEffect(() => {
    setSalaryRange([Number.parseInt(filterValues.salary_min || "5"), Number.parseInt(filterValues.salary_max || "30")])
  }, [filterValues.salary_min, filterValues.salary_max])

  // Handler untuk perubahan kategori
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      const currentCategories = filterValues.category || []
      const updatedCategories = Array.isArray(currentCategories) ? currentCategories : [currentCategories]

      // Toggle kategori
      const newCategories = updatedCategories.includes(categoryId)
        ? updatedCategories.filter((id) => id !== categoryId)
        : [...updatedCategories, categoryId]

      setFilter("category", newCategories.length > 0 ? newCategories : undefined)
    },
    [filterValues.category, setFilter],
  )

  // Handler untuk perubahan tipe pekerjaan
  const handleJobTypeChange = useCallback(
    (jobType: string) => {
      const currentJobTypes = filterValues.job_type || []
      const updatedJobTypes = Array.isArray(currentJobTypes) ? currentJobTypes : [currentJobTypes]

      // Toggle tipe pekerjaan
      const newJobTypes = updatedJobTypes.includes(jobType)
        ? updatedJobTypes.filter((type) => type !== jobType)
        : [...updatedJobTypes, jobType]

      setFilter("job_type", newJobTypes.length > 0 ? newJobTypes : undefined)
    },
    [filterValues.job_type, setFilter],
  )

  // Handler untuk perubahan lokasi
  const handleLocationChange = useCallback(
    (location: string) => {
      const currentLocations = filterValues.location || []
      const updatedLocations = Array.isArray(currentLocations) ? currentLocations : [currentLocations]

      // Toggle lokasi
      const newLocations = updatedLocations.includes(location)
        ? updatedLocations.filter((loc) => loc !== location)
        : [...updatedLocations, location]

      setFilter("location", newLocations.length > 0 ? newLocations : undefined)
    },
    [filterValues.location, setFilter],
  )

  // Handler untuk perubahan slider gaji
  const handleSalaryChange = useCallback((value: number[]) => {
    setSalaryRange(value)
  }, [])

  // Handler untuk menerapkan perubahan gaji
  const handleSalaryChangeComplete = useCallback(() => {
    // Hanya update filter jika nilai berubah signifikan
    if (
      salaryRange[0] !== Number.parseInt(filterValues.salary_min || "5") ||
      salaryRange[1] !== Number.parseInt(filterValues.salary_max || "30")
    ) {
      setFilter("salary_min", salaryRange[0].toString())
      setFilter("salary_max", salaryRange[1].toString())
    }
  }, [salaryRange, filterValues.salary_min, filterValues.salary_max, setFilter])

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter Lowongan</h2>
        {activeFilterCount > 0 && (
          <div className="flex items-center">
            <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {activeFilterCount} aktif
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetFilters()
                applyFilters()
              }}
              className="h-8 px-2 text-gray-500 hover:text-red-500"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["category", "jobType", "salary", "location"]}>
        <AccordionItem value="category">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" />
              Kategori
              {filterValues.category && (
                <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {Array.isArray(filterValues.category) ? filterValues.category.length : filterValues.category ? 1 : 0}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={
                      Array.isArray(filterValues.category)
                        ? filterValues.category.includes(category.id.toString())
                        : filterValues.category === category.id.toString()
                    }
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
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" />
              Tipe Pekerjaan
              {filterValues.job_type && (
                <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {Array.isArray(filterValues.job_type) ? filterValues.job_type.length : filterValues.job_type ? 1 : 0}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["full-time", "part-time", "contract", "freelance", "remote", "hybrid"].map((jobType) => (
                <div key={jobType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`jobtype-${jobType}`}
                    checked={
                      Array.isArray(filterValues.job_type)
                        ? filterValues.job_type.includes(jobType)
                        : filterValues.job_type === jobType
                    }
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
                            : jobType === "hybrid"
                              ? "Hybrid"
                              : "Remote"}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" />
              Gaji (Juta Rupiah)
              {(filterValues.salary_min || filterValues.salary_max) && (
                <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {filterValues.salary_min || "5"}-{filterValues.salary_max || "30"}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 px-1 pt-2">
              <Slider
                value={salaryRange}
                max={50}
                min={1}
                step={1}
                onValueChange={handleSalaryChange}
                onValueCommit={handleSalaryChangeComplete}
                className="mt-6"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">Rp {salaryRange[0]} juta</span>
                <span className="text-sm">Rp {salaryRange[1]} juta</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" />
              Lokasi
              {filterValues.location && (
                <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {Array.isArray(filterValues.location) ? filterValues.location.length : filterValues.location ? 1 : 0}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Medan", "Bali", "Remote"].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={
                      Array.isArray(filterValues.location)
                        ? filterValues.location.includes(location)
                        : filterValues.location === location
                    }
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

      <div className="mt-6">
        <Button className="w-full bg-teal-500 hover:bg-teal-600" onClick={applyFilters} disabled={!isFilterChanged}>
          Terapkan Filter
        </Button>
      </div>
    </div>
  )
}

export default JobFilters
