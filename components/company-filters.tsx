"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, RefreshCw } from "lucide-react"
import { useFilter } from "@/components/filter-provider"

const CompanyFilters = () => {
  const { filterValues, setFilter, resetFilters, applyFilters, activeFilterCount, isFilterChanged } = useFilter()

  // Handler untuk perubahan lokasi
  const handleLocationChange = (location: string) => {
    const currentLocations = filterValues.location || []
    const updatedLocations = Array.isArray(currentLocations) ? currentLocations : [currentLocations]

    // Toggle lokasi
    const newLocations = updatedLocations.includes(location)
      ? updatedLocations.filter((loc) => loc !== location)
      : [...updatedLocations, location]

    setFilter("location", newLocations.length > 0 ? newLocations : undefined)
  }

  // Handler untuk perubahan ukuran perusahaan
  const handleSizeChange = (size: string) => {
    const currentSizes = filterValues.company_size || []
    const updatedSizes = Array.isArray(currentSizes) ? currentSizes : [currentSizes]

    // Toggle ukuran
    const newSizes = updatedSizes.includes(size) ? updatedSizes.filter((s) => s !== size) : [...updatedSizes, size]

    setFilter("company_size", newSizes.length > 0 ? newSizes : undefined)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter Perusahaan</h2>
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

      <Accordion type="multiple" defaultValue={["location", "size"]}>
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

        <AccordionItem value="size">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" />
              Ukuran Perusahaan
              {filterValues.company_size && (
                <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {Array.isArray(filterValues.company_size)
                    ? filterValues.company_size.length
                    : filterValues.company_size
                      ? 1
                      : 0}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                { id: "1-10", label: "1-10 karyawan" },
                { id: "11-50", label: "11-50 karyawan" },
                { id: "51-200", label: "51-200 karyawan" },
                { id: "201-500", label: "201-500 karyawan" },
                { id: "501-1000", label: "501-1000 karyawan" },
                { id: "1000+", label: "1000+ karyawan" },
              ].map((size) => (
                <div key={size.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size.id}`}
                    checked={
                      Array.isArray(filterValues.company_size)
                        ? filterValues.company_size.includes(size.id)
                        : filterValues.company_size === size.id
                    }
                    onCheckedChange={() => handleSizeChange(size.id)}
                  />
                  <label
                    htmlFor={`size-${size.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {size.label}
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

export default CompanyFilters
