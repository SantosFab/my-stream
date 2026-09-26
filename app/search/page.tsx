export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { searchMulti } from "@/lib/tmdb"
import { MediaCard } from "@/components/media-card"
import { PaginationControls } from "@/components/pagination-controls"
import type { SearchResult, Movie, TVShow } from "@/lib/types"

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageStr } = await searchParams
  const query = q?.trim() ?? ""
  const page = Math.max(1, Number(pageStr) || 1)

  const results = query ? await searchMulti(query, page) : null

  const mediaItems = results?.results.filter(
    (r): r is SearchResult & { media_type: "movie" | "tv" } =>
      r.media_type === "movie" || r.media_type === "tv"
  ) ?? []

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {results && (
          <p className="text-muted-foreground text-sm mt-1">
            {results.total_results.toLocaleString()} results
            {results.total_pages > 1 && (
              <>
                {" "}&middot; page {results.page} of {Math.min(results.total_pages, 500)}
              </>
            )}
          </p>
        )}
      </div>

      {!query && (
        <p className="text-muted-foreground">
          Use the search bar above to find movies and TV shows.
        </p>
      )}

      {query && mediaItems.length === 0 && (
        <p className="text-muted-foreground">No results found for &ldquo;{query}&rdquo;.</p>
      )}

      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {mediaItems.map((item) => (
            <MediaCard
              key={`${item.media_type}-${item.id}`}
              item={item as unknown as Movie | TVShow}
              type={item.media_type}
            />
          ))}
        </div>
      )}

      {results && (
        <Suspense>
          <PaginationControls currentPage={page} totalPages={results.total_pages} />
        </Suspense>
      )}
    </main>
  )
}
