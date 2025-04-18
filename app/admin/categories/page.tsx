import { Suspense } from "react"
import CategoryTable from "@/components/admin/category-table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola Kategori</h1>
          <p className="text-gray-600">Tambah dan kelola kategori lowongan</p>
        </div>

        <Link href="/admin/categories/create">
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <CategoryTable />
        </Suspense>
      </div>
    </div>
  )
}
