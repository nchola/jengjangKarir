"use client"

import { useSupabaseConnection } from "@/components/supabase-provider"
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DatabaseStatus() {
  const { isConnected, error } = useSupabaseConnection()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  // Only show on diagnostics page
  const isDiagnosticsPage = typeof window !== "undefined" && window.location.pathname.includes("/admin/diagnostics")

  if (!isDiagnosticsPage) {
    return null
  }

  if (isConnected && !error) {
    return (
      <div className="flex items-center text-sm text-green-600">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span>Database Connected</span>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-red-700">Database Connection Error</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" /> Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" /> Show Details
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
              >
                {showSetupGuide ? "Hide Setup Guide" : "Show Setup Guide"}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-2 text-sm text-red-600">
              <p className="font-medium">Error Message:</p>
              <pre className="mt-1 p-2 bg-red-100 rounded text-xs overflow-auto max-h-32">{error}</pre>

              <div className="mt-2">
                <p className="font-medium">Troubleshooting Steps:</p>
                <ol className="list-decimal ml-5 mt-1 space-y-1">
                  <li>Verify your Supabase URL and API keys are correct</li>
                  <li>Check if your Supabase project is active and running</li>
                  <li>Ensure your IP is allowed in Supabase's security settings</li>
                  <li>Try refreshing the page or logging out and back in</li>
                </ol>
              </div>
            </div>
          )}

          {showSetupGuide && (
            <div className="mt-3 p-3 bg-white rounded border border-red-100 text-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Supabase Setup Guide</h4>

              <ol className="list-decimal ml-5 space-y-3 text-gray-700">
                <li>
                  <p className="font-medium">Create a Supabase Project</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      supabase.com
                    </a>{" "}
                    and create a new project.
                  </p>
                </li>

                <li>
                  <p className="font-medium">Set up Environment Variables</p>
                  <p className="text-xs text-gray-600 mt-1">Add these environment variables to your project:</p>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co{"\n"}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key{"\n"}
                    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
                  </pre>
                </li>

                <li>
                  <p className="font-medium">Create Required Tables</p>
                  <p className="text-xs text-gray-600 mt-1">Run the following SQL in your Supabase SQL Editor:</p>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                    {`-- Create companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  location VARCHAR(255),
  website TEXT,
  company_size TEXT,
  background TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_categories table
CREATE TABLE job_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icon VARCHAR(50),
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  location VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  salary_display VARCHAR(255),
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  category_id INTEGER REFERENCES job_categories(id),
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  show_salary BOOLEAN DEFAULT TRUE,
  company_background TEXT
);`}
                  </pre>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
