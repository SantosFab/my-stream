"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { useFavorites } from "@/components/favorites-provider"
import { cn } from "@/lib/utils"

type FavoriteHeartButtonProps = {
  type: "movie" | "tv"
  id: number
  title: string
  className?: string
}

/**
 * Heart overlay for media cards (listings). Hidden until the TMDB
 * connection and the favorite ids are loaded; hidden entirely when
 * TMDB is not connected. Filled red when favorited.
 */
export function FavoriteHeartButton({
  type,
  id,
  title,
  className,
}: FavoriteHeartButtonProps) {
  const { connected, isFavorite, toggleFavorite } = useFavorites()

  if (connected !== true) return null
  const active = isFavorite(type, id)

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(type, id)
      }}
      className={cn(
        "rounded-md bg-black/60 p-1.5 backdrop-blur-sm transition-colors hover:bg-black/80",
        className
      )}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        strokeWidth={1.5}
        fill={active ? "currentColor" : "none"}
        className={cn("size-4", active ? "text-red-500" : "text-white")}
      />
    </button>
  )
}
