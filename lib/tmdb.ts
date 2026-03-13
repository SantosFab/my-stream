import type {
  Movie,
  TVShow,
  Genre,
  Season,
  SeasonDetail,
  PaginatedResponse,
  VideosResponse,
  CreditsResponse,
  SearchResult,
} from "./types"

const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE = "https://image.tmdb.org/t/p"

export function getImageUrl(
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
) {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

function getHeaders() {
  const token = process.env.TMDB_API_TOKEN
  if (!token) throw new Error("TMDB_API_TOKEN is not set")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

async function fetcher<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  }
  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

// ─── Movies ───────────────────────────────────────────────────────────────────

export async function getTrendingMovies(timeWindow: "day" | "week" = "week") {
  return fetcher<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`)
}

export async function getPopularMovies(page = 1) {
  return fetcher<PaginatedResponse<Movie>>("/movie/popular", { page: String(page) })
}

export async function getNowPlayingMovies(page = 1) {
  return fetcher<PaginatedResponse<Movie>>("/movie/now_playing", { page: String(page) })
}

export async function getTopRatedMovies(page = 1) {
  return fetcher<PaginatedResponse<Movie>>("/movie/top_rated", { page: String(page) })
}

export async function getUpcomingMovies(page = 1) {
  return fetcher<PaginatedResponse<Movie>>("/movie/upcoming", { page: String(page) })
}

export async function getMovieDetails(id: number) {
  return fetcher<Movie>(`/movie/${id}`)
}

export async function getMovieVideos(id: number) {
  return fetcher<VideosResponse>(`/movie/${id}/videos`)
}

export async function getMovieCredits(id: number) {
  return fetcher<CreditsResponse>(`/movie/${id}/credits`)
}

export async function getSimilarMovies(id: number) {
  return fetcher<PaginatedResponse<Movie>>(`/movie/${id}/similar`)
}

// ─── TV Shows ─────────────────────────────────────────────────────────────────

export async function getTrendingTV(timeWindow: "day" | "week" = "week") {
  return fetcher<PaginatedResponse<TVShow>>(`/trending/tv/${timeWindow}`)
}

export async function getPopularTV(page = 1) {
  return fetcher<PaginatedResponse<TVShow>>("/tv/popular", { page: String(page) })
}

export async function getTopRatedTV(page = 1) {
  return fetcher<PaginatedResponse<TVShow>>("/tv/top_rated", { page: String(page) })
}

export async function getAiringTodayTV(page = 1) {
  return fetcher<PaginatedResponse<TVShow>>("/tv/airing_today", { page: String(page) })
}

export async function getTVDetails(id: number) {
  return fetcher<TVShow & { seasons: Season[] }>(`/tv/${id}`)
}

export async function getTVVideos(id: number) {
  return fetcher<VideosResponse>(`/tv/${id}/videos`)
}

export async function getTVCredits(id: number) {
  return fetcher<CreditsResponse>(`/tv/${id}/credits`)
}

export async function getSimilarTV(id: number) {
  return fetcher<PaginatedResponse<TVShow>>(`/tv/${id}/similar`)
}

export async function getTVSeason(tvId: number, seasonNumber: number) {
  return fetcher<SeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`)
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchMulti(query: string, page = 1) {
  return fetcher<PaginatedResponse<SearchResult>>("/search/multi", {
    query,
    page: String(page),
  })
}

export async function searchMovies(query: string, page = 1) {
  return fetcher<PaginatedResponse<Movie>>("/search/movie", {
    query,
    page: String(page),
  })
}

export async function searchTV(query: string, page = 1) {
  return fetcher<PaginatedResponse<TVShow>>("/search/tv", {
    query,
    page: String(page),
  })
}

// ─── Genres ───────────────────────────────────────────────────────────────────

export async function getMovieGenres() {
  return fetcher<{ genres: Genre[] }>("/genre/movie/list")
}

export async function getTVGenres() {
  return fetcher<{ genres: Genre[] }>("/genre/tv/list")
}

// ─── Discover ─────────────────────────────────────────────────────────────────

export async function discoverMovies(params: {
  page?: number
  genreId?: number
  sortBy?: string
}) {
  return fetcher<PaginatedResponse<Movie>>("/discover/movie", {
    page: String(params.page ?? 1),
    sort_by: params.sortBy ?? "popularity.desc",
    "vote_count.gte": "50",
    ...(params.genreId ? { with_genres: String(params.genreId) } : {}),
  })
}

export async function discoverTV(params: {
  page?: number
  genreId?: number
  sortBy?: string
}) {
  return fetcher<PaginatedResponse<TVShow>>("/discover/tv", {
    page: String(params.page ?? 1),
    sort_by: params.sortBy ?? "popularity.desc",
    "vote_count.gte": "50",
    ...(params.genreId ? { with_genres: String(params.genreId) } : {}),
  })
}
