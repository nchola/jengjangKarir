"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/user-actions"

// Form validation schema
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)

    try {
      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })

      if (result.success) {
        toast({
          title: "Registrasi berhasil",
          description: "Silakan login dengan akun yang telah dibuat",
        })
        router.push("/login")
      } else {
        toast({
          title: "Registrasi gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Daftar Akun</h1>
        <p className="text-gray-500">Buat akun untuk melamar pekerjaan dan menyimpan lowongan favorit</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            placeholder="Masukkan nama lengkap"
            {...form.register("fullName")}
            disabled={isLoading}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@example.com"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...form.register("password")}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...form.register("confirmPassword")}
            disabled={isLoading}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <Button variant="link" className="p-0" onClick={() => router.push("/login")}>
          Login
        </Button>
      </div>
    </div>
  )
}
