"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { buttonVariants } from "@/components/ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon, StarIcon } from "@hugeicons/core-free-icons"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import type { Season, Episode } from "@/lib/types"

type SeasonSelectorProps = {
  tvId: number
  seasons: Season[]
  selectedSeason?: number
  onSeasonChange?: (season: number) => void
  episodes?: Episode[]
}

export function SeasonSelector({
  tvId,
  seasons,
  selectedSeason = 1,
  onSeasonChange,
  episodes = [],
}: SeasonSelectorProps) {
  const selectedSeasonValue = String(selectedSeason)

  const validSeasons = seasons.filter((s) => s.season_number > 0)
  const selectedSeasonLabel = validSeasons.find(
    (s) => String(s.season_number) === selectedSeasonValue
  )
    ? `Season ${selectedSeasonValue}`
    : "Season"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Episodes</h2>
        <Select
          value={selectedSeasonValue}
          onValueChange={(v) => onSeasonChange?.(Number(v))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Season">{selectedSeasonLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {validSeasons.map((s) => (
              <SelectItem key={s.season_number} value={String(s.season_number)}>
                Season {s.season_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {episodes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No episodes available.</p>
      ) : (
        <div className="grid gap-3">
          {episodes.map((ep) => {
            const still = getImageUrl(ep.still_path, "w342")
            return (
              <div
                key={ep.id}
                className="flex gap-3 rounded-lg border border-border/50 bg-card p-3 hover:border-border transition-colors"
              >
                <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md bg-muted">
                  {still ? (
                    <Image src={still} alt={ep.name} fill sizes="144px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-xs">No image</div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">E{ep.episode_number}</span>
                      <h3 className="text-sm font-medium leading-tight">{ep.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <HugeiconsIcon icon={StarIcon} className="size-3 text-yellow-500" strokeWidth={1.5} />
                      <span className="text-xs text-muted-foreground">{ep.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  {ep.runtime && (
                    <span className="text-xs text-muted-foreground">{ep.runtime} min</span>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{ep.overview}</p>
                  <div className="mt-auto">
                    <Link
                      href={`/watch/tv/${tvId}?season=${selectedSeasonValue}&episode=${ep.episode_number}`}
                      className={cn(buttonVariants({ size: "sm" }), "gap-1.5 h-7 text-xs")}
                    >
                      <HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} className="size-3" />
                      Watch
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
