export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { MediaCard } from "@/components/media-card"
import { FilterBar } from "@/components/filter-bar"
import { PaginationControls } from "@/components/pagination-controls"
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieGenres,
  discoverMovies,
} from "@/lib/tmdb"
import type { PaginatedResponse, Movie } from "@/lib/types"

const MOVIE_CATEGORIES = [
  { value: "popular", label: "Popular" },
  { value: "now_playing", label: "Now Playing" },
  { value: "top_rated", label: "Top Rated" },
  { value: "upcoming", label: "Upcoming" },
]

function categoryToSortBy(category: string): string {
  switch (category) {
    case "top_rated":
      return "vote_average.desc"
    case "upcoming":
      return "primary_release_date.asc"
    default:
      return "popularity.desc"
  }
}

async function fetchMovies(category: string, page: number): Promise<PaginatedResponse<Movie>> {
  switch (category) {
    case "now_playing":
      return getNowPlayingMovies(page)
    case "top_rated":
      return getTopRatedMovies(page)
    case "upcoming":
      return getUpcomingMovies(page)
    default:
      return getPopularMovies(page)
  }
}

type MoviesPageProps = {
  searchParams: Promise<{ category?: string; genre?: string; page?: string }>
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { category = "popular", genre, page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const genreId = genre ? Number(genre) : undefined

  const [genresData, results] = await Promise.all([
    getMovieGenres(),
    genreId
      ? discoverMovies({ page, genreId, sortBy: categoryToSortBy(category) })
      : fetchMovies(category, page),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Movies</h1>

      <Suspense>
        <FilterBar categories={MOVIE_CATEGORIES} genres={genresData.genres} />
      </Suspense>

      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {results.total_results.toLocaleString()} results &middot; page {results.page} of{" "}
          {Math.min(results.total_pages, 500).toLocaleString()}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {results.results.map((movie) => (
            <MediaCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </div>

      <Suspense>
        <PaginationControls currentPage={page} totalPages={results.total_pages} />
      </Suspense>
    </main>
  )
}
