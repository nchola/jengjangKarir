import { Button } from "@/components/ui/button"
import Link from "next/link"
import Text3DScene from './Text3DClient'
import { InstallButton } from "./InstallButton"
import { SocialMedia } from "./SocialMedia"

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-teal-500">
      {/* Abstract shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>

      {/* Animated arrow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
        <svg 
          width="200" 
          height="20" 
          viewBox="0 0 200 20" 
          className="animate-bounce opacity-50"
        >
          <path 
            d="M100 20 L90 10 L110 10 Z" 
            fill="none" 
            stroke="white" 
            strokeWidth="2"
            className="animate-pulse"
          />
          <path 
            d="M0 10 H200" 
            stroke="white" 
            strokeWidth="2"
            strokeDasharray="2 4"
            className="animate-wave"
          />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 py-8 md:py-16 lg:py-24 pb-28 sm:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-white">
                <span className="text-teal-400">Jenjang</span>
                <span className="text-white">Karir</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 font-light">
                Temukan langkah berikutnya dalam perjalanan karirmu bersama ribuan perusahaan terpercaya
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-white/70">
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold text-teal-400">10K+</span>
                <span className="text-xs">Lowongan</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold text-teal-400">5K+</span>
                <span className="text-xs">Perusahaan</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold text-teal-400">2M+</span>
                <span className="text-xs">Pengguna</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/jobs">
                <Button size="default" className="bg-teal-500 hover:bg-teal-600 text-white border-0 w-full sm:w-auto">
                  Cari Lowongan
                </Button>
              </Link>
              <div className="block sm:hidden">
                <InstallButton />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a href="mailto:info@jenjangkarir.com" className="flex items-center gap-2 text-white/80 hover:text-teal-400 transition-colors text-sm">
                  <span>info@jenjangkarir.com</span>
                </a>
                <SocialMedia className="mt-2 sm:mt-0" />
                
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative rounded-2xl">
              <Text3DScene className="rounded-lg" />
              <div className="absolute -bottom-6 -right-6 bg-teal-500 text-white p-4 rounded-lg shadow-lg">
                <p className="font-bold text-sm lg:text-base">Mulai Karir Impianmu</p>
                <p className="text-xs lg:text-sm">Ribuan lowongan menunggumu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
