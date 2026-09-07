import { NextResponse } from "next/server"
import {
  createSessionValue,
  getCookieName,
  verifyPassword,
} from "@/lib/site-auth"

const THIRTY_DAYS = 60 * 60 * 24 * 30

export async function POST(req: Request) {
  const secret = process.env.SITE_AUTH_SECRET
  const expectedHash = process.env.SITE_ACCESS_PASSWORD_HASH
  if (!secret || !expectedHash) {
    return NextResponse.json(
      { error: "Site access is not configured" },
      { status: 500 }
    )
  }

  let password = ""
  try {
    const body = (await req.json()) as { password?: unknown }
    password = typeof body.password === "string" ? body.password : ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!password || !(await verifyPassword(password, expectedHash))) {
    // Generic message: do not reveal whether the gate is misconfigured.
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: "Wrong password" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(getCookieName(), await createSessionValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  })
  return res
}
