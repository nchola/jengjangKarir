import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900">
      {/* Abstract shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                <span className="text-teal-400">Jenjang</span>
                <span className="text-white">Karir</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light">
                Temukan langkah berikutnya dalam perjalanan karirmu bersama ribuan perusahaan terpercaya
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white border-0 h-14 px-8 text-lg">
                  Cari Lowongan
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white bg-transparent hover:bg-white/10 h-14 px-8 text-lg transition-all duration-300"
              >
                Pasang Lowongan
              </Button>
            </div>

            <div className="flex items-center gap-6 text-white/70">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-teal-400">10K+</span>
                <span className="text-sm">Lowongan</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-teal-400">5K+</span>
                <span className="text-sm">Perusahaan</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-teal-400">2M+</span>
                <span className="text-sm">Pengguna</span>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Career illustration"
                width={500}
                height={400}
                className="rounded-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-teal-500 text-white p-4 rounded-lg shadow-lg">
                <p className="font-bold">Mulai Karir Impianmu</p>
                <p className="text-sm">Ribuan lowongan menunggumu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
