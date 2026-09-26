import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCookieName, verifySessionValue } from "@/lib/site-auth"

// The TMDB connect flow (/api/auth/tmdb/*) is deliberately not public: it
// spends the site's TMDB token and must only run for signed-in visitors.
const PUBLIC_PATHS = ["/login", "/favicon.ico", "/api/auth/login", "/api/auth/logout"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/_next/") ||
    PUBLIC_PATHS.includes(pathname) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|map)$/)
  ) {
    return NextResponse.next()
  }

  const secret = process.env.SITE_AUTH_SECRET
  const value = req.cookies.get(getCookieName())?.value
  const ok = secret ? await verifySessionValue(secret, value) : false

  if (ok) return NextResponse.next()

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const loginUrl = new URL("/login", req.url)
  loginUrl.searchParams.set("next", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
