import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const session = request.cookies.get("next-auth.session-token")
  const path = request.nextUrl.pathname

  if (!session && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const ROUTE_LIST = [
  "dashboard",
  "profile",
  "settings",
  "analytics",
  "configurations",
  "actions",
]

export const config = {
  matcher: [...ROUTE_LIST],
}
