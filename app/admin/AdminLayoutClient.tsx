"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LayoutDashboard, Briefcase, Building, Tag, FileText, Database, Activity, LogOut, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { logoutAdmin } from "@/lib/auth-actions"
import "./admin-mobile.css"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")
      const menuButton = document.getElementById("menu-button")

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen])

  // Handle logout
  const handleLogout = async () => {
    await logoutAdmin()
    router.push("/admin/login")
  }

  // Skip admin layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between admin-mobile-container">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden admin-mobile-button"
              onClick={() => setSidebarOpen(true)}
              id="menu-button"
            >
              <Menu className="h-5 w-5 admin-mobile-icon" />
              <span className="sr-only">Menu</span>
            </Button>
            <Link href="/admin/dashboard" className="font-semibold text-lg text-teal-600 admin-mobile-text">
              JengjangKarir Admin
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="admin-mobile-button" onClick={() => window.open("/", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2 admin-mobile-icon" />
              <span className="admin-mobile-text">Lihat Website</span>
            </Button>
            <Button variant="outline" size="sm" className="admin-mobile-button" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2 admin-mobile-icon" />
              <span className="admin-mobile-text">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <div id="mobile-sidebar" className={cn("fixed inset-0 z-40 md:hidden", sidebarOpen ? "block" : "hidden")}>
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity",
              sidebarOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl transform transition-transform admin-mobile-sidebar",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/admin/dashboard" className="font-semibold text-lg text-teal-600 admin-mobile-text">
                JengjangKarir Admin
              </Link>
              <Button variant="ghost" size="icon" className="admin-mobile-button" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 admin-mobile-icon" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="w-64 border-r bg-white hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden admin-mobile-container">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent() {
  return (
    <nav className="p-4 space-y-2 admin-mobile-container">
      <NavLink href="/admin/dashboard" icon={<LayoutDashboard className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Dashboard
      </NavLink>
      <NavLink href="/admin/jobs" icon={<Briefcase className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Lowongan Kerja
      </NavLink>
      <NavLink href="/admin/companies" icon={<Building className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Perusahaan
      </NavLink>
      <NavLink href="/admin/categories" icon={<Tag className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Kategori
      </NavLink>
      <NavLink href="/admin/articles" icon={<FileText className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Artikel
      </NavLink>
      <NavLink href="/admin/seed" icon={<Database className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Seed Database
      </NavLink>
      <NavLink href="/admin/diagnostics" icon={<Activity className="h-4 w-4 mr-2 admin-mobile-icon" />}>
        Diagnostics
      </NavLink>
    </nav>
  )
}

interface NavLinkProps {
  href: string
  icon?: React.ReactNode
  children: React.ReactNode
}

function NavLink({ href, icon, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 transition-colors",
        "text-sm font-medium admin-mobile-text",
        isActive && "bg-teal-50 text-teal-600",
      )}
    >
      {icon}
      {children}
    </Link>
  )
}
