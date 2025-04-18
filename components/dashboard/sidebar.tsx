"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Briefcase, BookmarkCheck, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/user-actions"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari akun",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      })
    }
  }

  const navItems = [
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Lamaran Saya",
      href: "/dashboard/applications",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Lowongan Tersimpan",
      href: "/dashboard/saved-jobs",
      icon: <BookmarkCheck className="h-5 w-5" />,
    },
    {
      name: "Pengaturan",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-md p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-gray-700 rounded-lg",
              pathname === item.href ? "bg-teal-50 text-teal-600" : "hover:bg-gray-50 hover:text-teal-600",
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </nav>
    </aside>
  )
}
