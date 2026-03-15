"use client"

import { useEffect, useState, useTransition } from "react"
import { SeasonSelector } from "@/components/season-selector"
import type { Season, Episode } from "@/lib/types"

type SeasonEpisodeLoaderProps = {
  tvId: number
  seasons: Season[]
  initialSeasonNumber: number
  initialEpisodes: Episode[]
}

export function SeasonEpisodeLoader({
  tvId,
  seasons,
  initialSeasonNumber,
  initialEpisodes,
}: SeasonEpisodeLoaderProps) {
  const [selectedSeason, setSelectedSeason] = useState(initialSeasonNumber)
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setSelectedSeason(initialSeasonNumber)
    setEpisodes(initialEpisodes)
  }, [initialSeasonNumber, initialEpisodes])

  useEffect(() => {
    if (selectedSeason === initialSeasonNumber) {
      setEpisodes(initialEpisodes)
      return
    }

    startTransition(async () => {
      const res = await fetch(`/api/tv/${tvId}/season/${selectedSeason}`)
      if (res.ok) {
        const data = await res.json()
        setEpisodes(data.episodes ?? [])
      }
    })
  }, [selectedSeason, tvId, initialSeasonNumber, initialEpisodes])

  return (
    <SeasonSelector
      tvId={tvId}
      seasons={seasons}
      selectedSeason={selectedSeason}
      onSeasonChange={setSelectedSeason}
      episodes={episodes}
    />
  )
}
