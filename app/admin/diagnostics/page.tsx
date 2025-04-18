"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import AuthCheck from "@/components/admin/auth-check"
import DatabaseStatus from "@/components/admin/database-status"
import MockDataNotice from "@/components/admin/mock-data-notice"

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

      // Check connection without using aggregate functions
      const connectionTest = await supabase.from("companies").select("id").limit(1)

      // Get table counts without using aggregate functions
      const companiesData = await supabase.from("companies").select("id")
      const categoriesData = await supabase.from("job_categories").select("id")
      const jobsData = await supabase.from("jobs").select("id")

      // Get sample data
      const companiesSample = await supabase.from("companies").select("*").limit(3)
      const categoriesSample = await supabase.from("job_categories").select("*").limit(3)
      const jobsSample = await supabase.from("jobs").select("*").limit(3)

      // Check for errors
      const errors = []
      if (connectionTest.error) errors.push(`Connection error: ${connectionTest.error.message}`)
      if (companiesData.error) errors.push(`Companies data error: ${companiesData.error.message}`)
      if (categoriesData.error) errors.push(`Categories data error: ${categoriesData.error.message}`)
      if (jobsData.error) errors.push(`Jobs data error: ${jobsData.error.message}`)
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
          companies: companiesData.data?.length || 0,
          categories: categoriesData.data?.length || 0,
          jobs: jobsData.data?.length || 0,
        },
        samples: {
          companies: companiesSample.data || [],
          categories: categoriesSample.data || [],
          jobs: jobsSample.data || [],
        },
        timestamp: new Date().toISOString(),
      })

      console.log("Diagnostics complete")
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
        <div className="flex">
          <main className="flex-1 p-6 admin-mobile-container">
            <div className="mb-6 flex justify-between items-center admin-mobile-spacing">
              <div>
                <h1 className="text-2xl font-bold admin-mobile-heading">Database Diagnostics</h1>
                <p className="text-gray-600 admin-mobile-text">Check database connection and data status</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={runDiagnostics} disabled={isLoading} variant="outline" className="admin-mobile-button">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin admin-mobile-icon" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4 admin-mobile-icon" />
                  )}
                  <span className="admin-mobile-text">Refresh Diagnostics</span>
                </Button>
              </div>
            </div>

            {/* Database Status */}
            <div className="mb-6 admin-mobile-spacing">
              <DatabaseStatus />
            </div>

            {/* Mock Data Notice */}
            <MockDataNotice />

            {error && (
              <Card className="mb-6 border-red-200 bg-red-50 admin-mobile-card">
                <CardHeader className="pb-2 admin-mobile-container">
                  <CardTitle className="text-red-600 flex items-center admin-mobile-heading">
                    <AlertCircle className="mr-2 h-5 w-5 admin-mobile-icon" />
                    Error Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-red-600 whitespace-pre-wrap text-sm admin-mobile-text">{error}</pre>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 admin-mobile-spacing">
              <Card className="admin-mobile-card">
                <CardHeader className="pb-2 admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading">Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2 admin-mobile-icon" />
                      <span className="admin-mobile-text">Checking...</span>
                    </div>
                  ) : (
                    <div
                      className={`font-bold admin-mobile-text ${
                        diagnosticResults.connection === "Success" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {diagnosticResults.connection}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="pb-2 admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading">Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2 admin-mobile-icon" />
                      <span className="admin-mobile-text">Counting...</span>
                    </div>
                  ) : (
                    <div className="font-bold text-xl admin-mobile-heading">
                      {diagnosticResults.counts?.companies || 0}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="pb-2 admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2 admin-mobile-icon" />
                      <span className="admin-mobile-text">Counting...</span>
                    </div>
                  ) : (
                    <div className="font-bold text-xl admin-mobile-heading">
                      {diagnosticResults.counts?.categories || 0}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="admin-mobile-card">
                <CardHeader className="pb-2 admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading">Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2 admin-mobile-icon" />
                      <span className="admin-mobile-text">Counting...</span>
                    </div>
                  ) : (
                    <div className="font-bold text-xl admin-mobile-heading">{diagnosticResults.counts?.jobs || 0}</div>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2 admin-mobile-card">
                <CardHeader className="pb-2 admin-mobile-container">
                  <CardTitle className="admin-mobile-subheading">Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm admin-mobile-text">
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

            <div className="grid grid-cols-1 gap-6 admin-mobile-spacing">
              {!isLoading && diagnosticResults.samples && (
                <>
                  <Card className="admin-mobile-card">
                    <CardHeader className="admin-mobile-container">
                      <CardTitle className="admin-mobile-subheading">Sample Data</CardTitle>
                      <CardDescription className="admin-mobile-text">
                        Showing up to 3 records from each table
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6 admin-mobile-spacing">
                        <div>
                          <h3 className="font-semibold mb-2 admin-mobile-text">Companies</h3>
                          {diagnosticResults.samples.companies.length > 0 ? (
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40 admin-mobile-text">
                              {JSON.stringify(diagnosticResults.samples.companies, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500 admin-mobile-text">No company records found</p>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 admin-mobile-text">Categories</h3>
                          {diagnosticResults.samples.categories.length > 0 ? (
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40 admin-mobile-text">
                              {JSON.stringify(diagnosticResults.samples.categories, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500 admin-mobile-text">No category records found</p>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 admin-mobile-text">Jobs</h3>
                          {diagnosticResults.samples.jobs.length > 0 ? (
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-40 admin-mobile-text">
                              {JSON.stringify(diagnosticResults.samples.jobs, null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500 admin-mobile-text">No job records found</p>
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
