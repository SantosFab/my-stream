export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { MediaCard } from "@/components/media-card"
import { FilterBar } from "@/components/filter-bar"
import { PaginationControls } from "@/components/pagination-controls"
import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getTVGenres,
  discoverTV,
} from "@/lib/tmdb"
import type { PaginatedResponse, TVShow } from "@/lib/types"

const TV_CATEGORIES = [
  { value: "popular", label: "Popular" },
  { value: "airing_today", label: "Airing Today" },
  { value: "top_rated", label: "Top Rated" },
]

function categoryToSortBy(category: string): string {
  switch (category) {
    case "top_rated":
      return "vote_average.desc"
    default:
      return "popularity.desc"
  }
}

async function fetchTV(category: string, page: number): Promise<PaginatedResponse<TVShow>> {
  switch (category) {
    case "airing_today":
      return getAiringTodayTV(page)
    case "top_rated":
      return getTopRatedTV(page)
    default:
      return getPopularTV(page)
  }
}

type TVPageProps = {
  searchParams: Promise<{ category?: string; genre?: string; page?: string }>
}

export default async function TVPage({ searchParams }: TVPageProps) {
  const { category = "popular", genre, page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const genreId = genre ? Number(genre) : undefined

  const [genresData, results] = await Promise.all([
    getTVGenres(),
    genreId
      ? discoverTV({ page, genreId, sortBy: categoryToSortBy(category) })
      : fetchTV(category, page),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">TV Shows</h1>

      <Suspense>
        <FilterBar categories={TV_CATEGORIES} genres={genresData.genres} />
      </Suspense>

      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {results.total_results.toLocaleString()} results &middot; page {results.page} of{" "}
          {Math.min(results.total_pages, 500).toLocaleString()}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {results.results.map((show) => (
            <MediaCard key={show.id} item={show} type="tv" />
          ))}
        </div>
      </div>

      <Suspense>
        <PaginationControls currentPage={page} totalPages={results.total_pages} />
      </Suspense>
    </main>
  )
}
