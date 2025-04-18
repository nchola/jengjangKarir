import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const companyId = Number.parseInt(params.id)

    if (isNaN(companyId)) {
      return NextResponse.json({ error: "Invalid company ID" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Count active jobs for this company
    const { count, error } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("status", "active")

    if (error) {
      console.error("Error counting jobs:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error("Error in job count API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
