import { NextResponse } from "next/server"
import {
  TMDB_SESSION_COOKIE,
  TMDB_USER_COOKIE,
  createSession,
  getAccount,
} from "@/lib/tmdb-account"

const THIRTY_DAYS = 60 * 60 * 24 * 30

export async function GET(req: Request) {
  const url = new URL(req.url)
  const requestToken = url.searchParams.get("request_token")

  if (!requestToken) {
    return NextResponse.redirect(new URL("/?tmdb=denied", url.origin))
  }

  try {
    const sessionId = await createSession(requestToken)
    const account = await getAccount(sessionId)

    const res = NextResponse.redirect(new URL("/?tmdb=connected", url.origin))
    const secure = process.env.NODE_ENV === "production"
    res.cookies.set(TMDB_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: THIRTY_DAYS,
    })
    res.cookies.set(TMDB_USER_COOKIE, account.username || `user-${account.id}`, {
      httpOnly: false,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: THIRTY_DAYS,
    })
    return res
  } catch {
    return NextResponse.redirect(new URL("/?tmdb=error", url.origin))
  }
}
