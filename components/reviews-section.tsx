"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { Review } from "@/lib/types"

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)
  const rating = review.author_details?.rating
  const date = review.created_at ? new Date(review.created_at) : null

  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">{review.author}</span>
        {typeof rating === "number" && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={StarIcon} strokeWidth={1.5} className="size-3 text-yellow-500" />
            {rating.toFixed(1)}
          </span>
        )}
        {date && !isNaN(date.getTime()) && (
          <span className="text-xs text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          !expanded && "line-clamp-4"
        )}
      >
        {review.content}
      </p>
      {review.content.length > 300 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start text-xs font-medium text-foreground hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </article>
  )
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null
  const top = reviews.slice(0, 5)

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        Reviews{" "}
        <span className="text-sm font-normal text-muted-foreground">
          ({reviews.length})
        </span>
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {top.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}
