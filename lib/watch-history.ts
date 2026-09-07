"use client"

import { useCallback, useEffect, useState } from "react"

export type WatchItemBase = {
  updatedAt: number
  poster_path: string | null
  backdrop_path: string | null
}

export type MovieWatchItem = WatchItemBase & {
  type: "movie"
  id: number
  title: string
}

export type TVWatchItem = WatchItemBase & {
  type: "tv"
  id: number
  name: string
  season: number
  episode: number
  episodeName?: string
}

export type WatchItem = MovieWatchItem | TVWatchItem

const STORAGE_KEY = "cinestream:watch-history:v1"
const MAX_ITEMS = 30

function isBrowser() {
  return typeof window !== "undefined"
}

function readRaw(): WatchItem[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as WatchItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "number" &&
        (item.type === "movie" || item.type === "tv")
    )
  } catch {
    return []
  }
}

function writeRaw(items: WatchItem[]) {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_ITEMS))
    )
  } catch {
    // storage full ou indisponível: ignora silenciosamente
  }
}

function sortByRecent(items: WatchItem[]): WatchItem[] {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getHistory(): WatchItem[] {
  return sortByRecent(readRaw())
}

export function getResumeFor(
  type: WatchItem["type"],
  id: number
): WatchItem | undefined {
  return readRaw().find((item) => item.type === type && item.id === id)
}

export function saveMovie(movie: {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
}): WatchItem[] {
  const now = Date.now()
  const next: MovieWatchItem = {
    type: "movie",
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    updatedAt: now,
  }
  const rest = readRaw().filter(
    (item) => !(item.type === "movie" && item.id === movie.id)
  )
  const items = sortByRecent([next, ...rest]).slice(0, MAX_ITEMS)
  writeRaw(items)
  return items
}

export function saveEpisode(
  tv: {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  },
  season: number,
  episode: number,
  episodeName?: string
): WatchItem[] {
  const now = Date.now()
  const next: TVWatchItem = {
    type: "tv",
    id: tv.id,
    name: tv.name,
    season,
    episode,
    episodeName,
    poster_path: tv.poster_path,
    backdrop_path: tv.backdrop_path,
    updatedAt: now,
  }
  const rest = readRaw().filter(
    (item) => !(item.type === "tv" && item.id === tv.id)
  )
  const items = sortByRecent([next, ...rest]).slice(0, MAX_ITEMS)
  writeRaw(items)
  return items
}

export function removeItem(
  type: WatchItem["type"],
  id: number
): WatchItem[] {
  const items = readRaw().filter(
    (item) => !(item.type === type && item.id === id)
  )
  writeRaw(items)
  return sortByRecent(items)
}

export function clearHistory(): WatchItem[] {
  writeRaw([])
  return []
}

export function getResumeHref(item: WatchItem): string {
  if (item.type === "movie") return `/watch/movie/${item.id}`
  return `/watch/tv/${item.id}?season=${item.season}&episode=${item.episode}`
}

export function getDetailHref(item: WatchItem): string {
  if (item.type === "movie") return `/movie/${item.id}`
  return `/tv/${item.id}`
}

export function useWatchHistory() {
  const [items, setItems] = useState<WatchItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getHistory())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isBrowser()) return
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setItems(getHistory())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const refresh = useCallback(() => setItems(getHistory()), [])

  const remove = useCallback((type: WatchItem["type"], id: number) => {
    setItems(removeItem(type, id))
  }, [])

  const clear = useCallback(() => setItems(clearHistory()), [])

  return { items, mounted, refresh, remove, clear }
}
