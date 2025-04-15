"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Briefcase, Building, Tag, LayoutDashboard, FileText, Database, Activity } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Lowongan",
      href: "/admin/jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Perusahaan",
      href: "/admin/companies",
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: "Kategori",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      name: "Artikel",
      href: "/admin/articles",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Seed Database",
      href: "/admin/seed",
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: "Diagnostics",
      href: "/admin/diagnostics",
      icon: <Activity className="h-5 w-5" />,
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
              pathname === item.href
                ? "bg-teal-50 text-teal-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-teal-600",
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
