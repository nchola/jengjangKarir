"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, AlertTriangle, Database } from "lucide-react"
import { useSupabase, useSupabaseConnection } from "@/components/supabase-provider"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const supabase = useSupabase()
  const { isConnected, error: connectionError } = useSupabaseConnection()

  useEffect(() => {
    if (connectionError) {
      toast({
        title: "Database Connection Error",
        description: connectionError,
        variant: "destructive",
      })
    }
  }, [connectionError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simple admin authentication - in a real app, use proper authentication
      if (email === "admin@example.com" && password === "admin123") {
        // Set a session cookie to indicate logged in state
        document.cookie = "adminLoggedIn=true; path=/; max-age=86400" // 24 hours

        toast({
          title: "Login berhasil",
          description: "Selamat datang di dashboard admin",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login gagal",
          description: "Email atau password salah",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Masuk ke dashboard admin untuk mengelola lowongan pekerjaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Database Connection Error</p>
                <p className="text-sm text-red-600">{connectionError}</p>
                <p className="text-xs text-red-500 mt-1">
                  You can still log in, but some features may not work properly.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-500">
          <p className="w-full">
            Untuk demo, gunakan email: <span className="font-semibold">admin@example.com</span> dan password:{" "}
            <span className="font-semibold">admin123</span>
          </p>

          <div className="flex items-center justify-center text-xs pt-2">
            <Database className="h-3 w-3 mr-1" />
            <span>
              Database Status:{" "}
              {isConnected ? (
                <span className="text-green-600 font-medium">Connected</span>
              ) : (
                <span className="text-red-600 font-medium">Disconnected</span>
              )}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
