"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import JobFilters from "./job-filters"
import { FilterProvider } from "./filter-provider"
import { FilterChips } from "./filter-chips"
import { JobCategory } from "@/lib/types"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  categories: JobCategory[]
}

export default function FilterPanel({ isOpen, onClose, categories }: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Filter Lowongan</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <FilterProvider filterType="job">
                <FilterChips />
                <JobFilters categories={categories} />
              </FilterProvider>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 