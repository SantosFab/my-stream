"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"

type MeState =
  | { status: "loading" }
  | { status: "out" }
  | { status: "in"; username: string }

export function TmdbAuthButton() {
  const router = useRouter()
  const [me, setMe] = useState<MeState>({ status: "loading" })

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

  async function handleLogout() {
    await fetch("/api/auth/tmdb/logout", { method: "POST" }).catch(() => null)
    setMe({ status: "out" })
    router.refresh()
  }

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
      <Button size="sm" variant="ghost" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  )
}
