"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingClock from "@/components/LoadingClock"
import { SocialMedia } from "./SocialMedia"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-3 py-8 sm:py-12 relative">
        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl sm:text-2xl font-bold">
                <span className="text-teal-400">Jenjang</span>
                <span className="text-white">Karir</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 text-xs sm:text-sm">
              Platform lowongan kerja terpercaya yang menghubungkan pencari kerja dengan perusahaan terbaik di
              Indonesia.
            </p>
            <SocialMedia />
          </div>

          {/* Newsletter section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-teal-400">Newsletter</h3>
            <p className="text-gray-400 text-xs mb-3">
              Dapatkan info lowongan terbaru langsung ke email Anda.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Email Anda"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-8 text-xs w-full"
              />
              <Button className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 h-8 text-xs w-full">
                Berlangganan <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 border-t border-gray-800">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 py-8">
            <div>
              <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-teal-400">Informasi</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-teal-400">Untuk Pencari Kerja</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/jobs" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Cari Lowongan
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Perusahaan
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Artikel Karir
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 sm:mb-4 text-teal-400">Untuk Perusahaan</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/post-job" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Pasang Lowongan
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                    <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                    Harga Layanan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} JenjangKarir. Hak Cipta Dilindungi.
          </p>
          <LoadingClock />
        </div>
      </div>
    </footer>
  )
}

export default Footer
