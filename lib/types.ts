export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: Genre[]
  runtime?: number
  tagline?: string
  status?: string
  original_language?: string
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: Genre[]
  number_of_seasons?: number
  number_of_episodes?: number
  tagline?: string
  status?: string
  original_language?: string
  episode_run_time?: number[]
}

export interface Genre {
  id: number
  name: string
}

export interface Season {
  id: number
  name: string
  season_number: number
  episode_count: number
  poster_path: string | null
  air_date: string
  overview: string
}

export interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  air_date: string
  vote_average: number
  runtime: number | null
}

export interface SeasonDetail {
  id: number
  name: string
  season_number: number
  episodes: Episode[]
  poster_path: string | null
  air_date: string
  overview: string
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface VideosResponse {
  results: Video[]
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CreditsResponse {
  cast: Cast[]
}

export type MediaType = "movie" | "tv"

export interface SearchResult {
  id: number
  media_type: MediaType
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  // Make discriminated union helpers
  // We alias name/title for compatibility with Movie/TVShow
}
