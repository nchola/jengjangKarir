import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin and is not the login page
  if (path.startsWith("/admin") && path !== "/admin/login") {
    // Check if the user is authenticated by looking for the adminLoggedIn cookie
    const adminLoggedIn = request.cookies.get("adminLoggedIn")?.value

    // If not authenticated, redirect to the login page
    if (!adminLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Check if the path starts with /dashboard and is not the login page
  if (path.startsWith("/dashboard") && path !== "/login") {
    // Check if the user is authenticated by looking for the userLoggedIn cookie
    const userLoggedIn = request.cookies.get("userLoggedIn")?.value

    // If not authenticated, redirect to the login page
    if (!userLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
