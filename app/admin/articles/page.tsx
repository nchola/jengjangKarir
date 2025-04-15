import { Suspense } from "react"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import ArticleTable from "@/components/admin/article-table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AuthCheck from "@/components/admin/auth-check"
import MockDataNotice from "@/components/admin/mock-data-notice"

export default function AdminArticlesPage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Kelola Artikel</h1>
                <p className="text-gray-600">Tambah, edit, dan hapus artikel blog</p>
              </div>

              <Link href="/admin/articles/create">
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Artikel
                </Button>
              </Link>
            </div>

            {/* Show mock data notice if using mock data */}
            <MockDataNotice />

            <div className="bg-white rounded-xl shadow-md p-6">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <ArticleTable />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
