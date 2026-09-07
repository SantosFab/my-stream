"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS, parseGenreFilter } from "@/lib/tmdb"
import type { Genre } from "@/lib/types"

export type FilterMode = "movie" | "tv"

type FilterBarProps = {
  mode: FilterMode
  genres: Genre[]
}

const MOVIE_SORT_LABELS: Record<string, string> = {
  "popularity.desc": "Most Popular",
  "popularity.asc": "Least Popular",
  "vote_average.desc": "Top Rated",
  "vote_average.asc": "Lowest Rated",
  "vote_count.desc": "Most Voted",
  "vote_count.asc": "Least Voted",
  "primary_release_date.desc": "Newest",
  "primary_release_date.asc": "Oldest",
  "title.asc": "Title A–Z",
  "title.desc": "Title Z–A",
  "original_title.asc": "Original Title A–Z",
  "original_title.desc": "Original Title Z–A",
  "revenue.desc": "Highest Revenue",
  "revenue.asc": "Lowest Revenue",
}

const TV_SORT_LABELS: Record<string, string> = {
  "popularity.desc": "Most Popular",
  "popularity.asc": "Least Popular",
  "vote_average.desc": "Top Rated",
  "vote_average.asc": "Lowest Rated",
  "vote_count.desc": "Most Voted",
  "vote_count.asc": "Least Voted",
  "first_air_date.desc": "Newest",
  "first_air_date.asc": "Oldest",
  "name.asc": "Name A–Z",
  "name.desc": "Name Z–A",
  "original_name.asc": "Original Name A–Z",
  "original_name.desc": "Original Name Z–A",
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "pt", label: "Portuguese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
]

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "BR", label: "Brazil" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "IN", label: "India" },
]

const RUNTIME_OPTIONS = [
  { value: "short", label: "Under 90 min" },
  { value: "medium", label: "90–150 min" },
  { value: "long", label: "150+ min" },
]

const MIN_RATING_OPTIONS = [
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
]

const MOVIE_RELEASE_TYPES = [
  { value: "1", label: "Premiere" },
  { value: "2", label: "Limited Theatrical" },
  { value: "3", label: "Theatrical" },
  { value: "4", label: "Digital" },
  { value: "5", label: "Physical" },
  { value: "6", label: "TV" },
]

const TV_STATUSES = [
  { value: "0", label: "Returning Series" },
  { value: "1", label: "Planned" },
  { value: "2", label: "In Production" },
  { value: "3", label: "Ended" },
  { value: "4", label: "Cancelled" },
  { value: "5", label: "Pilot" },
]

const TV_TYPES = [
  { value: "0", label: "Documentary" },
  { value: "1", label: "News" },
  { value: "2", label: "Miniseries" },
  { value: "3", label: "Reality" },
  { value: "4", label: "Scripted" },
  { value: "5", label: "Talk Show" },
  { value: "6", label: "Video" },
]

function yearOptions(): { value: string; label: string }[] {
  const current = new Date().getFullYear()
  return Array.from({ length: 41 }, (_, i) => {
    const y = current - i
    return { value: String(y), label: String(y) }
  })
}

const YEARS = yearOptions()

type GenreMode = "and" | "or"

