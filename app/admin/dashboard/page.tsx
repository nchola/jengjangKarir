import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Building, Tag } from "lucide-react"
import { getJobs, getCategories, getCompanies } from "@/lib/actions"
import AuthCheck from "@/components/admin/auth-check"

export default async function AdminDashboardPage() {
  const [jobs, categories, companies] = await Promise.all([getJobs(), getCategories(), getCompanies()])

  const activeJobs = jobs.filter((job) => job.status === "active").length
  const featuredJobs = jobs.filter((job) => job.is_featured).length

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Selamat datang di dashboard admin JenjangKarir</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Lowongan</CardTitle>
                  <Briefcase className="h-4 w-4 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeJobs} aktif, {jobs.length - activeJobs} kedaluwarsa
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Lowongan Unggulan</CardTitle>
                  <Briefcase className="h-4 w-4 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{featuredJobs}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((featuredJobs / jobs.length) * 100).toFixed(1)}% dari total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Perusahaan</CardTitle>
                  <Building className="h-4 w-4 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companies.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Terdaftar di platform</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                  <Tag className="h-4 w-4 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Kategori lowongan</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lowongan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-500">{job.company.name}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(job.posted_at).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kategori Populer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories
                      .sort((a, b) => b.job_count - a.job_count)
                      .slice(0, 5)
                      .map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{category.icon || "🔍"}</span>
                            <p className="font-medium">{category.name}</p>
                          </div>
                          <div className="text-sm text-gray-500">{category.job_count} lowongan</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
