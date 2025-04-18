"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { destroyCookie } from "nookies"

export default function AdminNavbar() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear the admin session
    destroyCookie(null, "adminLoggedIn", { path: "/" })

    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari dashboard admin",
    })

    router.push("/admin/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-xl font-bold text-teal-600">
          JenjangKarir Admin
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/", "_blank")}
            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Lihat Website
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