export function FilterBar({ mode, genres }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expanded, setExpanded] = useState(false)

  const sortOptions = mode === "movie" ? MOVIE_SORT_OPTIONS : TV_SORT_OPTIONS
  const sortLabels = mode === "movie" ? MOVIE_SORT_LABELS : TV_SORT_LABELS

  const sort = searchParams.get("sort") ?? "popularity.desc"
  // `genres` holds comma (AND) or pipe (OR) separated ids; legacy `genre` is a single id
  const { ids: parsedGenreIds, mode: genreMode } = parseGenreFilter(
    searchParams.get("genres"),
    searchParams.get("genre")
  )
  const selectedGenres = parsedGenreIds.map(String)
  // Ignore ids that are not in the known genre list (e.g. hand-crafted URLs)
  const knownGenreIds = new Set(genres.map((g) => String(g.id)))
  const activeGenres = selectedGenres.filter((id) => knownGenreIds.has(id))
  const year = searchParams.get("year") ?? ""
  const minRating = searchParams.get("min_rating") ?? ""
  const runtime = searchParams.get("runtime") ?? ""
  const lang = searchParams.get("lang") ?? ""
  const country = searchParams.get("country") ?? ""
  const releaseType = searchParams.get("release_type") ?? ""
  const status = searchParams.get("status") ?? ""
  const showType = searchParams.get("type") ?? ""

  const activeCount = [
    activeGenres.length > 0 ? "x" : "",
    year,
    minRating,
    runtime,
    lang,
    country,
    mode === "movie" ? releaseType : "",
    mode === "tv" ? status : "",
    mode === "tv" ? showType : "",
  ].filter(Boolean).length

  function buildUrl(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    params.delete("page")
    const qs = params.toString()
    return qs ? `?${qs}` : "?"
  }

  function clearAll() {
    router.push("?")
  }

  function pushGenres(ids: string[], mode: GenreMode) {
    if (ids.length === 0) {
      router.push(buildUrl({ genres: null, genre: null }))
      return
    }
    router.push(
      buildUrl({ genres: ids.join(mode === "or" ? "|" : ","), genre: null })
    )
  }

  function toggleGenre(id: string) {
    const next = activeGenres.includes(id)
      ? activeGenres.filter((g) => g !== id)
      : [...activeGenres, id]
    pushGenres(next, genreMode)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={sortOptions.includes(sort as never) ? sort : "popularity.desc"}
          onValueChange={(v) => router.push(buildUrl({ sort: v }))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by">
              {sortLabels[sort] ?? "Most Popular"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {sortLabels[o] ?? o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
        >
          Filters
          {activeCount > 0 && (
            <Badge variant="default" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">
                Genres
                {activeGenres.length > 0 && ` (${activeGenres.length})`}
              </span>
              {activeGenres.length >= 2 && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={genreMode === "and" ? "default" : "outline"}
                    onClick={() => pushGenres(activeGenres, "and")}
                  >
                    Match all
                  </Button>
                  <Button
                    size="sm"
                    variant={genreMode === "or" ? "default" : "outline"}
                    onClick={() => pushGenres(activeGenres, "or")}
                  >
                    Match any
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => {
                const id = String(g.id)
                const selected = activeGenres.includes(id)
                return (
                  <Button
                    key={g.id}
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    onClick={() => toggleGenre(id)}
                  >
                    {g.name}
                  </Button>
                )
              })}
            </div>
          </div>

          <FilterSelect
            label="Year"
            allLabel="Any year"
            value={year || "any"}
            onChange={(v) =>
              router.push(buildUrl({ year: v === "any" ? null : v }))
            }
            options={YEARS}
            displayValue={year || "Any year"}
          />

          <FilterSelect
            label="Min rating"
            allLabel="Any rating"
            value={minRating || "any"}
            onChange={(v) =>
              router.push(buildUrl({ min_rating: v === "any" ? null : v }))
            }
            options={MIN_RATING_OPTIONS}
            displayValue={minRating ? `${minRating}+` : "Any rating"}
          />

          <FilterSelect
            label="Runtime"
            allLabel="Any length"
            value={runtime || "any"}
            onChange={(v) =>
              router.push(buildUrl({ runtime: v === "any" ? null : v }))
            }
            options={RUNTIME_OPTIONS}
            displayValue={
              RUNTIME_OPTIONS.find((o) => o.value === runtime)?.label ??
              "Any length"
            }
          />

          <FilterSelect
            label="Language"
            allLabel="Any language"
            value={lang || "any"}
            onChange={(v) =>
              router.push(buildUrl({ lang: v === "any" ? null : v }))
            }
            options={LANGUAGES}
            displayValue={
              LANGUAGES.find((o) => o.value === lang)?.label ?? "Any language"
            }
          />

          <FilterSelect
            label="Country"
            allLabel="Any country"
            value={country || "any"}
            onChange={(v) =>
              router.push(buildUrl({ country: v === "any" ? null : v }))
            }
            options={COUNTRIES}
            displayValue={
              COUNTRIES.find((o) => o.value === country)?.label ??
              "Any country"
            }
          />

          {mode === "movie" && (
            <FilterSelect
              label="Release type"
              allLabel="Any release"
              value={releaseType || "any"}
              onChange={(v) =>
                router.push(
                  buildUrl({ release_type: v === "any" ? null : v })
                )
              }
              options={MOVIE_RELEASE_TYPES}
              displayValue={
                MOVIE_RELEASE_TYPES.find((o) => o.value === releaseType)
                  ?.label ?? "Any release"
              }
            />
          )}

          {mode === "tv" && (
            <>
              <FilterSelect
                label="Status"
                allLabel="Any status"
                value={status || "any"}
                onChange={(v) =>
                  router.push(buildUrl({ status: v === "any" ? null : v }))
                }
                options={TV_STATUSES}
                displayValue={
                  TV_STATUSES.find((o) => o.value === status)?.label ??
                  "Any status"
                }
              />
              <FilterSelect
                label="Show type"
                allLabel="Any type"
                value={showType || "any"}
                onChange={(v) =>
                  router.push(buildUrl({ type: v === "any" ? null : v }))
                }
                options={TV_TYPES}
                displayValue={
                  TV_TYPES.find((o) => o.value === showType)?.label ??
                  "Any type"
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  allLabel,
  value,
  onChange,
  options,
  displayValue,
}: {
  label: string
  allLabel: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  displayValue: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <Select value={value} onValueChange={(v) => onChange(v ?? "any")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={allLabel}>{displayValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}
