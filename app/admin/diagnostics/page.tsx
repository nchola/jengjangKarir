"use client"

import { useState, useEffect } from "react"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import AuthCheck from "@/components/admin/auth-check"

export default function DiagnosticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticResults, setDiagnosticResults] = useState<any>({})
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Running database diagnostics...")

      // Check connection
      const connectionTest = await supabase.from("companies").select("count()", { count: "exact" })

      // Get table counts
      const companiesCount = await supabase.from("companies").select("count()", { count: "exact" })
      const categoriesCount = await supabase.from("job_categories").select("count()", { count: "exact" })
      const jobsCount = await supabase.from("jobs").select("count()", { count: "exact" })

      // Get sample data
      const companiesSample = await supabase.from("companies").select("*").limit(3)
      const categoriesSample = await supabase.from("job_categories").select("*").limit(3)
      const jobsSample = await supabase.from("jobs").select("*").limit(3)

      // Check for errors
      const errors = []
      if (connectionTest.error) errors.push(`Connection error: ${connectionTest.error.message}`)
      if (companiesCount.error) errors.push(`Companies count error: ${companiesCount.error.message}`)
      if (categoriesCount.error) errors.push(`Categories count error: ${categoriesCount.error.message}`)
      if (jobsCount.error) errors.push(`Jobs count error: ${jobsCount.error.message}`)
      if (companiesSample.error) errors.push(`Companies sample error: ${companiesSample.error.message}`)
      if (categoriesSample.error) errors.push(`Categories sample error: ${categoriesSample.error.message}`)
      if (jobsSample.error) errors.push(`Jobs sample error: ${jobsSample.error.message}`)

      if (errors.length > 0) {
        setError(errors.join("\n"))
      }

      // Set results
      setDiagnosticResults({
        connection: connectionTest.error ? "Failed" : "Success",
        counts: {
          companies: companiesCount.count || 0,
          categories: categoriesCount.count || 0,
          jobs: jobsCount.count || 0,
        },
        samples: {
          companies: companiesSample.data || [],
          categories: categoriesSample.data || [],
          jobs: jobsSample.data || [],
        },
        timestamp: new Date().toISOString(),
      })

      console.log("Diagnostics complete:", diagnosticResults)
    } catch (err: any) {
      console.error("Error running diagnostics:", err)
      setError(err.message || "Unknown error occurred")
      toast({
        title: "Diagnostics Error",
        description: "Failed to run database diagnostics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Database Diagnostics</h1>
                <p className="text-gray-600">Check database connection and data status</p>
              </div>

              <Button onClick={runDiagnostics} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh Diagnostics
              </Button>
            </div>

            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-600 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Error Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-red-600 whitespace-pre-wrap text-sm">{error}</pre>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Checking...
                    </div>
                  ) : (
                    <div
                      className={`font-bold ${diagnosticResults.connection === "Success" ? "text-green-600" : "text-red-600"}`}
                    >
                      {diagnosticResults.connection}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Counting...
                    </div>
                  ) : (
                    <div className="font-bold text-xl">{diagnosticResults.counts?.companies || 0}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Counting...
                    </div>
                  ) : (
                    <div className="font-bold text-xl">{diagnosticResults.counts?.categories || 0}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Counting...
                    </div>
                  ) : (
                    <div className="font-bold text-xl">{diagnosticResults.counts?.jobs || 0}</div>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">NEXT_PUBLIC_SUPABASE_URL:</span>{" "}
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set"}
                    </div>
                    <div>
                      <span className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{" "}
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {!isLoading && diagnosticResults.samples && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Data</CardTitle>
                      <CardDescription>Showing up to 3 records from each table</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-2">Companies</h3>
                          {diagnosticResults.samples.companies.length > 0 ? (
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40">
                              {JSON.stringify(diagnosticResults.samples.companies, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500">No company records found</p>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Categories</h3>
                          {diagnosticResults.samples.categories.length > 0 ? (
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40">
                              {JSON.stringify(diagnosticResults.samples.categories, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500">No category records found</p>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Jobs</h3>
                          {diagnosticResults.samples.jobs.length > 0 ? (
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40">
                              {JSON.stringify(diagnosticResults.samples.jobs, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500">No job records found</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
