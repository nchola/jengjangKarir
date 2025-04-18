import { setupInitialAdmin } from "@/lib/auth-actions"
import { NextResponse } from "next/server"

export async function GET() {
  // Hanya untuk penggunaan development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { success: false, message: "Route ini hanya tersedia di mode development" },
      { status: 403 },
    )
  }

  const result = await setupInitialAdmin()
  return NextResponse.json(result)
}
