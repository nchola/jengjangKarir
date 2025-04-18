"use client"

import { useSupabaseConnection } from "@/components/supabase-provider"
import { AlertTriangle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function MockDataNotice() {
  const { isConnected } = useSupabaseConnection()
  const [dismissed, setDismissed] = useState(false)

  // Only show on diagnostics page
  const isDiagnosticsPage = typeof window !== "undefined" && window.location.pathname.includes("/admin/diagnostics")

  if (isConnected || dismissed || !isDiagnosticsPage) {
    return null
  }

  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <div className="flex-1">
        <AlertTitle className="text-amber-800 flex items-center">
          <Database className="h-4 w-4 mr-1" /> Using Mock Data Mode
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          <p>
            The application is currently using mock data because a database connection could not be established. All
            functionality will work, but changes will not be persisted between sessions.
          </p>
          <div className="mt-2 text-sm">
            <Button
              variant="outline"
              size="sm"
              className="text-amber-700 border-amber-300 hover:bg-amber-100 hover:text-amber-800"
              onClick={() => setDismissed(true)}
            >
              Dismiss
            </Button>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  )
}
