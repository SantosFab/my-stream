"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"

export type TmdbMeState =
  | { status: "loading" }
  | { status: "out" }
  | { status: "in"; username: string }

export function useTmdbMe(): {
  me: TmdbMeState
  signOut: () => Promise<void>
} {
  const router = useRouter()
  const [me, setMe] = useState<TmdbMeState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    fetch("/api/tmdb/me")
      .then(async (res) => {
        if (cancelled) return
        if (!res.ok) {
          setMe({ status: "out" })
          return
        }
        const data = (await res.json()) as { username?: string }
        setMe({ status: "in", username: data.username ?? "TMDB" })
      })
      .catch(() => {
        if (!cancelled) setMe({ status: "out" })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const signOut = useCallback(async () => {
    await fetch("/api/auth/tmdb/logout", { method: "POST" }).catch(() => null)
    setMe({ status: "out" })
    router.refresh()
  }, [router])

  return { me, signOut }
}

export function TmdbAuthButton() {
  const { me, signOut } = useTmdbMe()

  if (me.status === "loading") return null

  if (me.status === "out") {
    return (
      <Button
        size="sm"
        variant="outline"
        className="hidden shrink-0 sm:inline-flex"
        onClick={() => {
          window.location.href = "/api/auth/tmdb/start"
        }}
      >
        Connect TMDB
      </Button>
    )
  }

  return (
    <div className="hidden shrink-0 items-center gap-2 sm:flex">
      <Link
        href="/watchlist"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Watchlist
      </Link>
      <Link
        href="/favorites"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Favorites
      </Link>
      <span className="max-w-24 truncate text-xs text-muted-foreground">
        {me.username}
      </span>
      <Button size="sm" variant="ghost" onClick={signOut}>
        Sign out
      </Button>
    </div>
  )
}
