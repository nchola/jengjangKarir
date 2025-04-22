"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Building, Tag, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getJobs, getCategories, getCompanies } from "@/lib/actions"
import AuthCheck from "@/components/admin/auth-check"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import type { Job, Company, JobCategory } from "@/types"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface Stats {
  activeJobs: number
  featuredJobs: number
  totalCompanies: number
  totalCategories: number
  jobGrowth: number
  companyGrowth: number
}

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    featuredJobs: 0,
    totalCompanies: 0,
    totalCategories: 0,
    jobGrowth: 0,
    companyGrowth: 0
  })

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

        // Calculate stats
        const activeJobs = jobsData.filter((job) => job.status === "active").length
        const featuredJobs = jobsData.filter((job) => job.is_featured).length
        const totalCompanies = companiesData.length
        const totalCategories = categoriesData.length

        setStats({
          activeJobs,
          featuredJobs,
          totalCompanies,
          totalCategories,
          jobGrowth: 12, // Example growth percentage
          companyGrowth: 8 // Example growth percentage
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
              >
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              >
                <motion.div variants={item}>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lowongan Aktif</CardTitle>
                      <Briefcase className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">{stats.activeJobs}</div>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {stats.jobGrowth}%
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Perusahaan</CardTitle>
                      <Building className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {stats.companyGrowth}%
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                      <Tag className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <div className="text-2xl font-bold">{stats.totalCategories}</div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lowongan Unggulan</CardTitle>
                      <Briefcase className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <div className="text-2xl font-bold">{stats.featuredJobs}</div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Recent Activity Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.slice(0, 5).map((job) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-teal-50 rounded-lg">
                              <Briefcase className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{job.title}</p>
                              <p className="text-sm text-gray-500">{job.company?.name}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(job.posted_at).toLocaleDateString()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
