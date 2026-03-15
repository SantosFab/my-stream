"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui"

type PaginationControlsProps = {
  currentPage: number
  totalPages: number
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // TMDB caps at 500 pages
  const maxPage = Math.min(totalPages, 500)

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
  }

  // Build page numbers with ellipsis
  const pages: (number | "…")[] = []
  const delta = 2
  const left = Math.max(1, currentPage - delta)
  const right = Math.min(maxPage, currentPage + delta)

  if (left > 1) {
    pages.push(1)
    if (left > 2) pages.push("…")
  }
  for (let i = left; i <= right; i++) {
    pages.push(i)
  }
  if (right < maxPage) {
    if (right < maxPage - 1) pages.push("…")
    pages.push(maxPage)
  }

  if (maxPage <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-muted-foreground text-xs select-none">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(p)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= maxPage}
      >
        Next
      </Button>
    </div>
  )
}
