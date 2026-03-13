import { notFound } from "next/navigation"
import Link from "next/link"
import { getTVDetails, getTVSeason, getImageUrl } from "@/lib/tmdb"
import { VideoPlayer } from "@/components/video-player"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button-variants"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { SeasonEpisodeLoader } from "@/components/season-episode-loader"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

type WatchTVPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ season?: string; episode?: string }>
}

export default async function WatchTVPage({ params, searchParams }: WatchTVPageProps) {
  const { id } = await params
  const { season, episode } = await searchParams

  const tvId = Number(id)
  if (isNaN(tvId)) notFound()

  const tv = await getTVDetails(tvId).catch(() => null)
  if (!tv) notFound()

  const seasonNum = Number(season) || 1
  const episodeNum = Number(episode) || 1

  const seasonDetail = await getTVSeason(tvId, seasonNum).catch(() => null)
  const currentEpisode = seasonDetail?.episodes.find((e) => e.episode_number === episodeNum)

  const posterUrl = getImageUrl(tv.poster_path, "w342")
  const firstSeason = tv.seasons?.find((s) => s.season_number > 0)

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/tv/${tv.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.5} className="size-4" />
          Back
        </Link>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold truncate">{tv.name}</h1>
          {currentEpisode && (
            <span className="text-xs text-muted-foreground">
              S{seasonNum} E{episodeNum} — {currentEpisode.name}
            </span>
          )}
        </div>
      </div>

      <VideoPlayer type="tv" id={tvId} season={seasonNum} episode={episodeNum} />

      {currentEpisode && (
        <div className="flex gap-4 flex-col sm:flex-row">
          {posterUrl && (
            <div className="relative w-24 shrink-0">
              <Image src={posterUrl} alt={tv.name} width={96} height={144} className="w-full rounded-md" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">{tv.name}</h2>
            <p className="text-sm font-medium">
              S{seasonNum}E{episodeNum} — {currentEpisode.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {tv.genres?.map((g) => (
                <Badge key={g.id} variant="secondary" className="text-xs">{g.name}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <HugeiconsIcon icon={StarIcon} className="size-4 text-yellow-500" strokeWidth={1.5} />
              <span className="font-semibold">{currentEpisode.vote_average.toFixed(1)}</span>
              {currentEpisode.runtime && (
                <span className="text-muted-foreground ml-2">{currentEpisode.runtime} min</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {currentEpisode.overview || tv.overview}
            </p>
          </div>
        </div>
      )}

      {tv.seasons && tv.seasons.length > 0 && (
        <div className="border-t border-border pt-6">
          <SeasonEpisodeLoader
            tvId={tvId}
            seasons={tv.seasons}
            initialSeasonNumber={firstSeason?.season_number ?? 1}
            initialEpisodes={seasonDetail?.episodes ?? []}
          />
        </div>
      )}
    </main>
  )
}
