"use client"

import { useState } from "react"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Database, CheckCircle } from "lucide-react"
import { seedSampleData } from "@/lib/seed-data"
import AuthCheck from "@/components/admin/auth-check"

export default function SeedDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSeedData = async () => {
    if (isLoading) return

    setIsLoading(true)
    setIsComplete(false)

    try {
      const result = await seedSampleData()

      if (result.success) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        setIsComplete(true)
      } else {
        toast({
          title: "Gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding data:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan data sampel",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Seed Database</h1>
              <p className="text-gray-600">Tambahkan data sampel ke database untuk keperluan testing</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tambah Data Sampel</CardTitle>
                <CardDescription>
                  Fitur ini akan menambahkan data sampel kategori, perusahaan, dan lowongan ke database Anda. Data yang
                  sudah ada tidak akan dihapus.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Data yang akan ditambahkan:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>8 kategori lowongan</li>
                    <li>8 perusahaan</li>
                    <li>5 lowongan pekerjaan dengan detail lengkap</li>
                  </ul>

                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      onClick={handleSeedData}
                      disabled={isLoading || isComplete}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menambahkan Data...
                        </>
                      ) : isComplete ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Data Berhasil Ditambahkan
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Tambahkan Data Sampel
                        </>
                      )}
                    </Button>

                    {isComplete && (
                      <Button variant="outline" onClick={() => (window.location.href = "/admin/dashboard")}>
                        Kembali ke Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
