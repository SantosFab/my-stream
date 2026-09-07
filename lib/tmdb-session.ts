import { cookies } from "next/headers"
import {
  TMDB_SESSION_COOKIE,
  getAccount,
  type TmdbAccount,
} from "@/lib/tmdb-account"

export type AuthedAccount = {
  sessionId: string
  account: TmdbAccount
}

/** Resolve the TMDB session + account from httpOnly cookies. Null when logged out. */
export async function requireTmdbAccount(): Promise<AuthedAccount | null> {
  const sessionId = (await cookies()).get(TMDB_SESSION_COOKIE)?.value
  if (!sessionId) return null
  try {
    const account = await getAccount(sessionId)
    return { sessionId, account }
  } catch {
    return null
  }
}
