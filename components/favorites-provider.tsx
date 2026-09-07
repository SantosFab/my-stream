"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type MediaKind = "movie" | "tv"

type FavoritesContextValue = {
  /** null while the TMDB connection / favorites are still loading */
  connected: boolean | null
  isFavorite: (type: MediaKind, id: number) => boolean
  toggleFavorite: (type: MediaKind, id: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue>({
  connected: null,
  isFavorite: () => false,
  toggleFavorite: () => {},
})

export function useFavorites() {
  return useContext(FavoritesContext)
}

type ListPage = {
  page: number
  results: { id: number }[]
  total_pages: number
}

async function fetchAllFavoriteIds(kind: MediaKind): Promise<Set<number>> {
  const ids = new Set<number>()
  // Cap pages as a safety net; single-user lists rarely exceed this.
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `/api/tmdb/list?kind=favorite&type=${kind}&page=${page}`
    )
    if (!res.ok) throw new Error("list")
    const data = (await res.json()) as ListPage
    for (const item of data.results ?? []) {
      if (typeof item.id === "number") ids.add(item.id)
    }
    if (page >= (data.total_pages || 1)) break
  }
  return ids
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [movieIds, setMovieIds] = useState<Set<number>>(new Set())
  const [tvIds, setTvIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const me = await fetch("/api/tmdb/me")
        if (!me.ok) {
          if (!cancelled) setConnected(false)
          return
        }
        const [movies, tv] = await Promise.all([
          fetchAllFavoriteIds("movie"),
          fetchAllFavoriteIds("tv"),
        ])
        if (cancelled) return
        setMovieIds(movies)
        setTvIds(tv)
        setConnected(true)
      } catch {
        if (!cancelled) setConnected(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const isFavorite = useCallback(
    (type: MediaKind, id: number) =>
      (type === "movie" ? movieIds : tvIds).has(id),
    [movieIds, tvIds]
  )

  const toggleFavorite = useCallback(
    (type: MediaKind, id: number) => {
      const setIds = type === "movie" ? setMovieIds : setTvIds
      const currently = (type === "movie" ? movieIds : tvIds).has(id)

      // Optimistic update with rollback on failure.
      setIds((prev) => {
        const next = new Set(prev)
        if (currently) next.delete(id)
        else next.add(id)
        return next
      })

      fetch("/api/tmdb/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "favorite",
          media_type: type,
          media_id: id,
          value: !currently,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            setConnected(false)
            return
          }
          if (!res.ok) throw new Error("toggle")
        })
        .catch(() => {
          setIds((prev) => {
            const next = new Set(prev)
            if (currently) next.add(id)
            else next.delete(id)
            return next
          })
        })
    },
    [movieIds, tvIds]
  )

  const value = useMemo(
    () => ({ connected, isFavorite, toggleFavorite }),
    [connected, isFavorite, toggleFavorite]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
