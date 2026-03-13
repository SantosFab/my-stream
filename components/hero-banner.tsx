import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button-variants"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon, StarIcon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Movie, TVShow, Genre } from "@/lib/types"

function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item
}

type HeroBannerProps = {
  item: Movie | TVShow
  type: "movie" | "tv"
}

export function HeroBanner({ item, type }: HeroBannerProps) {
  const title = isMovie(item) ? item.title : item.name
  const backdropUrl = getImageUrl(item.backdrop_path, "original")

  return (
    <div className="relative w-full overflow-hidden min-h-125">
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end gap-4 px-4 py-16 min-h-125">
        <div className="flex flex-wrap gap-2">
          {item.genres?.map((g: Genre) => (
            <Badge key={g.id} variant="secondary" className="text-xs">
              {g.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl max-w-2xl">
          {title}
        </h1>
        {item.tagline && (
          <p className="text-muted-foreground italic text-sm max-w-xl">{item.tagline}</p>
        )}
        <p className="max-w-xl text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {item.overview}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={StarIcon} className="size-4 text-yellow-500" strokeWidth={1.5} />
            <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
            <span className="text-muted-foreground text-xs">({item.vote_count.toLocaleString()})</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">
            {isMovie(item)
              ? item.release_date
                ? new Date(item.release_date).getFullYear()
                : "—"
              : item.first_air_date
              ? new Date(item.first_air_date).getFullYear()
              : "—"}
          </span>
          {isMovie(item) && item.runtime && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{item.runtime} min</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href={`/watch/${type}/${item.id}`}
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            <HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} className="size-4" />
            Watch Now
          </Link>
          <Link
            href={`/${type}/${item.id}`}
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
          >
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.5} className="size-4" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  )
}
