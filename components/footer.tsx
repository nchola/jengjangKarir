import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Newsletter section */}
        <div className="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl p-8 mb-16 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Dapatkan Lowongan Terbaru</h3>
              <p className="text-white/80">
                Berlangganan newsletter kami untuk mendapatkan info lowongan terbaru dan tips karir.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Email Anda"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12"
              />
              <Button className="bg-white text-indigo-600 hover:bg-white/90 h-12">
                Berlangganan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold">
                <span className="text-teal-400">Jenjang</span>
                <span className="text-white">Karir</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Platform lowongan kerja terpercaya yang menghubungkan pencari kerja dengan perusahaan terbaik di
              Indonesia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-teal-500 transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-teal-500 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-teal-500 transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-teal-500 transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-teal-400">Untuk Pencari Kerja</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-teal-400 flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-teal-500" />
                  Cari Lowongan
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-400 hover:text-teal-400 flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-teal-500" />
                  Perusahaan
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-teal-400 flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-teal-500" />
                  Artikel Karir
                </Link>
              </li>
              <li>
                <Link href="/salary" className="text-gray-400 hover:text-teal-400 flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-teal-500" />
                  Info Gaji
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-teal-400">Untuk Perusahaan</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/post-job" className="text-gray-400 hover:text-teal-400 flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 text-teal-500" />
                  Pasang Lowongan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-teal-400">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-teal-500 mt-0.5" />
                <span className="text-gray-400">info@jenjangkarir.id</span>
              </li>
              <li>
                <p className="text-gray-400">
                  Jl. HR. Rasuna Said Kav. C-22,
                  <br />
                  Jakarta Selatan, 12940
                  <br />
                  Indonesia
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} JenjangKarir. Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link href="/about" className="text-gray-500 hover:text-teal-400 text-sm">
              Tentang Kami
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-teal-400 text-sm">
              Hubungi Kami
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-teal-400 text-sm">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-teal-400 text-sm">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
