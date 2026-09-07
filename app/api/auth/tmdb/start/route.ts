import { NextResponse } from "next/server"
import { approveUrl, createRequestToken } from "@/lib/tmdb-account"

export async function GET(req: Request) {
  try {
    const token = await createRequestToken()
    const callbackUrl = new URL("/api/auth/tmdb/callback", req.url).toString()
    return NextResponse.redirect(approveUrl(token, callbackUrl))
  } catch {
    return NextResponse.json(
      { error: "Could not start TMDB login" },
      { status: 502 }
    )
  }
}
