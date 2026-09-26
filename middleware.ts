import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "better-auth.session_token"

const PROTECTED_PREFIXES = [
  "/main",
  "/portfolio",
  "/position",
  "/transaction",
  "/statement",
  "/benchmark",
  "/bank",
  "/fund",
  "/category",
  "/quota",
  "/user",
  "/audit",
  "/norm",
  "/application",
  "/withdrawal",
]

const AUTH_ROUTES = ["/sign-in", "/sign-up"]

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE)

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (!hasSession && isProtected) {
    const url = new URL("/sign-in", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
