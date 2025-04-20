"use client"
import Link from "next/link"
import { Instagram, Linkedin, ArrowRight, Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingClock from "@/components/LoadingClock"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-3 py-8 sm:py-12 relative">
        {/* Newsletter section */}
        <div className="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-xl p-4 sm:p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Dapatkan Lowongan Terbaru</h3>
              <p className="text-white/80 text-xs sm:text-sm">
                Berlangganan newsletter kami untuk mendapatkan info lowongan terbaru.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Email Anda"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-10"
              />
              <Button className="bg-white text-indigo-600 hover:bg-white/90 h-10 text-xs sm:text-sm">
                Berlangganan <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer content - horizontal layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 sm:col-span-1">
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
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-purple-600 p-1.5 rounded-full text-white hover:bg-purple-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 transition-colors"
                aria-label="Telegram"
              >
                <MessageSquare size={16} />
              </a>
              <a
                href="mailto:info@jenjangkarir.id"
                className="bg-pink-500 p-1.5 rounded-full text-white hover:bg-pink-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="tel:+6281234567890"
                className="bg-green-500 p-1.5 rounded-full text-white hover:bg-green-600 transition-colors"
                aria-label="Phone"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-teal-400">Untuk Pencari Kerja</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm">
                  <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                  Cari Lowongan
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm"
                >
                  <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                  Perusahaan
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm"
                >
                  <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                  Artikel Karir
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-teal-400">Untuk Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/post-job"
                  className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm"
                >
                  <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                  Pasang Lowongan
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-teal-400 flex items-center text-xs sm:text-sm"
                >
                  <ArrowRight className="mr-1 h-3 w-3 text-teal-500" />
                  Harga Layanan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-3 sm:mb-0">
            &copy; {new Date().getFullYear()} JenjangKarir. Hak Cipta Dilindungi.
          </p>
          <LoadingClock />
        </div>
      </div>
    </footer>
  )
}

export default Footer
