import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!session && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  } else if (session && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/settings",
    "/analytics",
    "/configurations",
    "/actions",
    "/actions/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
}
