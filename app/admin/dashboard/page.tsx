"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Building, Tag } from "lucide-react"
import { getJobs, getCategories, getCompanies } from "@/lib/actions"
import AuthCheck from "@/components/admin/auth-check"
import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsData, categoriesData, companiesData] = await Promise.all([
          getJobs().catch(() => []),
          getCategories().catch(() => []),
          getCompanies().catch(() => []),
        ])

        setJobs(jobsData)
        setCategories(categoriesData)
        setCompanies(companiesData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const activeJobs = jobs.filter((job) => job.status === "active").length
  const featuredJobs = jobs.filter((job) => job.is_featured).length

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main className="flex-1 p-6 admin-mobile-container md:p-6">
            <div className="mb-6 flex justify-between items-center admin-mobile-spacing">
              <div>
                <h1 className="text-2xl font-bold admin-mobile-heading md:text-2xl">Dashboard</h1>
                <p className="text-gray-600 admin-mobile-text md:text-base">
                  Selamat datang di dashboard admin JenjangKarir
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 admin-mobile-spacing">
              <Card className="admin-mobile-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 admin-mobile-container">
                  <CardTitle className="text-sm font-medium admin-mobile-text md:text-sm">Total Lowongan</CardTitle>
                  <Briefcase className="h-4 w-4 text-teal-500 admin-mobile-icon md:h-4 md:w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold admin-mobile-heading md:text-2xl">{jobs.length}</div>
                  <p className="text-xs text-gray-500 mt-1 admin-mobile-text md:text-xs">
                    {activeJobs} aktif, {jobs.length - activeJobs} kedaluwarsa
                  </p>
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 admin-mobile-container">
                  <CardTitle className="text-sm font-medium admin-mobile-text md:text-sm">Lowongan Unggulan</CardTitle>
                  <Briefcase className="h-4 w-4 text-teal-500 admin-mobile-icon md:h-4 md:w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold admin-mobile-heading md:text-2xl">{featuredJobs}</div>
                  <p className="text-xs text-gray-500 mt-1 admin-mobile-text md:text-xs">
                    {jobs.length > 0 ? ((featuredJobs / jobs.length) * 100).toFixed(1) : 0}% dari total
                  </p>
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 admin-mobile-container">
                  <CardTitle className="text-sm font-medium admin-mobile-text md:text-sm">Perusahaan</CardTitle>
                  <Building className="h-4 w-4 text-teal-500 admin-mobile-icon md:h-4 md:w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold admin-mobile-heading md:text-2xl">{companies.length}</div>
                  <p className="text-xs text-gray-500 mt-1 admin-mobile-text md:text-xs">Terdaftar di platform</p>
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 admin-mobile-container">
                  <CardTitle className="text-sm font-medium admin-mobile-text md:text-sm">Kategori</CardTitle>
                  <Tag className="h-4 w-4 text-teal-500 admin-mobile-icon md:h-4 md:w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold admin-mobile-heading md:text-2xl">{categories.length}</div>
                  <p className="text-xs text-gray-500 mt-1 admin-mobile-text md:text-xs">Kategori lowongan</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 admin-mobile-spacing">
              <Card className="admin-mobile-card">
                <CardHeader className="admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading md:text-base">Lowongan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobs.length > 0 ? (
                    <div className="space-y-4 admin-mobile-spacing">
                      {jobs.slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium admin-mobile-text md:text-base">{job.title}</p>
                            <p className="text-sm text-gray-500 admin-mobile-text md:text-sm">
                              {job.company?.name || "Unknown Company"}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 admin-mobile-text md:text-sm">
                            {new Date(job.posted_at).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4 admin-mobile-text md:text-base">No jobs found</p>
                  )}
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading md:text-base">Kategori Populer</CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.length > 0 ? (
                    <div className="space-y-4 admin-mobile-spacing">
                      {categories
                        .sort((a, b) => b.job_count - a.job_count)
                        .slice(0, 5)
                        .map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                          >
                            <div className="flex items-center">
                              <span className="text-xl mr-2 admin-mobile-text md:text-xl">{category.icon || "🔍"}</span>
                              <p className="font-medium admin-mobile-text md:text-base">{category.name}</p>
                            </div>
                            <div className="text-sm text-gray-500 admin-mobile-text md:text-sm">
                              {category.job_count} lowongan
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4 admin-mobile-text md:text-base">No categories found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
