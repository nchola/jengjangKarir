"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Briefcase, 
  Building, 
  Tag, 
  LayoutDashboard, 
  FileText, 
  Database, 
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    <motion.aside
      initial={{ width: "16rem" }}
      animate={{ width: isCollapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4 relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <motion.div
            key={item.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                pathname === item.href
                  ? "bg-teal-50 text-teal-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-teal-600",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn("mr-3", isCollapsed && "mr-0")}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  )
}
