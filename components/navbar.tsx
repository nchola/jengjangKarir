"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const navItems = [
    { name: "Beranda", href: "/" },
    {
      name: "Lowongan",
      href: "/jobs",
      dropdown: [
        { name: "Semua Lowongan", href: "/jobs" },
        { name: "Lowongan IT", href: "/jobs/it" },
        { name: "Lowongan Finance", href: "/jobs/finance" },
        { name: "Lowongan Marketing", href: "/jobs/marketing" },
      ],
    },
    { name: "Perusahaan", href: "/companies" },
    { name: "Artikel", href: "/articles" },
    { name: "Tentang Kami", href: "/about" },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl">
              <span className="text-teal-500">Jenjang</span>
              <span className="text-indigo-600">Karir</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center"
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link href={item.href} className="px-3 py-2 text-gray-700 hover:text-blue-600">
                      {item.name}
                    </Link>
                  )}

                  {item.dropdown && (
                    <div
                      className={cn(
                        "absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 transition-all duration-200 transform origin-top-left",
                        activeDropdown === item.name
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0 pointer-events-none",
                      )}
                    >
                      <div className="py-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <Button variant="outline" className="mr-2">
              Masuk
            </Button>
            <Button>Daftar</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center justify-between"
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  {activeDropdown === item.name && (
                    <div className="pl-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5 space-x-2">
            <Button variant="outline" className="w-full">
              Masuk
            </Button>
            <Button className="w-full">Daftar</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
