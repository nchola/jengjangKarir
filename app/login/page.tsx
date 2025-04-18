import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Login - JenjangKarir",
  description: "Masuk ke akun JenjangKarir Anda",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
